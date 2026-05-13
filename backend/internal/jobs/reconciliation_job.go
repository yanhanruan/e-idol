package jobs

import (
	"log"
	"time"

	"e-idol-backend/internal/models"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

// ── Wallet snapshot job (00:00 daily) ────────────────────────────────────────

// WalletSnapshotJob captures every wallet's balance at midnight so the
// reconciliation job has accurate opening/closing balance figures.
// Without this snapshot, the job falls back to the current live balance,
// which includes all subsequent transactions and degrades accuracy.
type WalletSnapshotJob struct {
	db *gorm.DB
}

func NewWalletSnapshotJob(db *gorm.DB) *WalletSnapshotJob {
	return &WalletSnapshotJob{db: db}
}

func (j *WalletSnapshotJob) Run() {
	now := time.Now()
	midnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	var wallets []models.Wallet
	if err := j.db.Find(&wallets).Error; err != nil {
		log.Printf("[snapshot_job] failed to fetch wallets: %v", err)
		return
	}

	succeeded := 0
	for _, w := range wallets {
		snap := models.WalletDailySnapshot{
			Date:     midnight,
			WalletID: w.ID,
			UserID:   w.UserID,
			Balance:  w.Balance,
		}
		// FirstOrCreate is idempotent: safe to re-run on the same day.
		result := j.db.Where("wallet_id = ? AND date = ?", w.ID, midnight).
			Assign(snap).
			FirstOrCreate(&snap)
		if result.Error != nil {
			log.Printf("[snapshot_job] failed to upsert snapshot for wallet %d: %v", w.ID, result.Error)
		} else {
			succeeded++
		}
	}

	log.Printf("[snapshot_job] snapshotted %d/%d wallets for %s",
		succeeded, len(wallets), midnight.Format("2006-01-02"))
}

// ── Reconciliation job (04:00 daily) ─────────────────────────────────────────

// ReconciliationJob verifies that every wallet's opening balance plus its net
// ledger change equals its closing balance for the previous calendar day.
// Any discrepancy is persisted as a ReconciliationDiff for ops review.
//
// Runs after the snapshot job (00:00) so that today's midnight snapshot,
// which represents yesterday's closing balance, is already written.
type ReconciliationJob struct {
	db *gorm.DB
}

func NewReconciliationJob(db *gorm.DB) *ReconciliationJob {
	return &ReconciliationJob{db: db}
}

// userNetChange is an internal aggregate of yesterday's ledger movements.
type userNetChange struct {
	UserID uint
	Total  int64
}

func (j *ReconciliationJob) Run() {
	now := time.Now()
	yesterday := now.AddDate(0, 0, -1)
	loc := now.Location()

	dayStart := time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 0, 0, 0, 0, loc)
	dayEnd := time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 23, 59, 59, 999999999, loc)

	// 1. Aggregate yesterday's successful ledger entries by user.
	var changes []userNetChange
	if err := j.db.Model(&models.LedgerRecord{}).
		Select("user_id, SUM(amount) as total").
		Where("status = ? AND created_at >= ? AND created_at <= ?",
			models.TxStatusSuccess, dayStart, dayEnd).
		Group("user_id").
		Scan(&changes).Error; err != nil {
		log.Printf("[reconciliation_job] failed to aggregate ledger for %s: %v",
			dayStart.Format("2006-01-02"), err)
		return
	}

	if len(changes) == 0 {
		log.Printf("[reconciliation_job] no transactions on %s — skipping", dayStart.Format("2006-01-02"))
		return
	}

	// 2–5. For each affected user, assert opening + net == closing.
	diffs := 0
	for _, c := range changes {
		opening := j.snapshotBalance(c.UserID, dayStart)           // start of yesterday
		closing := j.snapshotBalance(c.UserID, dayStart.AddDate(0, 0, 1)) // start of today = end of yesterday

		expected := opening + c.Total
		if expected == closing {
			continue
		}

		// Mismatch detected — persist if not already recorded.
		var existing models.ReconciliationDiff
		err := j.db.Where("date = ? AND user_id = ?", dayStart, c.UserID).First(&existing).Error
		if err == nil {
			continue // already recorded from a previous run
		}

		diff := models.ReconciliationDiff{
			Date:            dayStart,
			UserID:          c.UserID,
			ExpectedBalance: expected,
			ActualBalance:   closing,
			Diff:            closing - expected,
			Status:          models.DiffStatusUnresolved,
		}
		if err := j.db.Create(&diff).Error; err != nil {
			log.Printf("[reconciliation_job] failed to insert diff for user %d: %v", c.UserID, err)
		} else {
			diffs++
		}
	}

	log.Printf("[reconciliation_job] %s: checked %d users, inserted %d diff record(s)",
		dayStart.Format("2006-01-02"), len(changes), diffs)
}

// snapshotBalance returns the wallet balance at the midnight boundary of 'date'.
// It first tries the WalletDailySnapshot table (accurate).
//
// TODO Fallback — PRECISION LOSS WARNING: if no snapshot exists, the current live
// wallet balance is used as an approximation. Because the live balance reflects
// all transactions that occurred after 'date', it will differ from the true
// historical balance whenever any transaction has taken place since that
// midnight. This can produce false reconciliation mismatches and should only
// be tolerated during the period before the snapshot job has accumulated
// sufficient history. Once WalletDailySnapshot has been populated for all
// relevant dates, this fallback path should never be hit in production.
func (j *ReconciliationJob) snapshotBalance(userID uint, date time.Time) int64 {
	midnight := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())

	var snap models.WalletDailySnapshot
	if err := j.db.Where("user_id = ? AND date = ?", userID, midnight).
		First(&snap).Error; err == nil {
		return snap.Balance
	}

	log.Printf("[reconciliation_job] WARN: no snapshot for user %d on %s — falling back to live balance (precision loss)",
		userID, midnight.Format("2006-01-02"))

	var wallet models.Wallet
	if err := j.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		return 0
	}
	return wallet.Balance
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

// StartReconciliationScheduler registers the wallet snapshot (00:00) and
// reconciliation (04:00) jobs and starts the shared cron scheduler.
// The 4-hour gap between the two jobs ensures the midnight snapshot is always
// written before the reconciliation run reads it.
func StartReconciliationScheduler(db *gorm.DB) *cron.Cron {
	c := cron.New()
	c.AddFunc("0 0 * * *", NewWalletSnapshotJob(db).Run)   // snapshot at midnight
	c.AddFunc("0 4 * * *", NewReconciliationJob(db).Run)   // reconcile at 04:00
	c.Start()
	return c
}
