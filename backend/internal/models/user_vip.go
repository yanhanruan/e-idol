package models

import "time"

// UserVip stores a user's active VIP subscription status.
// It has a one-to-one relationship with User (enforced by the unique index on UserID).
//
// Level 0 means the user is not a VIP member. Positive levels map to VipPlan.Level
// and are kept at the highest tier the user has ever purchased (renewals never
// downgrade the level).
//
// All monetary comparisons (e.g. whether a discount applies) must use
// VipPlan.DiscountRate (integer basis points) — never float64 — to avoid
// IEEE 754 precision errors in financial arithmetic.
type UserVip struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint      `gorm:"uniqueIndex;not null"     json:"user_id"`
	Level      int       `gorm:"not null;default:0"       json:"level"`        // 0 = non-member
	ExpireAt   time.Time `gorm:"index"                    json:"expire_at"`
	LastPlanID uint      `gorm:"not null;default:0"       json:"last_plan_id"` // FK → VipPlan.ID
	AutoRenew  bool      `gorm:"not null;default:false"   json:"auto_renew"`
	CreatedAt  time.Time `                                json:"created_at"`
	UpdatedAt  time.Time `                                json:"updated_at"`
}
