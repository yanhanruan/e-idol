package services

import (
	"fmt"
	"sync"
	"time"

	"e-idol-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// commissionCacheEntry holds a single cached commission rate reading.
type commissionCacheEntry struct {
	rate     int
	cachedAt time.Time
}

// commissionRateCache is a package-level in-memory cache for the active
// platform commission rate. A sync.Map is used so concurrent requests share
// a single cached value without lock contention.
var (
	commissionRateCache sync.Map
	commissionCacheTTL  = 5 * time.Minute
)

type TipService struct {
	db        *gorm.DB
	walletSvc *WalletService
	vipSvc    *VipService
}

func NewTipService(db *gorm.DB) *TipService {
	return &TipService{
		db:        db,
		walletSvc: NewWalletService(db),
		vipSvc:    NewVipService(db),
	}
}

// getVipDiscountRate returns the consumer's VIP discount rate in basis points
// (e.g. 9000 = pay 90% = 10% off). Returns 10000 (no discount) when the user
// is not an active VIP or the plan cannot be resolved.
func (s *TipService) getVipDiscountRate(userID uint) int {
	userVip, err := s.vipSvc.GetUserVipStatus(userID)
	if err != nil || userVip.Level == 0 || userVip.LastPlanID == 0 {
		return 10000
	}
	var plan models.VipPlan
	if err := s.db.Select("discount_rate").First(&plan, userVip.LastPlanID).Error; err != nil {
		return 10000
	}
	return plan.DiscountRate
}

// getEffectiveCommissionRate returns the currently active commission rate in
// basis points. The result is cached for commissionCacheTTL (5 minutes) to
// avoid a DB hit on every tip request. On a cache miss the query selects the
// latest PlatformCommissionConfig where EffectiveAt <= now.
func (s *TipService) getEffectiveCommissionRate() (int, error) {
	now := time.Now()

	if v, ok := commissionRateCache.Load("active_rate"); ok {
		entry := v.(commissionCacheEntry)
		if now.Sub(entry.cachedAt) < commissionCacheTTL {
			return entry.rate, nil
		}
	}

	var config models.PlatformCommissionConfig
	if err := s.db.Where("effective_at <= ?", now).
		Order("effective_at DESC").
		First(&config).Error; err != nil {
		return 0, err
	}

	commissionRateCache.Store("active_rate", commissionCacheEntry{
		rate:     config.CommissionRate,
		cachedAt: now,
	})

	return config.CommissionRate, nil
}

// Tip executes the three-party fund flow for a single tipping transaction.
// All monetary steps run inside one DB transaction; any failure causes a full rollback.
//
// Amount semantics:
//
//	originalAmount   = amount (declared tip value)
//	paidAmount       = originalAmount * vipDiscountRate / 10000  (what consumer is charged)
//	discountAmount   = originalAmount - paidAmount               (platform-absorbed subsidy)
//	settlementAmount = originalAmount                            (basis for idol split)
//
// Revenue split on settlementAmount:
//
//	commission = settlementAmount * commissionRate / 10000  (floor — favours idol)
//	idolIncome = settlementAmount - commission
//
// The platform's net revenue on this tip = commission - discountAmount.
func (s *TipService) Tip(fromUserID, idolID, amount int64) (*models.TipRecord, error) {
	// Resolve VIP discount before the transaction to keep the critical path short.
	// A narrow window where VIP status changes mid-flight is acceptable.
	vipDiscountRate := s.getVipDiscountRate(uint(fromUserID))

	// Calculate consumer-facing amounts outside the transaction (pure arithmetic).
	originalAmount := amount
	// Mirrors pkg/utils.ApplyDiscount — inlined to avoid an import cycle with pkg/utils/response.go.
	paidAmount := originalAmount
	if vipDiscountRate > 0 && vipDiscountRate < 10000 {
		paidAmount = (originalAmount*int64(vipDiscountRate) + 9999) / 10000
	}
	discountAmount := originalAmount - paidAmount
	settlementAmount := originalAmount // always equals originalAmount for now

	var tipRecord models.TipRecord

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 1. Query Idol and verify status = active.
		var idol models.Idol
		if err := tx.Where("id = ?", idolID).First(&idol).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrIdolNotFound
			}
			return err
		}
		if idol.Status != models.IdolStatusActive {
			return ErrIdolBanned
		}

		// 2. Load effective commission rate (5-min in-memory cache).
		rate, err := s.getEffectiveCommissionRate()
		if err != nil {
			return fmt.Errorf("commission rate unavailable: %w", err)
		}

		// 3. Revenue split on settlementAmount.
		commission := settlementAmount * int64(rate) / 10000 // floor — favours idol over platform
		idolIncome := settlementAmount - commission

		// 4. Deduct paidAmount from consumer wallet (reuses the outer transaction).
		ledgerTxID := uuid.New().String()
		_, err = s.walletSvc.applyTransactionTx(tx, ApplyTxRequest{
			UserID:          uint(fromUserID),
			Amount:          -paidAmount,
			TransactionID:   ledgerTxID,
			TransactionType: models.TxTypeTip,
			ReferenceID:     fmt.Sprintf("tip:%s", ledgerTxID),
			Remark:          fmt.Sprintf("tip to idol #%d", idolID),
		})
		if err != nil {
			return err
		}

		// 5. Atomically increment idol balance on settlementAmount — no read-modify-write.
		if err := tx.Model(&models.Idol{}).Where("id = ?", idol.ID).Updates(map[string]interface{}{
			"withdrawable_balance": gorm.Expr("withdrawable_balance + ?", idolIncome),
			"total_earnings":       gorm.Expr("total_earnings + ?", settlementAmount),
		}).Error; err != nil {
			return err
		}

		// 6. Insert TipRecord with all four amount fields persisted.
		tipRecord = models.TipRecord{
			FromUserID:       uint(fromUserID),
			IdolID:           uint(idolID),
			OriginalAmount:   originalAmount,
			PaidAmount:       paidAmount,
			DiscountAmount:   discountAmount,
			SettlementAmount: settlementAmount,
			CommissionAmount: commission,
			IdolIncome:       idolIncome,
			LedgerTxID:       ledgerTxID,
		}
		if err := tx.Create(&tipRecord).Error; err != nil {
			return err
		}

		// 7. Insert a LedgerRecord from the idol's perspective so idols can
		// query their income history via the same ledger API.
		// WalletID is 0: idol income is tracked on Idol.WithdrawableBalance,
		// not on a consumer Wallet; the field is informational here.
		idolLedger := models.LedgerRecord{
			TransactionID:   uuid.New().String(),
			WalletID:        0,
			UserID:          idol.UserID,
			Amount:          idolIncome,
			BalanceBefore:   idol.WithdrawableBalance,
			BalanceAfter:    idol.WithdrawableBalance + idolIncome,
			TransactionType: models.TxTypeTipIncome,
			Status:          models.TxStatusSuccess,
			ReferenceID:     fmt.Sprintf("tip:%s", ledgerTxID),
		}
		return tx.Create(&idolLedger).Error
	})

	if err != nil {
		return nil, err
	}

	return &tipRecord, nil
}
