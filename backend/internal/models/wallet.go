package models

import (
	"time"

	"gorm.io/gorm"
)

// user wallet model
type Wallet struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        uint           `gorm:"uniqueIndex;not null" json:"user_id"`
	Balance       int64          `gorm:"not null;default:0" json:"balance"`        // 余额 (分)
	FrozenBalance int64          `gorm:"not null;default:0" json:"frozen_balance"` // 冻结金额 (分)
	Currency      string         `gorm:"type:varchar(8);default:'CNY'" json:"currency"`
	Version       int64          `gorm:"not null;default:0" json:"version"` // 乐观锁版本号
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
