package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"e-idol-backend/internal/models"
	"e-idol-backend/pkg/middleware"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB initializes an in-memory SQLite database for testing purposes.
// It auto-migrates the necessary models.
func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}
	db.AutoMigrate(&models.User{}, &models.Order{})
	return db
}

// TestAdminMiddleware tests the RequireAdmin middleware.
func TestAdminMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Test case: A non-admin user should be forbidden.
	t.Run("should forbid access for non-admin user", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(recorder)
		c.Set("role", "client") // Simulate a client user.

		middleware.RequireAdmin()(c)

		assert.Equal(t, http.StatusForbidden, recorder.Code)
	})

	// Test case: An admin user should be allowed.
	t.Run("should allow access for admin user", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(recorder)
		c.Set("role", "admin") // Simulate an admin user.

		middleware.RequireAdmin()(c)

		assert.Equal(t, http.StatusOK, recorder.Code)
	})
}

// TestGetStats tests the GetStats handler.
func TestGetStats(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB(t)

	// Seed the database with test data.
	users := []models.User{
		{Username: "admin", Role: models.RoleAdmin},
		{Username: "host1", Role: models.RoleHost},
		{Username: "client1", Role: models.RoleClient},
	}
	db.Create(&users)

	orders := []models.Order{
		{ClientID: 3, HostID: 2, Status: models.StatusCompleted, TotalPrice: 100},
		{ClientID: 3, HostID: 2, Status: models.StatusCompleted, TotalPrice: 150},
		{ClientID: 3, HostID: 2, Status: models.StatusCancelled, TotalPrice: 200},
	}
	db.Create(&orders)

	// Create a test recorder and router.
	recorder := httptest.NewRecorder()
	_, router := gin.CreateTestContext(recorder)
	router.GET("/admin/stats", GetStats(db))
	
	// Create and serve a new HTTP request.
	req, _ := http.NewRequest(http.MethodGet, "/admin/stats", nil)
	router.ServeHTTP(recorder, req)

	// Assert the response status code.
	assert.Equal(t, http.StatusOK, recorder.Code)

	// Unmarshal the response body and assert the statistics.
	var response map[string]interface{}
	json.Unmarshal(recorder.Body.Bytes(), &response)

	assert.Equal(t, float64(3), response["total_users"])
	assert.Equal(t, float64(1), response["total_hosts"])
	assert.Equal(t, float64(3), response["total_orders"])
	assert.Equal(t, float64(250), response["total_revenue"]) // 100 + 150
}
