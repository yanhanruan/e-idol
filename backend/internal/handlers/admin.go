package handlers

import (
	"net/http"

	"e-idol-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UpdateUserStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.Param("id")

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if user.Role == models.RoleAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Cannot change status of an admin"})
			return
		}

		var input struct {
			IsActive bool `json:"is_active"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		user.IsActive = input.IsActive
		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user status"})
			return
		}

		c.JSON(http.StatusOK, user)
	}
}

func GetStats(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var totalUsers int64
		db.Model(&models.User{}).Count(&totalUsers)

		var totalHosts int64
		db.Model(&models.User{}).Where("role = ?", models.RoleHost).Count(&totalHosts)

		var totalOrders int64
		db.Model(&models.Order{}).Count(&totalOrders)

		var totalRevenue float64
		db.Model(&models.Order{}).Where("status = ?", models.StatusCompleted).Select("sum(total_price)").Row().Scan(&totalRevenue)

		c.JSON(http.StatusOK, gin.H{
			"total_users":   totalUsers,
			"total_hosts":   totalHosts,
			"total_orders":  totalOrders,
			"total_revenue": totalRevenue,
		})
	}
}
