package middleware

import "github.com/gin-gonic/gin"

// WebhookSignatureRequired is the middleware entry-point for payment-provider
// callback authentication.
//
// TODO: Migrate the HMAC-SHA256 signature verification that currently lives in
// handlers.WalletHandler.WebhookRecharge into this middleware once the payment
// gateway integration is stabilised. The middleware should:
//   1. Read the raw request body and stash it in the context so downstream
//      handlers can still parse it.
//   2. Reconstruct the canonical payload (status + transaction_id).
//   3. Call utils.VerifyHMAC with the MOCK_PAY_SECRET env var.
//   4. Abort with 401 on failure; call c.Next() on success.
func WebhookSignatureRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Placeholder: signature verification is handled inside the handler for now.
		c.Next()
	}
}
