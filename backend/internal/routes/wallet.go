package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterWalletRoutes mounts all wallet-related endpoints onto the given
// RouterGroup (expected to be the /api group).
//
// Route groups:
//   - /api/wallet/*         — protected by AuthRequired (JWT)
//   - /api/wallet/webhook/* — protected by WebhookSignatureRequired (HMAC),
//     no JWT auth (called by the payment provider, not end-users)
func RegisterWalletRoutes(r *gin.RouterGroup, h *handlers.WalletHandler) {
	wallet := r.Group("/wallet")
	wallet.Use(middleware.AuthRequired())
	{
		wallet.GET("/balance", h.Balance)
		wallet.GET("/ledger", h.ListLedger)
		wallet.POST("/recharge", h.Recharge)
	}

	webhook := r.Group("/wallet/webhook")
	webhook.Use(middleware.WebhookSignatureRequired())
	{
		webhook.POST("/recharge", h.WebhookRecharge)
	}
}
