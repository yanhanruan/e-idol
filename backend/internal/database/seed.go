package database

import (
	"log"
	"time"

	"e-idol-backend/internal/models"

	"gorm.io/gorm"
)

// Seed inserts required baseline records that the application depends on at
// runtime. It is idempotent: each seeder checks for the existence of its
// target record before inserting, so it is safe to call on every startup.
func Seed(db *gorm.DB) {
	seedCommissionConfig(db)
}

// seedCommissionConfig inserts the initial platform commission rate (30%) if
// no configuration records exist yet.
func seedCommissionConfig(db *gorm.DB) {
	var count int64
	db.Model(&models.PlatformCommissionConfig{}).Count(&count)
	if count > 0 {
		return
	}

	initial := models.PlatformCommissionConfig{
		// Backdated so that it is immediately effective for all historical orders.
		EffectiveAt:    time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		CommissionRate: 3000, // 30%
		Remark:         "initial default platform commission rate: 30%",
	}

	if err := db.Create(&initial).Error; err != nil {
		log.Printf("[seed] failed to insert initial commission config: %v", err)
		return
	}

	log.Println("[seed] inserted initial platform commission config (30%)")
}
