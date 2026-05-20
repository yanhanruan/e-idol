package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterTipRoutes mounts the tipping endpoint onto the given RouterGroup
// (expected to be the /api group). Requires a valid JWT (consumer identity).
func RegisterTipRoutes(r *gin.RouterGroup, h *handlers.TipHandler) {
	tip := r.Group("/tip")
	tip.Use(middleware.AuthRequired())
	{
		tip.POST("", h.Tip)
	}
}
