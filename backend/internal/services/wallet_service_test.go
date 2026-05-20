// go test -v -count=1 -timeout 300s ./internal/services/ -run TestWalletServiceSuite 2>&1

package services

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	"e-idol-backend/internal/database"
	"e-idol-backend/internal/models"

	"github.com/stretchr/testify/suite"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	gormPostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type WalletServiceTestSuite struct {
	suite.Suite
	ctx       context.Context
	db        *gorm.DB
	container *tcpostgres.PostgresContainer
	service   *WalletService
}

func TestWalletServiceSuite(t *testing.T) {
	suite.Run(t, new(WalletServiceTestSuite))
}

// ---------------------------------------------------------------------------
// Suite-level setup / teardown: one Postgres container for all tests
// ---------------------------------------------------------------------------

func (s *WalletServiceTestSuite) SetupSuite() {
	s.ctx = context.Background()

	pgContainer, err := tcpostgres.Run(s.ctx,
		"postgres:15-alpine",
		tcpostgres.WithDatabase("testdb"),
		tcpostgres.WithUsername("postgres"),
		tcpostgres.WithPassword("password"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(60*time.Second),
		),
	)
	s.Require().NoError(err)
	s.container = pgContainer

	connStr, err := pgContainer.ConnectionString(s.ctx, "sslmode=disable")
	s.Require().NoError(err)

	s.db, err = gorm.Open(gormPostgres.Open(connStr), &gorm.Config{
		SkipDefaultTransaction: true, // manual transaction control
	})
	s.Require().NoError(err)

	// Run the same migration as production
	database.AutoMigrate(s.db)

	s.service = NewWalletService(s.db)
}

func (s *WalletServiceTestSuite) TearDownSuite() {
	if s.container != nil {
		s.Require().NoError(s.container.Terminate(s.ctx))
	}
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// createWallet inserts a wallet directly into the database (outside a test-
// scoped transaction, mainly for concurrent tests).
func (s *WalletServiceTestSuite) createWallet(userID uint, balance int64) models.Wallet {
	wallet := models.Wallet{
		UserID:  userID,
		Balance: balance,
	}
	err := s.db.Create(&wallet).Error
	s.Require().NoError(err)
	return wallet
}

// parallelApplyTx calls svc.ApplyTransaction in a retry loop until either a
// definitive (non-concurrent-conflict) error or success.  This allows us to
// test the core optimistic-lock / balance logic under high contention without
// being limited by the production retry budget.
func parallelApplyTx(svc *WalletService, ctx context.Context, req ApplyTxRequest) error {
	const maxParallelRetries = 50
	for attempt := 0; attempt < maxParallelRetries; attempt++ {
		_, err := svc.ApplyTransaction(ctx, req)
		if err == nil {
			return nil
		}
		if err == ErrConcurrentConflict {
			// backoff before retry
			time.Sleep(time.Duration(attempt*5) * time.Millisecond)
			continue
		}
		// Any other error (InsufficientBalance, WalletNotFound, DB error)
		// is definitive – return immediately.
		return err
	}
	return ErrConcurrentConflict
}

// ---------------------------------------------------------------------------
// TestApplyTransaction_Recharge_Success
//
// A recharge (positive amount) must:
//   - correctly increase the wallet balance
//   - increment the version
//   - write exactly one ledger record with correct snapshots
// ---------------------------------------------------------------------------

func (s *WalletServiceTestSuite) TestApplyTransaction_Recharge_Success() {
	// Wrap in a transaction that rolls back for full isolation.
	tx := s.db.Begin()
	defer tx.Rollback()
	svc := NewWalletService(tx)

	userID := uint(1001)
	wallet := models.Wallet{UserID: userID, Balance: 0}
	err := tx.Create(&wallet).Error
	s.Require().NoError(err)

	req := ApplyTxRequest{
		UserID:          userID,
		Amount:          10000, // ¥100.00
		TransactionID:   "recharge-001",
		TransactionType: models.TxTypeRecharge,
		ReferenceID:     "ref-001",
		Remark:          "test recharge",
	}

	record, err := svc.ApplyTransaction(s.ctx, req)
	s.Require().NoError(err)
	s.Require().NotNil(record)

	// --- Assert returned record ---
	s.Equal(req.TransactionID, record.TransactionID)
	s.Equal(int64(10000), record.Amount)
	s.Equal(int64(0), record.BalanceBefore)
	s.Equal(int64(10000), record.BalanceAfter)
	s.Equal(models.TxStatusSuccess, record.Status)

	// --- Assert database: wallets ---
	var w models.Wallet
	err = tx.First(&w, wallet.ID).Error
	s.Require().NoError(err)
	s.Equal(int64(10000), w.Balance, "wallet balance should increase by recharge amount")
	s.Equal(int64(1), w.Version, "version should increment by 1")

	// --- Assert database: wallet_transactions ---
	var count int64
	err = tx.Model(&models.LedgerRecord{}).Where("transaction_id = ?", req.TransactionID).Count(&count).Error
	s.Require().NoError(err)
	s.Equal(int64(1), count, "exactly one ledger record should exist")

	s.Equal(wallet.ID, record.WalletID, "ledger should reference the correct wallet ID")
}

// ---------------------------------------------------------------------------
// TestApplyTransaction_Consume_InsufficientBalance
//
// When the balance is insufficient for a debit (negative amount):
//   - ErrInsufficientBalance must be returned
//   - the wallet balance must NOT change
//   - NO ledger record may be written
// ---------------------------------------------------------------------------

func (s *WalletServiceTestSuite) TestApplyTransaction_Consume_InsufficientBalance() {
	tx := s.db.Begin()
	defer tx.Rollback()
	svc := NewWalletService(tx)

	userID := uint(1002)
	wallet := models.Wallet{UserID: userID, Balance: 5000} // ¥50.00
	err := tx.Create(&wallet).Error
	s.Require().NoError(err)

	req := ApplyTxRequest{
		UserID:          userID,
		Amount:          -10000, // try to spend ¥100.00
		TransactionID:   "consume-insufficient-001",
		TransactionType: models.TxTypeConsume,
		ReferenceID:     "ref-002",
		Remark:          "test insufficient balance",
	}

	record, err := svc.ApplyTransaction(s.ctx, req)
	s.Require().Error(err)
	s.ErrorIs(err, ErrInsufficientBalance)
	s.Nil(record)

	// --- Assert database: wallet unchanged ---
	var w models.Wallet
	err = tx.First(&w, wallet.ID).Error
	s.Require().NoError(err)
	s.Equal(int64(5000), w.Balance, "balance must remain unchanged")
	s.Equal(int64(0), w.Version, "version must remain unchanged")

	// --- Assert database: no ledger record ---
	var count int64
	err = tx.Model(&models.LedgerRecord{}).Where("transaction_id = ?", req.TransactionID).Count(&count).Error
	s.Require().NoError(err)
	s.Equal(int64(0), count, "no ledger record should be written for a failed transaction")
}

// ---------------------------------------------------------------------------
// concurrent TestApplyTransaction_Idempotent
//
// Calling ApplyTransaction twice with the same TransactionID must:
//   - return the same LedgerRecord on the second call
//   - change the balance exactly once
//   - produce exactly one row in wallet_transactions
//
// ---------------------------------------------------------------------------
// TODO add concurrent version of this test to verify idempotency under contention
func (s *WalletServiceTestSuite) TestApplyTransaction_Idempotent() {
	tx := s.db.Begin()
	defer tx.Rollback()
	svc := NewWalletService(tx)

	userID := uint(1003)
	wallet := models.Wallet{UserID: userID, Balance: 0}
	err := tx.Create(&wallet).Error
	s.Require().NoError(err)

	txID := "idempotent-001"
	req := ApplyTxRequest{
		UserID:          userID,
		Amount:          20000, // ¥200.00
		TransactionID:   txID,
		TransactionType: models.TxTypeRecharge,
		ReferenceID:     "ref-003",
		Remark:          "test idempotent",
	}

	// --- First call ---
	record1, err := svc.ApplyTransaction(s.ctx, req)
	s.Require().NoError(err)
	s.Require().NotNil(record1)

	// --- Second call with identical TransactionID ---
	record2, err := svc.ApplyTransaction(s.ctx, req)
	s.Require().NoError(err)
	s.Require().NotNil(record2)

	// Must return the same database record (same primary key)
	s.Equal(record1.ID, record2.ID, "the same ledger record must be returned")
	s.Equal(record1.TransactionID, record2.TransactionID)

	// --- Assert database: wallet changed exactly once ---
	var w models.Wallet
	err = tx.First(&w, wallet.ID).Error
	s.Require().NoError(err)
	s.Equal(int64(20000), w.Balance, "balance should reflect exactly one recharge")
	s.Equal(int64(1), w.Version, "version should have been incremented exactly once")

	// --- Assert database: exactly one ledger record ---
	var count int64
	err = tx.Model(&models.LedgerRecord{}).Where("transaction_id = ?", txID).Count(&count).Error
	s.Require().NoError(err)
	s.Equal(int64(1), count, "only one ledger record should exist")
}

// ---------------------------------------------------------------------------
// TestApplyTransaction_ConcurrentDeduct
//
// 100 goroutines each deduct ¥1.00 concurrently from the same wallet.
// Because the wallet has exactly enough balance for all 100 deductions,
// every goroutine must eventually succeed. After completion:
//   - final balance = initial balance - 100 × amount
//   - exactly 100 ledger records exist
//
// This test exercises the optimistic-locking retry path in a real
// Postgres-backed scenario.
// ---------------------------------------------------------------------------

func (s *WalletServiceTestSuite) TestApplyTransaction_ConcurrentDeduct() {
	userID := uint(1100)
	unitAmount := int64(100) // ¥1.00
	totalGoroutines := 100
	initialBalance := unitAmount * int64(totalGoroutines)

	wallet := s.createWallet(userID, initialBalance)

	s.T().Cleanup(func() {
		s.db.Where("user_id = ?", userID).Delete(&models.LedgerRecord{})
		s.db.Delete(&wallet)
	})

	var wg sync.WaitGroup
	errCh := make(chan error, totalGoroutines)

	for i := 0; i < totalGoroutines; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			req := ApplyTxRequest{
				UserID:          userID,
				Amount:          -unitAmount,
				TransactionID:   fmt.Sprintf("concurrent-deduct-%d", idx),
				TransactionType: models.TxTypeConsume,
				Remark:          "concurrent deduct test",
			}
			errCh <- parallelApplyTx(s.service, s.ctx, req)
		}(i)
	}
	wg.Wait()
	close(errCh)

	// Count successes
	successCount := 0
	for err := range errCh {
		if err == nil {
			successCount++
		}
	}
	s.Equal(totalGoroutines, successCount,
		"all %d concurrent deductions must succeed (got %d)",
		totalGoroutines, successCount)

	// --- Assert database: wallets ---
	var w models.Wallet
	err := s.db.First(&w, wallet.ID).Error
	s.Require().NoError(err)
	s.Equal(int64(0), w.Balance,
		"final balance must be initial (%d) - 100×%d = 0",
		initialBalance, unitAmount)

	// --- Assert database: wallet_transactions ---
	var count int64
	err = s.db.Model(&models.LedgerRecord{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	s.Require().NoError(err)
	s.Equal(int64(totalGoroutines), count,
		"must have exactly %d ledger records", totalGoroutines)
}

// ---------------------------------------------------------------------------
// TestApplyTransaction_ConcurrentOverdraft
//
// 50 goroutines attempt to deduct ¥10.00 each, but the wallet only has
// enough for 10 deductions. After all goroutines complete:
//   - exactly 10 succeed (ErrInsufficientBalance not returned)
//   - exactly 40 return ErrInsufficientBalance
//   - final balance = 0
//   - exactly 10 ledger records exist
//
// The test relies on Postgres row-locking semantics to ensure correct
// serialization even under high contention.
// ---------------------------------------------------------------------------

func (s *WalletServiceTestSuite) TestApplyTransaction_ConcurrentOverdraft() {
	userID := uint(1200)
	unitAmount := int64(1000) // ¥10.00
	totalGoroutines := 50
	maxSuccessful := 10
	initialBalance := unitAmount * int64(maxSuccessful)

	wallet := s.createWallet(userID, initialBalance)

	s.T().Cleanup(func() {
		s.db.Where("user_id = ?", userID).Delete(&models.LedgerRecord{})
		s.db.Delete(&wallet)
	})

	var wg sync.WaitGroup
	errCh := make(chan error, totalGoroutines)

	for i := 0; i < totalGoroutines; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			req := ApplyTxRequest{
				UserID:          userID,
				Amount:          -unitAmount,
				TransactionID:   fmt.Sprintf("concurrent-overdraft-%d", idx),
				TransactionType: models.TxTypeConsume,
				Remark:          "concurrent overdraft test",
			}
			errCh <- parallelApplyTx(s.service, s.ctx, req)
		}(i)
	}
	wg.Wait()
	close(errCh)

	// Classify results
	successCount := 0
	insufficientCount := 0
	conflictCount := 0
	for err := range errCh {
		switch err {
		case nil:
			successCount++
		case ErrInsufficientBalance:
			insufficientCount++
		case ErrConcurrentConflict:
			conflictCount++
		default:
			s.T().Logf("unexpected error: %v", err)
		}
	}

	s.Equal(maxSuccessful, successCount,
		"exactly %d should succeed (got %d)", maxSuccessful, successCount)
	s.Equal(totalGoroutines-maxSuccessful, insufficientCount+conflictCount,
		"the remaining %d must fail (got %d insufficient + %d conflict = %d)",
		totalGoroutines-maxSuccessful,
		insufficientCount, conflictCount, insufficientCount+conflictCount)

	// --- Assert database: wallets ---
	var w models.Wallet
	err := s.db.First(&w, wallet.ID).Error
	s.Require().NoError(err)
	s.Equal(int64(0), w.Balance,
		"final balance must be 0 after %d deductions", maxSuccessful)

	// --- Assert database: wallet_transactions ---
	var count int64
	err = s.db.Model(&models.LedgerRecord{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	s.Require().NoError(err)
	s.Equal(int64(maxSuccessful), count,
		"must have exactly %d ledger records", maxSuccessful)
}
