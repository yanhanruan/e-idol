package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleHost   Role = "host"
	RoleClient Role = "client"
)

type User struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Username     string         `gorm:"unique;not null" json:"username"`
	PasswordHash string         `gorm:"not null" json:"-"` // Store hashed password, don't expose in JSON
	Role         Role           `gorm:"type:varchar(10);default:'client';not null" json:"role"`
	Avatar       string         `json:"avatar,omitempty"`
	Bio          string         `json:"bio,omitempty"`
	Price        float64        `gorm:"type:numeric(10,2)" json:"price,omitempty"` // Decimal with 10 total digits, 2 after decimal
}
