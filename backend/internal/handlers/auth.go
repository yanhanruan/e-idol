package handlers

import (
	"net/http"

	"e-idol-backend/internal/models"
	"e-idol-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Username string      `json:"username" binding:"required"`
	Password string      `json:"password" binding:"required,min=6"`
	Role     models.Role `json:"role" binding:"required,oneof=host client"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponseData 登录成功时返回的数据载荷
type LoginResponseData struct {
	Token string        `json:"token"`
	User  LoginUserInfo `json:"user"`
}

// LoginUserInfo 登录成功时返回的用户信息（不含敏感字段）
type LoginUserInfo struct {
	ID       uint        `json:"id"`
	Username string      `json:"username"`
	Role     models.Role `json:"role"`
}

// Register 用户注册
func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, utils.NewError(400, "参数错误: "+err.Error()))
			return
		}

		// 检查用户名是否已存在
		var existing models.User
		if result := db.Where("username = ?", req.Username).First(&existing); result.Error == nil {
			c.JSON(http.StatusBadRequest, utils.NewError(400, "用户名已存在"))
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.NewError(500, "服务器内部错误"))
			return
		}

		user := models.User{
			Username:     req.Username,
			PasswordHash: string(hashedPassword),
			Role:         req.Role,
		}

		if result := db.Create(&user); result.Error != nil {
			c.JSON(http.StatusInternalServerError, utils.NewError(500, "注册失败，请稍后重试"))
			return
		}

		c.JSON(http.StatusCreated, utils.NewSuccess("注册成功", nil))
	}
}

// Login 用户登录
func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, utils.NewError(400, "参数错误: "+err.Error()))
			return
		}

		var user models.User
		if result := db.Where("username = ?", req.Username).First(&user); result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				c.JSON(http.StatusUnauthorized, utils.NewError(401, "用户名或密码错误"))
			} else {
				c.JSON(http.StatusInternalServerError, utils.NewError(500, "服务器内部错误"))
			}
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, utils.NewError(401, "用户名或密码错误"))
			return
		}

		token, err := utils.GenerateToken(user.ID, user.Username, string(user.Role))
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.NewError(500, "Token 生成失败"))
			return
		}

		data := LoginResponseData{
			Token: token,
			User: LoginUserInfo{
				ID:       user.ID,
				Username: user.Username,
				Role:     user.Role,
			},
		}

		c.JSON(http.StatusOK, utils.NewSuccess("登录成功", data))
	}
}
