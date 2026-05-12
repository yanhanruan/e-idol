package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"e-idol-backend/internal/models"
	"e-idol-backend/internal/services"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WalletHandler struct {
	walletSvc *services.WalletService
}

func NewWalletHandler(db *gorm.DB) *WalletHandler {
	return &WalletHandler{walletSvc: services.NewWalletService(db)}
}

type rechargeRequest struct {
	Amount  int64  `json:"amount"  binding:"required,gt=0,lte=10000000"`
	Channel string `json:"channel" binding:"required"`
}

type rechargeResponse struct {
	TransactionID string `json:"transaction_id"`
	PayURL        string `json:"pay_url"`
}

func (h *WalletHandler) Recharge(c *gin.Context) {
	var req rechargeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	rawID, exists := c.Get("userID")
	if !exists {
		utils.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	userID := rawID.(uint)

	txID := uuid.New().String()

	if _, err := h.walletSvc.CreatePendingRecharge(userID, req.Amount, txID); err != nil {
		utils.FailWithError(c, err)
		return
	}

	utils.OK(c, rechargeResponse{
		TransactionID: txID,
		PayURL:        fmt.Sprintf("https://mock-pay.local/pay?tx=%s", txID),
	})
}

type webhookRechargeRequest struct {
	TransactionID string `json:"transaction_id" binding:"required"`
	Status        string `json:"status"         binding:"required"`
	Sign          string `json:"sign"           binding:"required"`
}

// WebhookRecharge is called by the payment gateway after a recharge attempt.
// It always returns HTTP 200 + {"code":200} to the provider (retry-storm prevention);
// internal errors are only logged. The sole exception is an invalid HMAC signature,
// which returns 401 to reject potentially forged callbacks.
func (h *WalletHandler) WebhookRecharge(c *gin.Context) {
	var req webhookRechargeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[webhook] malformed request body: %v", err)
		c.JSON(http.StatusOK, gin.H{"code": 200})
		return
	}

	// Canonical payload: alphabetically sorted fields, excludes sign.
	payload := fmt.Sprintf("status=%s&transaction_id=%s", req.Status, req.TransactionID)
	secret := os.Getenv("MOCK_PAY_SECRET")
	if !utils.VerifyHMAC([]byte(payload), req.Sign, secret) {
		utils.Fail(c, http.StatusUnauthorized, "invalid signature")
		return
	}

	status := models.TransactionStatus(req.Status)
	if err := h.walletSvc.ConfirmRecharge(req.TransactionID, status); err != nil {
		log.Printf("[webhook] ConfirmRecharge failed tx=%s: %v", req.TransactionID, err)
	}

	c.JSON(http.StatusOK, gin.H{"code": 200})
}
