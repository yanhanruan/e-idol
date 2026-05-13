package utils

import (
	"net/http"

	"e-idol-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type errorDetail struct {
	HTTPStatus int
	BizCode    int
	Message    string
}

var errorCodeMap = map[error]errorDetail{
	services.ErrInsufficientBalance: {http.StatusBadRequest, 4001, "insufficient balance"},
	services.ErrWalletNotFound:      {http.StatusNotFound, 4004, "wallet not found"},
	services.ErrConcurrentConflict:  {http.StatusConflict, 4009, "concurrent conflict, please retry"},
	services.ErrVipPlanNotFound:     {http.StatusNotFound, 4040, "vip plan not found or inactive"},
	services.ErrIdolNotFound:        {http.StatusNotFound, 4041, "idol not found"},
	services.ErrIdolBanned:          {http.StatusForbidden, 4030, "idol is currently banned"},
}

func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "ok",
		Data:    data,
	})
}

func Fail(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Code:    code,
		Message: message,
		Data:    nil,
	})
}

func FailWithError(c *gin.Context, err error) {
	if detail, ok := errorCodeMap[err]; ok {
		c.JSON(detail.HTTPStatus, Response{
			Code:    detail.BizCode,
			Message: detail.Message,
			Data:    nil,
		})
		return
	}
	c.JSON(http.StatusInternalServerError, Response{
		Code:    5000,
		Message: "internal server error",
		Data:    nil,
	})
}

// NewSuccess and NewError are kept for backward compatibility with existing handlers.

func NewSuccess(message string, data interface{}) Response {
	return Response{
		Code:    200,
		Message: message,
		Data:    data,
	}
}

func NewError(code int, message string) Response {
	return Response{
		Code:    code,
		Message: message,
		Data:    nil,
	}
}
