package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterVipRoutes mounts all VIP-related endpoints onto the given RouterGroup
// (expected to be the /api group). All routes require a valid JWT.
func RegisterVipRoutes(r *gin.RouterGroup, h *handlers.VipHandler) {
	vip := r.Group("/vip")
	vip.Use(middleware.AuthRequired())
	{
		vip.POST("/purchase", h.Purchase)
	}
}
