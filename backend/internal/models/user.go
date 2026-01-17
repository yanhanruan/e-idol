package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleAdmin  Role = "admin"
	RoleHost   Role = "host"
	RoleClient Role = "client"
)

type User struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Username     string         `gorm:"unique;not null" json:"username"`
	PasswordHash string         `gorm:"not null" json:"-"` 
	Role         Role           `gorm:"type:varchar(10);not null" json:"role"`
	Avatar       string         `json:"avatar,omitempty"`
	Bio          string         `json:"bio,omitempty"`
	Gender       string         `json:"gender,omitempty"`
	Language     string         `gorm:"default:'zh'" json:"language,omitempty"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	Price        float64        `gorm:"type:numeric(10,2)" json:"price,omitempty"` 
}
