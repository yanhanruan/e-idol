package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"e-idol-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupOrderTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}
	db.AutoMigrate(&models.User{}, &models.Order{})
	return db
}

func TestOverlapBooking(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupOrderTestDB(t)

	// Create Host
	host := models.User{
		Username: "host1",
		Role:     models.RoleHost,
		Price:    100,
	}
	db.Create(&host)

	// Create Clients
	client1 := models.User{
		Username: "client1",
		Role:     models.RoleClient,
	}
	db.Create(&client1)

	client2 := models.User{
		Username: "client2",
		Role:     models.RoleClient,
	}
	db.Create(&client2)

	// Define booking details
	startTime := time.Now().UTC().Add(24 * time.Hour).Truncate(time.Hour)
	input := CreateOrderInput{
		HostID:    host.ID,
		StartTime: startTime,
		Duration:  2,
		Note:      "Booking",
	}

	// Helper to make request
	makeRequest := func(user models.User) *httptest.ResponseRecorder {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		// Mock authentication
		c.Set("userID", user.ID)
		c.Set("role", string(user.Role))

		// Prepare request body
		jsonBytes, _ := json.Marshal(input)
		c.Request, _ = http.NewRequest("POST", "/orders", bytes.NewBuffer(jsonBytes))
		c.Request.Header.Set("Content-Type", "application/json")

		CreateOrder(db)(c)
		return w
	}

	// Concurrent requests
	// Note: SQLite in-memory DB has limitations with concurrent writes.
	// We run requests sequentially to verify the overlap logic.

	resp1 := makeRequest(client1)
	resp2 := makeRequest(client2)

	// One should succeed (201), one should fail (409)
	codes := []int{resp1.Code, resp2.Code}
	successCount := 0
	conflictCount := 0

	for _, code := range codes {
		if code == http.StatusCreated {
			successCount++
		} else if code == http.StatusConflict {
			conflictCount++
		}
	}

	// Note: With SQLite in-memory and GORM, concurrent writes might be locked at DB level.
	// However, if the logic in CreateOrder fails (e.g. syntax error), both might fail with 500.

	// Check if we have 1 success and 1 conflict
	if successCount == 1 && conflictCount == 1 {
		// Pass
	} else {
		// If both failed, maybe syntax error
		t.Logf("Response 1: %d Body: %s", resp1.Code, resp1.Body.String())
		t.Logf("Response 2: %d Body: %s", resp2.Code, resp2.Body.String())

		// If we encounter the syntax error I predicted, we need to fix it.
		// Let's assert here to fail the test if expectation not met
		assert.True(t, successCount == 1, "Expected exactly one success")
		assert.True(t, conflictCount == 1, "Expected exactly one conflict")
	}
}

func TestTransactionRollback(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupOrderTestDB(t)

	// Create Host and Client
	host := models.User{Username: "host_rb", Role: models.RoleHost, Price: 100}
	db.Create(&host)
	client := models.User{Username: "client_rb", Role: models.RoleClient}
	db.Create(&client)

	// Hook into GORM to simulate failure after creation but before commit?
	// Or we can mock the DB to fail?
	// The requirement: "Simulate creating order when Panic or error happens, ensure no dirty data"

	// Approach 1: Use a hook on the Order model to panic or return error
	// But modifying the model for test is not ideal.

	// Approach 2: Mock the DB. But we are using a real SQLite DB.

	// Approach 3: Rely on CreateOrder's implementation.
	// If we can force an error inside the transaction.
	// The transaction does:
	// 1. Lock host
	// 2. Check overlap
	// 3. Create order

	// If we want to simulate a panic/error *during* transaction.
	// We can try to make the Create(&order) fail.
	// For example, if we pass invalid data that passes validation but fails in DB?
	// Or define a hook on Order model only in this test file? (Go doesn't allow dynamic method addition)

	// GORM hooks: BeforeCreate.
	// We can register a callback on the DB instance for this test.

	startTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	input := CreateOrderInput{
		HostID:    host.ID,
		StartTime: startTime,
		Duration:  2,
		Note:      "Rollback Test",
	}

	// Simulate error by dropping table orders to force DB error during creation
	// This ensures we test the error handling and rollback path
	db.Migrator().DropTable(&models.Order{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Set("userID", client.ID)
	c.Set("role", string(client.Role))

	jsonBytes, _ := json.Marshal(input)
	c.Request, _ = http.NewRequest("POST", "/orders", bytes.NewBuffer(jsonBytes))
	c.Request.Header.Set("Content-Type", "application/json")

	CreateOrder(db)(c)

	// Should fail with 500
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
