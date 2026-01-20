package routes

import (
	"e-idol-backend/internal/handlers"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRoutes(router *gin.RouterGroup, db *gorm.DB) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", handlers.Register(db))
		auth.POST("/login", handlers.Login(db))
	}
}

func UserRoutes(router *gin.RouterGroup, db *gorm.DB) {
	user := router.Group("/user")
	user.Use(middleware.AuthMiddleware())
	{
		user.GET("/profile", handlers.GetProfile(db))
		user.PUT("/profile", handlers.UpdateProfile(db))
	}

	router.GET("/hosts", handlers.GetHostList(db))
}

func OrderRoutes(router *gin.RouterGroup, db *gorm.DB) {
	orders := router.Group("/orders")
	orders.Use(middleware.AuthMiddleware())
	{
		orders.POST("/", handlers.CreateOrder(db))
		orders.GET("/my-orders", handlers.GetMyOrders(db))
		orders.PATCH("/:id/status", handlers.UpdateOrderStatus(db))
	}
}
