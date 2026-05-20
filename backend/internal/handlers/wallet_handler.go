package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

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

// ── Balance ──────────────────────────────────────────────────────────────────

type balanceResponse struct {
	Balance       int64  `json:"balance"`
	FrozenBalance int64  `json:"frozen_balance"`
	Currency      string `json:"currency"`
}

func (h *WalletHandler) Balance(c *gin.Context) {
	rawID, exists := c.Get("userID")
	if !exists {
		utils.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	wallet, err := h.walletSvc.GetBalance(rawID.(uint))
	if err != nil {
		utils.FailWithError(c, err)
		return
	}

	utils.OK(c, balanceResponse{
		Balance:       wallet.Balance,
		FrozenBalance: wallet.FrozenBalance,
		Currency:      wallet.Currency,
	})
}

// ── Ledger list ───────────────────────────────────────────────────────────────

type ledgerQueryParams struct {
	Page     int    `form:"page"`
	PageSize int    `form:"page_size"`
	Type     string `form:"type"`
	StartAt  string `form:"start_at"`
	EndAt    string `form:"end_at"`
}

type paginationMeta struct {
	Page     int   `json:"page"`
	PageSize int   `json:"page_size"`
	Total    int64 `json:"total"`
}

type ledgerListResponse struct {
	List       []models.LedgerRecord `json:"list"`
	Pagination paginationMeta        `json:"pagination"`
}

func (h *WalletHandler) ListLedger(c *gin.Context) {
	rawID, exists := c.Get("userID")
	if !exists {
		utils.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	userID := rawID.(uint)

	var q ledgerQueryParams
	if err := c.ShouldBindQuery(&q); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	if q.Page == 0 {
		q.Page = 1
	}
	if q.PageSize == 0 {
		q.PageSize = 20
	}
	if q.Page < 1 {
		utils.Fail(c, http.StatusBadRequest, "page must be >= 1")
		return
	}
	if q.PageSize < 1 || q.PageSize > 100 {
		utils.Fail(c, http.StatusBadRequest, "page_size must be between 1 and 100")
		return
	}

	filter := services.LedgerFilter{Type: q.Type}

	if q.StartAt != "" {
		t, err := time.Parse("2006-01-02", q.StartAt)
		if err != nil {
			utils.Fail(c, http.StatusBadRequest, "invalid start_at, expected YYYY-MM-DD")
			return
		}
		filter.StartAt = &t
	}
	if q.EndAt != "" {
		t, err := time.Parse("2006-01-02", q.EndAt)
		if err != nil {
			utils.Fail(c, http.StatusBadRequest, "invalid end_at, expected YYYY-MM-DD")
			return
		}
		// Add one day so end_at is inclusive of the full calendar day.
		t = t.AddDate(0, 0, 1)
		filter.EndAt = &t
	}

	records, total, err := h.walletSvc.ListLedger(userID, filter, services.Pagination{
		Page:     q.Page,
		PageSize: q.PageSize,
	})
	if err != nil {
		utils.FailWithError(c, err)
		return
	}

	utils.OK(c, ledgerListResponse{
		List: records,
		Pagination: paginationMeta{
			Page:     q.Page,
			PageSize: q.PageSize,
			Total:    total,
		},
	})
}

// ── Webhook ───────────────────────────────────────────────────────────────────

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
