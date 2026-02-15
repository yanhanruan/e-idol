package handlers

import (
	"e-idol-backend/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateOrderInput struct {
	HostID    uint      `json:"host_id" binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"`
	Duration  int       `json:"duration" binding:"required"`
	Note      string    `json:"note"`
}

func CreateOrder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input CreateOrderInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		clientID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		if clientID.(uint) == input.HostID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot create an order for yourself"})
			return
		}

		// Basic input validation
		if input.Duration <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Duration must be a positive number"})
			return
		}
		if input.StartTime.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Order start time must be in the future"})
			return
		}

		orderEndTime := input.StartTime.Add(time.Duration(input.Duration) * time.Hour)
		var order models.Order

		err := db.Transaction(func(tx *gorm.DB) error {
			// Lock the host row for the transaction to prevent race conditions.
			var host models.User
			if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&host, input.HostID).Error; err != nil {
				return err
			}

			// Check for overlapping orders for the same host.
			var count int64
			query := tx.Model(&models.Order{}).
				Where("host_id = ? AND status IN ?", input.HostID, []models.OrderStatus{models.StatusConfirmed, models.StatusPending})

			if tx.Dialector.Name() == "sqlite" {
				query = query.Where("start_time < ? AND datetime(start_time, '+' || duration || ' hours') > ?", orderEndTime, input.StartTime)
			} else {
				query = query.Where("start_time < ? AND start_time + (duration * interval '1 hour') > ?", orderEndTime, input.StartTime)
			}

			if err := query.Count(&count).Error; err != nil {
				return err
			}

			if count > 0 {
				return models.ErrOrderConflict
			}

			totalPrice := host.Price * float64(input.Duration)

			order = models.Order{
				ClientID:   clientID.(uint),
				HostID:     input.HostID,
				Status:     models.StatusPending,
				StartTime:  input.StartTime,
				Duration:   input.Duration,
				TotalPrice: totalPrice,
				Note:       input.Note,
			}

			if err := tx.Create(&order).Error; err != nil {
				return err
			}

			return nil
		})

		if err != nil {
			if err == models.ErrOrderConflict {
				c.JSON(http.StatusConflict, gin.H{"error": "The selected time slot is already booked"})
			} else if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order", "details": err.Error()})
			}
			return
		}

		c.JSON(http.StatusCreated, order)
	}
}

// TODO security check
func GetMyOrders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userID")
		userRole, _ := c.Get("role")

		var orders []models.Order
		query := db.Model(&models.Order{})

		if userRole == string(models.RoleClient) {
			query = query.Where("client_id = ?", userID).Preload("Host", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, username, avatar")
			})
		} else if userRole == string(models.RoleHost) {
			query = query.Where("host_id = ?", userID).Preload("Client", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, username, avatar")
			})
		}

		if err := query.Find(&orders).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		c.JSON(http.StatusOK, orders)
	}
}

type UpdateOrderStatusInput struct {
	Status models.OrderStatus `json:"status" binding:"required"`
}

func UpdateOrderStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderID := c.Param("id")
		var input UpdateOrderStatusInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var order models.Order
		if err := db.First(&order, orderID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}

		userID, _ := c.Get("userID")
		userRole, _ := c.Get("role")

		if order.ClientID != userID.(uint) && order.HostID != userID.(uint) {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this order"})
			return
		}

		currentStatus := order.Status
		newStatus := input.Status

		if userRole == string(models.RoleHost) {
			if currentStatus == models.StatusPending && (newStatus == models.StatusConfirmed || newStatus == models.StatusRejected) {
				order.Status = newStatus
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status transition"})
				return
			}
		} else if userRole == string(models.RoleClient) {
			if currentStatus == models.StatusPending && newStatus == models.StatusCancelled {
				order.Status = newStatus
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status transition"})
				return
			}
		}

		if err := db.Save(&order).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
			return
		}

		c.JSON(http.StatusOK, order)
	}
}
