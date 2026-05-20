package handlers

import (
	"net/http"

	"e-idol-backend/internal/services"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TipHandler struct {
	tipSvc *services.TipService
}

func NewTipHandler(db *gorm.DB) *TipHandler {
	return &TipHandler{tipSvc: services.NewTipService(db)}
}

type tipRequest struct {
	IdolID int64 `json:"idol_id" binding:"required,gt=0"`
	Amount int64 `json:"amount"  binding:"required,gte=100,lte=1000000"`
}

// Tip handles POST /api/tip.
// ErrInsufficientBalance → HTTP 400 (via FailWithError central map).
// ErrIdolBanned          → HTTP 403.
// ErrIdolNotFound        → HTTP 404.
func (h *TipHandler) Tip(c *gin.Context) {
	rawID, exists := c.Get("userID")
	if !exists {
		utils.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	fromUserID := int64(rawID.(uint))

	var req tipRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	record, err := h.tipSvc.Tip(fromUserID, req.IdolID, req.Amount)
	if err != nil {
		utils.FailWithError(c, err)
		return
	}

	utils.OK(c, record)
}
