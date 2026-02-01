package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAdminRoutes(router *gin.Engine, db *gorm.DB) {
	admin := router.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.RequireAdmin())
	{
		admin.PATCH("/users/:id/status", handlers.UpdateUserStatus(db))
		admin.GET("/stats", handlers.GetStats(db))
	}
}
