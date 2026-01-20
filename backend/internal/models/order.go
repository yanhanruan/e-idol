package models

import (
    "time"
    "gorm.io/gorm"
)

type OrderStatus string

const (
    StatusPending   OrderStatus = "pending"
    StatusConfirmed OrderStatus = "confirmed"
    StatusCompleted OrderStatus = "completed"
    StatusCancelled OrderStatus = "cancelled"
)

type Order struct {
    ID         uint      `gorm:"primarykey" json:"id"`
    ClientID   uint      `json:"client_id"`
    Client     User      `gorm:"foreignKey:ClientID" json:"client"`
    HostID     uint      `json:"host_id"`
    Host       User      `gorm:"foreignKey:HostID" json:"host"`
    Status     OrderStatus `gorm:"type:varchar(20);not null" json:"status"`
    StartTime  time.Time `json:"start_time"`
    Duration   int       `json:"duration"`
    TotalPrice float64   `gorm:"type:numeric(10,2)" json:"total_price"`
    Note       string    `json:"note"`
    CreatedAt  time.Time `json:"created_at"`
    UpdatedAt  time.Time `json:"updated_at"`
    DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
