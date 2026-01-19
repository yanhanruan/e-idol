package main

import (
	"net/http"

	"e-idol-backend/internal/database"
	"e-idol-backend/internal/models"
	"e-idol-backend/internal/routes"

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

	// Auto-migrate models
	err := database.DB.AutoMigrate(&models.User{})
	if err != nil {
		panic("Failed to auto-migrate database models")
	}

	// Serve static files from the "uploads" directory
	router.Static("/uploads", "./uploads")

	// Setup routes
	api := router.Group("/api")
	routes.AuthRoutes(api, database.DB)
	routes.UserRoutes(api, database.DB)

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
