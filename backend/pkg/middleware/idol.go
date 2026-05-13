package middleware

import (
	"net/http"

	"e-idol-backend/internal/models"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RequireIdol verifies that the authenticated user has an active Idol record
// and injects the idol's ID into the context as "idolID".
// Must be chained after AuthRequired().
func RequireIdol(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rawID, exists := c.Get("userID")
		if !exists {
			utils.Fail(c, http.StatusUnauthorized, "unauthorized")
			c.Abort()
			return
		}
		userID := rawID.(uint)

		var idol models.Idol
		if err := db.Where("user_id = ? AND status = ?", userID, models.IdolStatusActive).
			First(&idol).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				utils.Fail(c, http.StatusForbidden, "idol identity not found or inactive")
			} else {
				utils.Fail(c, http.StatusInternalServerError, "internal error")
			}
			c.Abort()
			return
		}

		c.Set("idolID", idol.ID)
		c.Next()
	}
}
