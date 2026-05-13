package models

import "time"

// WalletDailySnapshot captures each wallet's balance at the start of a calendar
// day (midnight local time). It is written by a cron job at 00:00 daily and read
// by the reconciliation job at 04:00.
//
// Using snapshots for both the opening and closing balance of a day eliminates
// the approximation error that arises when the current live balance is used as a
// stand-in for a historical balance.
type WalletDailySnapshot struct {
	ID       uint      `gorm:"primaryKey;autoIncrement"                        json:"id"`
	Date     time.Time `gorm:"uniqueIndex:idx_snapshot_date_wallet;not null"   json:"date"`      // midnight of the snapshotted day
	WalletID uint      `gorm:"uniqueIndex:idx_snapshot_date_wallet;not null"   json:"wallet_id"`
	UserID   uint      `gorm:"index;not null"                                  json:"user_id"`
	Balance  int64     `gorm:"not null"                                        json:"balance"`   // balance in cents at midnight
	CreatedAt time.Time `                                                       json:"created_at"`
}
