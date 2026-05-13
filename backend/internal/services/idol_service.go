package services

import (
	"errors"
	"time"

	"e-idol-backend/internal/models"

	"gorm.io/gorm"
)

var ErrWithdrawExceedsBalance = errors.New("withdraw amount exceeds withdrawable balance")

// EarningsSummary is the response payload for GET /idol/me/earnings.
type EarningsSummary struct {
	WithdrawableBalance int64 `json:"withdrawable_balance"`
	TotalEarnings       int64 `json:"total_earnings"`
	TotalTipsCount      int64 `json:"total_tips_count"`
}

type IdolService struct {
	db *gorm.DB
}

func NewIdolService(db *gorm.DB) *IdolService {
	return &IdolService{db: db}
}

// GetEarnings returns the earnings snapshot and aggregate tip count for the idol.
func (s *IdolService) GetEarnings(idolID uint) (*EarningsSummary, error) {
	var idol models.Idol
	if err := s.db.First(&idol, idolID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrIdolNotFound
		}
		return nil, err
	}

	var count int64
	if err := s.db.Model(&models.TipRecord{}).Where("idol_id = ?", idolID).Count(&count).Error; err != nil {
		return nil, err
	}

	return &EarningsSummary{
		WithdrawableBalance: idol.WithdrawableBalance,
		TotalEarnings:       idol.TotalEarnings,
		TotalTipsCount:      count,
	}, nil
}

// ListTipRecords returns a paginated list of tip records for the idol.
func (s *IdolService) ListTipRecords(idolID uint, page, pageSize int) ([]models.TipRecord, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	var records []models.TipRecord
	var total int64

	q := s.db.Model(&models.TipRecord{}).Where("idol_id = ?", idolID)
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&records).Error; err != nil {
		return nil, 0, err
	}

	return records, total, nil
}

// RequestWithdraw validates that the idol has sufficient withdrawable balance,
// creates a WithdrawRequest, and atomically moves the requested amount from
// WithdrawableBalance to FrozenWithdrawable in a single transaction.
func (s *IdolService) RequestWithdraw(idolID uint, amount int64) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var idol models.Idol
		if err := tx.Clauses().Where("id = ?", idolID).First(&idol).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrIdolNotFound
			}
			return err
		}

		if amount > idol.WithdrawableBalance {
			return ErrWithdrawExceedsBalance
		}

		// Atomically move funds: withdrawable → frozen
		if err := tx.Model(&models.Idol{}).Where("id = ?", idolID).Updates(map[string]interface{}{
			"withdrawable_balance": gorm.Expr("withdrawable_balance - ?", amount),
			"frozen_withdrawable":  gorm.Expr("frozen_withdrawable + ?", amount),
		}).Error; err != nil {
			return err
		}

		now := time.Now()
		req := models.WithdrawRequest{
			IdolID:    idolID,
			Amount:    amount,
			Status:    models.WithdrawStatusPending,
			AppliedAt: now,
		}
		return tx.Create(&req).Error
	})
}
