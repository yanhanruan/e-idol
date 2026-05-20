package models

import (
	"time"
)

// LedgerRecord 账本记录模型，用于资金流水追踪
type LedgerRecord struct {
	ID              uint              `gorm:"primaryKey" json:"id"`
	TransactionID   string            `gorm:"type:varchar(64);uniqueIndex;not null" json:"transaction_id"` // 业务流水号，幂等键
	WalletID        uint              `gorm:"index;not null" json:"wallet_id"`
	UserID          uint              `gorm:"index;not null" json:"user_id"`
	Amount          int64             `gorm:"not null" json:"amount"`         // 变动金额 (分)，正入负出
	BalanceBefore   int64             `gorm:"not null" json:"balance_before"` // 变动前余额
	BalanceAfter    int64             `gorm:"not null" json:"balance_after"`  // 变动后余额
	TransactionType TransactionType   `gorm:"type:varchar(32)" json:"transaction_type"`
	Status          TransactionStatus `gorm:"type:varchar(16)" json:"status"`
	ReferenceID     string            `gorm:"type:varchar(64);index" json:"reference_id"` // 关联业务单号
	Remark          string            `gorm:"type:varchar(255)" json:"remark"`
	CreatedAt       time.Time         `json:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at"`
}
