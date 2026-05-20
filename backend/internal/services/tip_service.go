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
}

func NewTipService(db *gorm.DB) *TipService {
	return &TipService{
		db:        db,
		walletSvc: NewWalletService(db),
	}
}

// ── Amount computation helpers ────────────────────────────────────────────────

// computePaidAmount applies a VIP discount rate (basis points) to the original
// tip amount to derive what the consumer is actually charged.
//
// Mirrors pkg/utils.ApplyDiscount — inlined to avoid an import cycle with
// pkg/utils/response.go which imports the services package.
//
// Ceiling division keeps fractional cents on the consumer side so the platform
// never absorbs more than (originalAmount - paidAmount).
func computePaidAmount(originalAmount int64, vipDiscountRate int) int64 {
	if vipDiscountRate <= 0 || vipDiscountRate >= 10000 {
		return originalAmount // no discount: guard against invalid rates
	}
	return (originalAmount*int64(vipDiscountRate) + 9999) / 10000
}

// computeSettlementAmount returns the amount used as the basis for idol
// commission calculation.
//
// Currently equal to originalAmount. Isolated as a named function so that
// future divergence (e.g. partial refunds, multi-tier platform subsidies)
// requires a change in exactly one place rather than hunting call sites.
func computeSettlementAmount(originalAmount int64) int64 {
	return originalAmount
}

// ── VIP discount resolution ───────────────────────────────────────────────────

// resolveVipDiscountTx returns the consumer's active VIP discount rate in
// basis points using the provided transaction (tx), ensuring the VIP state read
// is consistent with the tip write that follows in the same transaction.
//
// Trade-off vs. pre-transaction lookup:
//   - PRO  stronger consistency: the discount applied matches the VIP state at
//     the exact instant the tip record is written; no stale-read window.
//   - CON  two additional SELECT statements on the critical path (user_vip and
//     vip_plans). Both are point reads on indexed columns; latency impact is
//     sub-millisecond under normal load.
//
// Returns 10000 (no discount) when:
//   - the user has no user_vip row with level > 0, or
//   - the VIP subscription has expired (expiry check done inline; the lazy-update
//     of user_vip.level is intentionally omitted here to avoid an unrelated write
//     in the tip transaction — the nightly job and VipService handle cleanup), or
//   - the associated VipPlan cannot be queried.
func resolveVipDiscountTx(tx *gorm.DB, userID uint) int {
	var userVip models.UserVip
	if err := tx.Where("user_id = ? AND level > 0", userID).First(&userVip).Error; err != nil {
		return 10000
	}
	if !userVip.ExpireAt.After(time.Now()) || userVip.LastPlanID == 0 {
		return 10000
	}
	var plan models.VipPlan
	if err := tx.Select("discount_rate").First(&plan, userVip.LastPlanID).Error; err != nil {
		return 10000
	}
	return plan.DiscountRate
}

// ── Commission rate ───────────────────────────────────────────────────────────

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

// ── Tip transaction ───────────────────────────────────────────────────────────

// Tip executes the three-party fund flow for a single tipping transaction.
// All monetary steps run inside one DB transaction; any failure causes a full rollback.
//
// Amount flow:
//
//	originalAmount   = amount  (declared by consumer)
//	vipDiscountRate  = resolved inside the transaction (consistent with the write)
//	paidAmount       = computePaidAmount(originalAmount, vipDiscountRate)
//	discountAmount   = originalAmount - paidAmount      (platform-absorbed subsidy)
//	settlementAmount = computeSettlementAmount(originalAmount)
//
// Revenue split on settlementAmount:
//
//	commission = settlementAmount * commissionRate / 10000  (floor — favours idol)
//	idolIncome = settlementAmount - commission
//
// Enforcement guarantees:
//   - All four amount fields are set explicitly on every write (no reliance on DB defaults).
//   - DB CHECK constraints (chk_tip_*) provide a second layer of defence.
//   - For non-VIP users vipDiscountRate = 10000, so paidAmount = originalAmount
//     and discountAmount = 0 by construction — no special-case branch needed.
func (s *TipService) Tip(fromUserID, idolID, amount int64) (*models.TipRecord, error) {
	originalAmount := amount

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

		// 3. Resolve VIP discount inside the transaction for consistency.
		vipDiscountRate := resolveVipDiscountTx(tx, uint(fromUserID))

		// 4. Derive all four amount fields.
		paidAmount := computePaidAmount(originalAmount, vipDiscountRate)
		discountAmount := originalAmount - paidAmount
		settlementAmount := computeSettlementAmount(originalAmount)

		// 5. Revenue split on settlementAmount.
		commission := settlementAmount * int64(rate) / 10000 // floor — favours idol over platform
		idolIncome := settlementAmount - commission

		// 6. Deduct paidAmount from consumer wallet (reuses the outer transaction).
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

		// 7. Atomically increment idol balance on settlementAmount — no read-modify-write.
		if err := tx.Model(&models.Idol{}).Where("id = ?", idol.ID).Updates(map[string]interface{}{
			"withdrawable_balance": gorm.Expr("withdrawable_balance + ?", idolIncome),
			"total_earnings":       gorm.Expr("total_earnings + ?", settlementAmount),
		}).Error; err != nil {
			return err
		}

		// 8. Insert TipRecord — all four amount fields explicitly set on every write.
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

		// 9. Insert a LedgerRecord from the idol's perspective so idols can
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
