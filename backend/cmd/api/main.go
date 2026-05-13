package main

import (
	"net/http"

	"e-idol-backend/internal/database"
	"e-idol-backend/internal/handlers"
	"e-idol-backend/internal/jobs"
	"e-idol-backend/internal/routes"
	"e-idol-backend/internal/websocket"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Gin engine
	router := gin.Default()

	// Configure CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins for development
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Connect to database
	database.ConnectDB()

	// Auto-migrate all models (Wallet and LedgerRecord included via database.AutoMigrate)
	database.AutoMigrate(database.DB)
	database.Seed(database.DB)

	// Serve static files from the "uploads" directory
	router.Static("/uploads", "./uploads")

	// Setup routes
	hub := websocket.NewHub()
	go hub.Run()

	routes.RegisterRoutes(router, database.DB, hub)

	// Wallet routes are registered separately so the handler can be injected
	// without coupling route wiring to the internal WalletRoutes helper.
	walletHandler := handlers.NewWalletHandler(database.DB)
	routes.RegisterWalletRoutes(router.Group("/api"), walletHandler)

	vipHandler := handlers.NewVipHandler(database.DB)
	routes.RegisterVipRoutes(router.Group("/api"), vipHandler)

	tipHandler := handlers.NewTipHandler(database.DB)
	routes.RegisterTipRoutes(router.Group("/api"), tipHandler)

	idolHandler := handlers.NewIdolHandler(database.DB)
	routes.RegisterIdolRoutes(router.Group("/api"), idolHandler, database.DB)

	// Start background jobs (each scheduler manages its own goroutine internally).
	jobs.StartVipExpireScheduler(database.DB)

	// Test route
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message":   "pong",
			"framework": "Go + Gin",
		})
	})

	// Run the server
	router.Run(":8080")
}
