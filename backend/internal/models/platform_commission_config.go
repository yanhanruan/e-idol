package models

import "time"

// PlatformCommissionConfig stores the platform's commission rate schedule.
//
// The active rate is determined by selecting the latest record where
// EffectiveAt <= now(). This time-based lookup (rather than a simple IsActive
// flag) means that past orders always resolve to the rate that was in effect
// when they were created, even if the rate has since changed — preserving a
// fully auditable commission history without touching historical records.
//
// CommissionRate is stored as integer basis points (0–10000) to avoid
// IEEE 754 floating-point precision errors in financial calculations.
// Example: 3000 = 30% platform commission.
type PlatformCommissionConfig struct {
	ID             uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	EffectiveAt    time.Time `gorm:"index;not null"           json:"effective_at"`    // config is active when EffectiveAt <= now
	CommissionRate int       `gorm:"not null"                 json:"commission_rate"` // basis points; e.g. 3000 = 30%
	Remark         string    `gorm:"type:varchar(255)"        json:"remark"`
	CreatedAt      time.Time `                                json:"created_at"`
	UpdatedAt      time.Time `                                json:"updated_at"`
}
