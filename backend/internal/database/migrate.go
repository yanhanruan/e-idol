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
		&models.WithdrawRequest{},
		&models.WalletDailySnapshot{},
		&models.ReconciliationDiff{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	migrateTipRecordsAmountFields(db)
}

// migrateTipRecordsAmountFields handles the one-time schema transition from the
// legacy single 'amount' column to the four-field model (original/paid/discount/settlement).
// Existing rows are treated as non-discounted: all three amount fields are set to
// the old 'amount' value and discount_amount is set to 0.
// The stale 'vip_discount_rate' column from an intermediate implementation is also dropped.
func migrateTipRecordsAmountFields(db *gorm.DB) {
	// Backfill new columns from the legacy 'amount' column, then drop it.
	if err := db.Exec(`
		DO $$
		BEGIN
			IF EXISTS (
				SELECT 1 FROM information_schema.columns
				WHERE table_name = 'tip_records' AND column_name = 'amount'
			) THEN
				UPDATE tip_records
				SET original_amount   = amount,
				    paid_amount       = amount,
				    settlement_amount = amount,
				    discount_amount   = 0
				WHERE original_amount = 0 AND amount > 0;
				ALTER TABLE tip_records DROP COLUMN amount;
			END IF;
		END $$;
	`).Error; err != nil {
		log.Printf("tip_records amount migration warning: %v", err)
	}

	// Drop stale intermediate column if present.
	if err := db.Exec(`
		ALTER TABLE tip_records DROP COLUMN IF EXISTS vip_discount_rate;
	`).Error; err != nil {
		log.Printf("tip_records vip_discount_rate drop warning: %v", err)
	}

	// Enforce amount-field invariants as DB CHECK constraints.
	// GORM's AutoMigrate creates these on fresh tables via struct tags, but does
	// not add them to existing tables — the raw SQL below fills that gap.
	// Each ALTER is guarded by a pg_constraint existence check so re-runs are safe.
	if err := db.Exec(`
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_tip_original_pos') THEN
				ALTER TABLE tip_records ADD CONSTRAINT chk_tip_original_pos CHECK (original_amount > 0);
			END IF;
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_tip_paid_range') THEN
				ALTER TABLE tip_records ADD CONSTRAINT chk_tip_paid_range CHECK (paid_amount > 0 AND paid_amount <= original_amount);
			END IF;
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_tip_discount_nonneg') THEN
				ALTER TABLE tip_records ADD CONSTRAINT chk_tip_discount_nonneg CHECK (discount_amount >= 0);
			END IF;
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_tip_settlement_pos') THEN
				ALTER TABLE tip_records ADD CONSTRAINT chk_tip_settlement_pos CHECK (settlement_amount > 0);
			END IF;
		END $$;
	`).Error; err != nil {
		log.Printf("tip_records check constraints warning: %v", err)
	}
}
