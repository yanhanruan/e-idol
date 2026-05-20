package models

import "time"

// WithdrawStatus represents the lifecycle state of a withdrawal request.
type WithdrawStatus string

const (
	WithdrawStatusPending  WithdrawStatus = "pending"
	WithdrawStatusApproved WithdrawStatus = "approved"
	WithdrawStatusRejected WithdrawStatus = "rejected"
)

// WithdrawRequest records an idol's request to withdraw earnings.
// Funds are atomically moved from WithdrawableBalance to FrozenWithdrawable
// when the request is created; the admin review workflow releases or refunds
// the frozen amount (not part of this task).
type WithdrawRequest struct {
	ID         uint           `gorm:"primaryKey;autoIncrement"          json:"id"`
	IdolID     uint           `gorm:"index;not null"                    json:"idol_id"`
	Amount     int64          `gorm:"not null"                          json:"amount"`      // in cents
	Status     WithdrawStatus `gorm:"type:varchar(16);not null;default:'pending'" json:"status"`
	AppliedAt  time.Time      `gorm:"not null"                          json:"applied_at"`
	ReviewedAt *time.Time     `                                          json:"reviewed_at"` // nil until reviewed
	Remark     string         `gorm:"type:varchar(256)"                 json:"remark"`
	CreatedAt  time.Time      `                                          json:"created_at"`
	UpdatedAt  time.Time      `                                          json:"updated_at"`
}
