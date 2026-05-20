package handlers

import (
	"net/http"
	"strconv"

	"e-idol-backend/internal/services"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type IdolHandler struct {
	idolSvc *services.IdolService
}

func NewIdolHandler(db *gorm.DB) *IdolHandler {
	return &IdolHandler{idolSvc: services.NewIdolService(db)}
}

// GetEarnings handles GET /api/idol/me/earnings.
func (h *IdolHandler) GetEarnings(c *gin.Context) {
	idolID := c.MustGet("idolID").(uint)
	summary, err := h.idolSvc.GetEarnings(idolID)
	if err != nil {
		utils.FailWithError(c, err)
		return
	}
	utils.OK(c, summary)
}

// ListTipRecords handles GET /api/idol/me/tip-records.
func (h *IdolHandler) ListTipRecords(c *gin.Context) {
	idolID := c.MustGet("idolID").(uint)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	records, total, err := h.idolSvc.ListTipRecords(idolID, page, pageSize)
	if err != nil {
		utils.FailWithError(c, err)
		return
	}
	utils.OK(c, gin.H{
		"total":   total,
		"records": records,
	})
}

type withdrawRequest struct {
	Amount int64 `json:"amount" binding:"required,gt=0"`
}

// RequestWithdraw handles POST /api/idol/me/withdraw.
func (h *IdolHandler) RequestWithdraw(c *gin.Context) {
	idolID := c.MustGet("idolID").(uint)

	var req withdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.idolSvc.RequestWithdraw(idolID, req.Amount); err != nil {
		utils.FailWithError(c, err)
		return
	}
	utils.OK(c, gin.H{"message": "withdrawal request submitted"})
}
