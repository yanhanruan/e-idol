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

        var host models.User
        if err := db.First(&host, input.HostID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
            return
        }

        totalPrice := host.Price * float64(input.Duration)

        order := models.Order{
            ClientID:   clientID.(uint),
            HostID:     input.HostID,
            Status:     models.StatusPending,
            StartTime:  input.StartTime,
            Duration:   input.Duration,
            TotalPrice: totalPrice,
            Note:       input.Note,
        }

        if err := db.Create(&order).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
            return
        }

        c.JSON(http.StatusCreated, order)
    }
}
