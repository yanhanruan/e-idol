package models

import "time"

// IdolStatus represents the operational status of an idol account.
type IdolStatus string

const (
	IdolStatusActive IdolStatus = "active"
	IdolStatusBanned IdolStatus = "banned"
)

// Idol stores the platform identity and earnings state for a content creator.
//
// WithdrawableBalance is intentionally kept separate from the consumer Wallet:
// idol income (from tips) and user spending (wallet recharges/consumption) have
// different compliance, tax, and settlement workflows and must never be mixed
// in the same ledger.
//
// TotalEarnings is the cumulative gross income before platform commission
// deduction — it is append-only and never decremented, preserving an auditable
// lifetime earnings figure even if withdrawals reduce WithdrawableBalance.
type Idol struct {
	ID                  uint       `gorm:"primaryKey;autoIncrement"          json:"id"`
	UserID              uint       `gorm:"uniqueIndex;not null"              json:"user_id"`
	StageName           string     `gorm:"type:varchar(64);not null"         json:"stage_name"`
	Status              IdolStatus `gorm:"type:varchar(16);not null;default:'active'" json:"status"`
	TotalEarnings        int64      `gorm:"not null;default:0"                json:"total_earnings"`         // cumulative gross income, in cents
	WithdrawableBalance  int64      `gorm:"not null;default:0"                json:"withdrawable_balance"`   // available for withdrawal, in cents
	FrozenWithdrawable   int64      `gorm:"not null;default:0"                json:"frozen_withdrawable"`    // locked pending withdrawal approval
	CreatedAt           time.Time  `                                         json:"created_at"`
	UpdatedAt           time.Time  `                                         json:"updated_at"`
}
