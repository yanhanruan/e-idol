package models

import (
	"time"

	"gorm.io/gorm"
)

// VipPlan defines a purchasable VIP subscription package.
//
// DiscountRate is stored as integer basis points (0–10000) rather than a
// float64 for correctness in financial calculations. IEEE 754 floating-point
// arithmetic cannot represent many decimal fractions exactly, which can cause
// rounding errors that accumulate across transactions. Storing basis points as
// integers (e.g. 9000 = 90% of the original price = 10% off) keeps all price
// arithmetic in the integer domain and eliminates this class of bug entirely.
type VipPlan struct {
	ID           uint           `gorm:"primaryKey;autoIncrement"       json:"id"`
	Name         string         `gorm:"type:varchar(64);not null"       json:"name"`          // e.g. "Monthly Pass" / "Yearly Pass"
	Level        int            `gorm:"not null"                        json:"level"`         // 1 = Regular VIP, 2 = Super VIP
	DurationDays int            `gorm:"not null"                        json:"duration_days"` // subscription length in days
	Price        int64          `gorm:"not null"                        json:"price"`         // original price in cents
	DiscountRate int            `gorm:"not null;default:10000"          json:"discount_rate"` // basis points: 10000 = full price, 9000 = 10% off
	IsActive     bool           `gorm:"not null;default:true"           json:"is_active"`
	CreatedAt    time.Time      `                                       json:"created_at"`
	UpdatedAt    time.Time      `                                       json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index"                           json:"-"`
}
