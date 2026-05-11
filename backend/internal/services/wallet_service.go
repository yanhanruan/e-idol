package services

import (
	"context"
	"math/rand"
	"time"

	"e-idol-backend/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type WalletService struct {
	db *gorm.DB
}

func NewWalletService(db *gorm.DB) *WalletService {
	return &WalletService{db: db}
}

type ApplyTxRequest struct {
	UserID          uint
	Amount          int64
	TransactionID   string
	TransactionType models.TransactionType
	ReferenceID     string
	Remark          string
}

/*
Architecture Design Notes:
1. Why optimistic locking instead of pessimistic locking (FOR UPDATE)?
   - In high-concurrency scenarios such as top-ups and tips, pessimistic locking can hold database connections for extended periods, reducing system throughput and increasing the risk of deadlocks.
   - Optimistic locking, controlled via a version field, avoids prolonged row lock retention and delivers better performance in read-heavy or short-write-conflict workloads.

2. Why is the retry limit set to 3?
   - Automatic retries resolve occasional concurrent conflicts. However, if conflicts are too frequent (e.g., a hot account receiving a high volume of tips simultaneously), unlimited retries can exhaust CPU resources.
   - Three retries combined with random exponential backoff (jitter, rand.Intn(50) * time.Millisecond) effectively stagger concurrent requests, resolving most optimistic locking failures while preventing herd behavior that could lead to system collapse.
*/

func (s *WalletService) ApplyTransaction(ctx context.Context, req ApplyTxRequest) (*models.LedgerRecord, error) {
	maxRetries := 3
	var result *models.LedgerRecord
	var err error

	for attempt := 0; attempt <= maxRetries; attempt++ {
		result, err = s.tryApplyTransaction(req)
		if err == nil {
			return result, nil // success
		}

		if err != ErrConcurrentConflict {
			return nil, err // return other business errors or DB errors directly without retry
		}

		if attempt < maxRetries {
			// random sleep to avoid herd behavior
			time.Sleep(time.Duration(rand.Intn(50)) * time.Millisecond)
		}
	}

	return nil, err // max retries exceeded
}

func (s *WalletService) tryApplyTransaction(req ApplyTxRequest) (*models.LedgerRecord, error) {
	var ledger models.LedgerRecord

	// idempotency check (read outside the transaction; if the record exists and its status is success, return it directly)
	if err := s.db.Where("transaction_id = ?", req.TransactionID).First(&ledger).Error; err == nil {
		if ledger.Status == models.TxStatusSuccess {
			return &ledger, nil
		}
	}

	var createdLedger models.LedgerRecord

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 1. read the current wallet state
		var wallet models.Wallet
		if err := tx.Where("user_id = ?", req.UserID).First(&wallet).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrWalletNotFound
			}
			return err
		}

		// 2. balance check (for debit operations)
		if req.Amount < 0 && wallet.Balance+req.Amount < 0 {
			return ErrInsufficientBalance
		}

		balanceBefore := wallet.Balance
		balanceAfter := wallet.Balance + req.Amount

		// 3. optimistic lock update on balance
		result := tx.Model(&models.Wallet{}).
			Where("id = ? AND version = ?", wallet.ID, wallet.Version).
			Updates(map[string]interface{}{
				"balance": balanceAfter,
				"version": wallet.Version + 1,
			})

		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			// concurrent conflict: the record was modified by another request
			return ErrConcurrentConflict
		}

		// 4. write the ledger record snapshot
		createdLedger = models.LedgerRecord{
			TransactionID:   req.TransactionID,
			WalletID:        wallet.ID,
			UserID:          req.UserID,
			Amount:          req.Amount,
			BalanceBefore:   balanceBefore,
			BalanceAfter:    balanceAfter,
			TransactionType: req.TransactionType,
			Status:          models.TxStatusSuccess,
			ReferenceID:     req.ReferenceID,
			Remark:          req.Remark,
		}

		if err := tx.Create(&createdLedger).Error; err != nil {
			return err // a unique index conflict will be raised here if the idempotency key collides
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &createdLedger, nil
}

/*
ApplyTransactionWithLock uses pessimistic locking (FOR UPDATE) to perform fund operations.
Constraints and usage guidelines:
1. Intended only for low-frequency administrative scenarios such as refunds, reconciliation corrections, and batch coupon issuance.
2. Must NOT be called from high-frequency user-facing endpoints (e.g., top-ups, tips) to avoid exhausting the database connection pool or causing deadlocks.
3. While holding the lock (inside the transaction function), do NOT include any RPC calls, external HTTP requests, or time-consuming computations.
*/
// CreatePendingRecharge creates a ledger record with status=pending for an incoming
// recharge. It does NOT modify the wallet balance; balance settlement happens when
// the payment gateway callback confirms the transaction.
func (s *WalletService) CreatePendingRecharge(userID uint, amount int64, txID string) (*models.LedgerRecord, error) {
	var wallet models.Wallet
	if err := s.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrWalletNotFound
		}
		return nil, err
	}

	record := models.LedgerRecord{
		TransactionID:   txID,
		WalletID:        wallet.ID,
		UserID:          userID,
		Amount:          amount,
		BalanceBefore:   wallet.Balance,
		BalanceAfter:    wallet.Balance, // balance unchanged until payment is confirmed
		TransactionType: models.TxTypeRecharge,
		Status:          models.TxStatusPending,
	}

	if err := s.db.Create(&record).Error; err != nil {
		return nil, err
	}

	return &record, nil
}

func (s *WalletService) ApplyTransactionWithLock(ctx context.Context, req ApplyTxRequest) (*models.LedgerRecord, error) {
	var ledger models.LedgerRecord

	// idempotency check (read outside the transaction; if the record exists and its status is success, return it directly)
	if err := s.db.Where("transaction_id = ?", req.TransactionID).First(&ledger).Error; err == nil {
		if ledger.Status == models.TxStatusSuccess {
			return &ledger, nil
		}
	}

	var createdLedger models.LedgerRecord

	err := s.db.Transaction(func(tx *gorm.DB) error {
		var wallet models.Wallet
		// lock the wallet record with pessimistic locking
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", req.UserID).First(&wallet).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return ErrWalletNotFound
			}
			return err
		}

		// balance check (for debit operations)
		if req.Amount < 0 && wallet.Balance+req.Amount < 0 {
			return ErrInsufficientBalance
		}

		balanceBefore := wallet.Balance
		balanceAfter := wallet.Balance + req.Amount

		// directly update the balance and increment the version
		if err := tx.Model(&wallet).Updates(map[string]interface{}{
			"balance": balanceAfter,
			"version": wallet.Version + 1,
		}).Error; err != nil {
			return err
		}

		// write the ledger record snapshot
		createdLedger = models.LedgerRecord{
			TransactionID:   req.TransactionID,
			WalletID:        wallet.ID,
			UserID:          req.UserID,
			Amount:          req.Amount,
			BalanceBefore:   balanceBefore,
			BalanceAfter:    balanceAfter,
			TransactionType: req.TransactionType,
			Status:          models.TxStatusSuccess,
			ReferenceID:     req.ReferenceID,
			Remark:          req.Remark,
		}

		if err := tx.Create(&createdLedger).Error; err != nil {
			return err // a unique index conflict will be raised here if the idempotency key collides
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &createdLedger, nil
}
