package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterIdolRoutes mounts idol-specific endpoints under /api/idol/me.
// Both AuthRequired and RequireIdol must pass for every route in this group.
func RegisterIdolRoutes(r *gin.RouterGroup, h *handlers.IdolHandler, db *gorm.DB) {
	idol := r.Group("/idol/me")
	idol.Use(middleware.AuthRequired())
	idol.Use(middleware.RequireIdol(db))
	{
		idol.GET("/earnings", h.GetEarnings)
		idol.GET("/tip-records", h.ListTipRecords)
		idol.POST("/withdraw", h.RequestWithdraw)
	}
}
