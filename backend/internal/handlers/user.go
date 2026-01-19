package handlers

import (
	"e-idol-backend/internal/models"
	"e-idol-backend/pkg/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, user)
	}
}

func UpdateProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Bind text fields
		user.Bio = c.PostForm("bio")
		user.Gender = c.PostForm("gender")
		if priceStr := c.PostForm("price"); priceStr != "" {
			price, err := strconv.ParseFloat(priceStr, 64)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
				return
			}
			user.Price = price
		}

		// Handle file upload
		file, err := c.FormFile("avatar")
		if err == nil {
			avatarURL, err := utils.SaveUploadedFile(c, file)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save avatar"})
				return
			}
			user.Avatar = avatarURL
		} else if err != http.ErrMissingFile {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
			return
		}

		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
