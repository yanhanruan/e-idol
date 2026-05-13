package database

import (
	"e-idol-backend/internal/models"
	"log"

	"gorm.io/gorm"
)

// AutoMigrate
func AutoMigrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.User{},
		&models.Order{},
		&models.Message{},
		&models.Wallet{},
		&models.LedgerRecord{},
		&models.VipPlan{},
		&models.UserVip{},
		&models.Idol{},
		&models.TipRecord{},
		&models.PlatformCommissionConfig{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}
}
