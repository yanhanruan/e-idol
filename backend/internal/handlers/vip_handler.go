package handlers

import (
	"net/http"

	"e-idol-backend/internal/services"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type VipHandler struct {
	vipSvc *services.VipService
}

func NewVipHandler(db *gorm.DB) *VipHandler {
	return &VipHandler{vipSvc: services.NewVipService(db)}
}

type purchaseVipRequest struct {
	PlanID uint `json:"plan_id" binding:"required"`
}

// Purchase handles POST /api/vip/purchase.
// ErrInsufficientBalance is automatically mapped to HTTP 400 by FailWithError,
// satisfying the requirement that insufficient-balance errors never return 500.
func (h *VipHandler) Purchase(c *gin.Context) {
	rawID, exists := c.Get("userID")
	if !exists {
		utils.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	userID := rawID.(uint)

	var req purchaseVipRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.vipSvc.PurchaseVip(userID, req.PlanID); err != nil {
		utils.FailWithError(c, err)
		return
	}

	utils.OK(c, nil)
}
