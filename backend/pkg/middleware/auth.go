package middleware

import (
	"net/http"

	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

// AuthRequired is the canonical middleware name used by wallet and future routes.
// AuthMiddleware remains available as an alias for backward compatibility.
func AuthRequired() gin.HandlerFunc {
	return AuthMiddleware()
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := authHeader[len("Bearer "):]

		claims, err := utils.ValidateToken(tokenString)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.ID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)

		c.Next()
	}
}
