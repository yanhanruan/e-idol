package utils

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte

func init() {
	loadEnvFile()
	key := os.Getenv("JWT_SECRET")
	if key == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}
	jwtKey = []byte(key)
}

// loadEnvFile 从工作目录向上逐级查找 .env 文件并加载（仅支持 KEY=VALUE 格式，每行一条，支持 # 注释）
func loadEnvFile() {
	dir, err := os.Getwd()
	if err != nil {
		return
	}
	for {
		envPath := dir + string(os.PathSeparator) + ".env"
		data, err := os.ReadFile(envPath)
		if err == nil {
			parseEnvFile(data)
			return
		}
		// 回到上级目录
		parent := dir[:strings.LastIndex(dir, string(os.PathSeparator))]
		if parent == dir {
			return // 已到根目录，未找到 .env
		}
		dir = parent
	}
}

func parseEnvFile(data []byte) {
	content := strings.ReplaceAll(string(data), "\r\n", "\n")
	content = strings.ReplaceAll(content, "\r", "\n")
	for _, line := range strings.Split(content, "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])
			// 仅当环境变量未设置时才从 .env 读取，避免覆盖系统环境变量
			if os.Getenv(key) == "" {
				os.Setenv(key, value)
			}
		}
	}
}

type Claims struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(id uint, username string, role string) (string, error) {
	now := time.Now()
	expirationTime := now.Add(24 * time.Hour)
	claims := &Claims{
		ID:       id,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ValidateToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}

	return claims, nil
}
