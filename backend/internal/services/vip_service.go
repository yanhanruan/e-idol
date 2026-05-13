package services

import (
	"fmt"
	"time"

	"e-idol-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VipService struct {
	db        *gorm.DB
	walletSvc *WalletService
}

func NewVipService(db *gorm.DB) *VipService {
	return &VipService{
		db:        db,
		walletSvc: NewWalletService(db),
	}
}

// PurchaseVip purchases a VIP plan for a user inside a single atomic transaction:
//  1. Validates that the plan exists and is active.
//  2. Deducts the plan price from the user's wallet via applyTransactionTx
//     (reuses the outer transaction — no nested transaction is opened).
//  3. Creates or updates UserVip:
//     - Active subscription: stacks duration on top of the current expiry.
//     - Expired or new: sets expiry to now + plan duration.
//     - Level is always set to the higher of the current and plan levels.
//
// If the wallet deduction fails (e.g. ErrInsufficientBalance), the entire
// transaction rolls back automatically.
func (s *VipService) PurchaseVip(userID, planID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// 1. Query VipPlan and validate IsActive = true.
		var plan models.VipPlan
		if err := tx.Where("id = ? AND is_active = ?", planID, true).First(&plan).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrVipPlanNotFound
			}
			return err
		}

		// 2. Deduct wallet balance within the same transaction.
		_, err := s.walletSvc.applyTransactionTx(tx, ApplyTxRequest{
			UserID:          userID,
			Amount:          -plan.Price, // negative = debit
			TransactionID:   uuid.New().String(),
			TransactionType: models.TxTypeConsume,
			ReferenceID:     fmt.Sprintf("vip:%d", planID),
			Remark:          fmt.Sprintf("purchase VIP plan: %s", plan.Name),
		})
		if err != nil {
			return err
		}

		// 3. Upsert UserVip.
		now := time.Now()
		var userVip models.UserVip

		if err := tx.Where("user_id = ?", userID).First(&userVip).Error; err != nil {
			if err != gorm.ErrRecordNotFound {
				return err
			}
			// First-time VIP purchase.
			return tx.Create(&models.UserVip{
				UserID:     userID,
				Level:      plan.Level,
				ExpireAt:   now.AddDate(0, 0, plan.DurationDays),
				LastPlanID: planID,
				AutoRenew:  false,
			}).Error
		}

		// Renewal: stack duration if still active, otherwise start fresh from now.
		var newExpire time.Time
		if userVip.ExpireAt.After(now) {
			newExpire = userVip.ExpireAt.AddDate(0, 0, plan.DurationDays)
		} else {
			newExpire = now.AddDate(0, 0, plan.DurationDays)
		}

		// Level is never downgraded.
		newLevel := userVip.Level
		if plan.Level > newLevel {
			newLevel = plan.Level
		}

		return tx.Model(&userVip).Updates(map[string]interface{}{
			"level":        newLevel,
			"expire_at":    newExpire,
			"last_plan_id": planID,
		}).Error
	})
}
