package models

import "time"

// DiffStatus represents the resolution state of a reconciliation discrepancy.
type DiffStatus string

const DiffStatusUnresolved DiffStatus = "unresolved"

// ReconciliationDiff records a detected discrepancy between the expected and
// actual wallet balance for a given user on a given day.
//
// Expected = opening_balance + net_ledger_change_for_the_day
// Actual   = closing_balance (from WalletDailySnapshot or wallet.Balance approximation)
// Diff     = Actual - Expected (positive: more money than expected; negative: less)
//
// Records are inserted by the nightly reconciliation job; resolution and alerting
// are handled separately by the ops team.
type ReconciliationDiff struct {
	ID              uint       `gorm:"primaryKey;autoIncrement"                       json:"id"`
	Date            time.Time  `gorm:"uniqueIndex:idx_recon_diff_date_user;not null"  json:"date"`     // midnight of the reconciled day
	UserID          uint       `gorm:"uniqueIndex:idx_recon_diff_date_user;not null"  json:"user_id"`
	ExpectedBalance int64      `gorm:"not null"                                       json:"expected_balance"`
	ActualBalance   int64      `gorm:"not null"                                       json:"actual_balance"`
	Diff            int64      `gorm:"not null"                                       json:"diff"`
	Status          DiffStatus `gorm:"type:varchar(16);not null;default:'unresolved'" json:"status"`
	CreatedAt       time.Time  `                                                      json:"created_at"`
	UpdatedAt       time.Time  `                                                      json:"updated_at"`
}
