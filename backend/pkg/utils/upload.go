package utils

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func SaveUploadedFile(c *gin.Context, file *multipart.FileHeader) (string, error) {
	// Ensure the uploads directory exists
	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Generate a unique filename to prevent overwrites
	filename := filepath.Base(file.Filename)
	ext := filepath.Ext(filename)
	randomName := strings.ReplaceAll(filepath.Base(filename), ext, "") + "_" + fmt.Sprintf("%d", os.Getpid())
	newFileName := randomName + ext
	filePath := filepath.Join("./uploads", newFileName)

	// Save the file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	// Return the URL path
	return "/uploads/" + newFileName, nil
}
