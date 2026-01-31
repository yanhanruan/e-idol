package handlers

import (
	"net/http"
	"strconv"

	"e-idol-backend/internal/models"
	internalWebsocket "e-idol-backend/internal/websocket"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ServeWs(hub *internalWebsocket.Hub, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not provided"})
			return
		}

		claims, err := utils.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade connection"})
			return
		}

		client := &internalWebsocket.Client{
			Hub:    hub,
			Conn:   conn,
			Send:   make(chan []byte, 256),
			UserID: claims.ID,
			DB:     db,
		}
		client.Hub.Register <- client

		go client.WritePump()
		go client.ReadPump()
	}
}

func GetMessageHistory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		peerIDStr := c.Query("peer_id")
		peerID, err := strconv.ParseUint(peerIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid peer_id"})
			return
		}

		var messages []models.Message
		db.Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", userID, peerID, peerID, userID).
			Order("created_at desc").
			Find(&messages)

		c.JSON(http.StatusOK, messages)
	}
}
