package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Default DSN for local development
		dsn = "host=localhost user=user password=password dbname=eidol_db port=5432 sslmode=disable TimeZone=Asia/Tokyo"
		log.Println("DATABASE_URL environment variable not set, using default DSN.")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Database connected successfully!")
}
