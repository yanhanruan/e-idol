package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Default DSN for local development
		dsn = "host=localhost user=postgres password=password dbname=eidol_db port=5432 sslmode=disable TimeZone=Asia/Tokyo"
		log.Println("DATABASE_URL environment variable not set, using default DSN.")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Cap the pool well below PostgreSQL's default max_connections (100).
	// Leaving headroom for the load test scripts and other tools.
	sqlDB, _ := DB.DB()
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	fmt.Println("Database connected successfully!")

	// Run migrations
	AutoMigrate(DB)
}
