package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"e-idol-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupOrderTestDB(t *testing.T) *gorm.DB {
	// Add _busy_timeout to handle concurrent access in SQLite
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared&_busy_timeout=5000"), &gorm.Config{})
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

	// Concurrent requests simulation
	var wg sync.WaitGroup
	wg.Add(2)

	// Use channels to capture results from goroutines
	respChan := make(chan int, 2)

	// Start signal to ensure they start as close as possible
	start := make(chan struct{})

	// Function to run the request
	runRequest := func(user models.User) {
		defer wg.Done()
		<-start // Wait for signal
		w := makeRequest(user)
		respChan <- w.Code
	}

	go runRequest(client1)
	go runRequest(client2)

	// Start the race!
	close(start)
	wg.Wait()
	close(respChan)

	// Collect results
	successCount := 0
	conflictCount := 0

	for code := range respChan {
		if code == http.StatusCreated {
			successCount++
		} else if code == http.StatusConflict {
			conflictCount++
		}
	}

	// Check if we have 1 success and 1 conflict
	// Note: In a real race condition without proper locking, both might succeed (double booking).
	// Our code uses FOR UPDATE (or implicit DB locking in SQLite) to prevent this.
	if successCount == 1 && conflictCount == 1 {
		// Pass
	} else {
		t.Errorf("Expected 1 success and 1 conflict, got %d success and %d conflict", successCount, conflictCount)
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

	// GORM's Transaction function will automatically roll back if the provided function
	// returns an error or panics. To test this, we can force a panic inside the transaction.
	// We use a GORM callback to trigger a panic right before a new record is created.
	callbackName := "test:force_panic"
	db.Callback().Create().Before("gorm:create").Register(callbackName, func(db *gorm.DB) {
		panic("simulating a panic during create")
	})
	// Ensure the callback is removed after the test to not interfere with other tests.
	defer db.Callback().Create().Remove(callbackName)

	// This defer func is the key. It will execute after the CreateOrder handler finishes.
	// If a panic occurred, `recover()` will catch it, and we can then run our assertions.
	defer func() {
		// If `recover()` is not nil, a panic happened as we intended.
		if r := recover(); r != nil {
			// This is the core of the rollback test.
			// We check the database AFTER the failed transaction to ensure
			// no new order was actually saved.
			var count int64
			db.Model(&models.Order{}).Count(&count)
			assert.Equal(t, int64(0), count, "Database should be empty after a transaction rollback.")
		} else {
			// If for some reason our panic didn't happen, the test should fail.
			t.Errorf("The code did not panic as expected")
		}
	}()

	// Execute the request that we expect to cause a panic and a rollback.
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Set("userID", client.ID)
	c.Set("role", string(client.Role))
	jsonBytes, _ := json.Marshal(input)
	c.Request, _ = http.NewRequest("POST", "/orders", bytes.NewBuffer(jsonBytes))
	c.Request.Header.Set("Content-Type", "application/json")

	CreateOrder(db)(c)
}

func TestConcurrency_DoubleBooking(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupOrderTestDB(t)

	// Setup host and concurrent clients
	host := models.User{Username: "host_concurrency", Role: models.RoleHost, Price: 100}
	db.Create(&host)

	concurrentCount := 50
	clients := make([]models.User, concurrentCount)
	for i := 0; i < concurrentCount; i++ {
		clients[i] = models.User{Username: fmt.Sprintf("client_%d", i), Role: models.RoleClient}
		db.Create(&clients[i])
	}

	// Prepare booking input
	startTime := time.Now().UTC().Add(48 * time.Hour).Truncate(time.Hour)
	input := CreateOrderInput{
		HostID:    host.ID,
		StartTime: startTime,
		Duration:  2,
		Note:      "Flash Sale Booking",
	}
	inputJson, _ := json.Marshal(input)

	var wg sync.WaitGroup
	wg.Add(concurrentCount)

	// Atomic counters for results
	var successCount int32
	var conflictCount int32
	var errorCount int32

	// Channel to synchronize start time
	startGun := make(chan struct{})

	for i := 0; i < concurrentCount; i++ {
		go func(user models.User) {
			defer wg.Done()
			<-startGun // Wait for signal

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Set("userID", user.ID)
			c.Set("role", string(user.Role))

			c.Request, _ = http.NewRequest("POST", "/orders", bytes.NewBuffer(inputJson))
			c.Request.Header.Set("Content-Type", "application/json")

			CreateOrder(db)(c)

			switch w.Code {
			case http.StatusCreated:
				atomic.AddInt32(&successCount, 1)
			case http.StatusConflict:
				atomic.AddInt32(&conflictCount, 1)
			default:
				// Counts other errors (e.g., SQLite lock busy) as failed attempts
				atomic.AddInt32(&errorCount, 1)
			}
		}(clients[i])
	}

	// Start all goroutines simultaneously
	close(startGun)
	wg.Wait()

	// Assertions
	// Only 1 order should succeed
	assert.Equal(t, int32(1), successCount, "Exactly one order should be created")

	// Verify DB record count
	var dbCount int64
	db.Model(&models.Order{}).Where("host_id = ? AND start_time = ?", host.ID, startTime).Count(&dbCount)
	assert.Equal(t, int64(1), dbCount, "Database record count mismatch")

	t.Logf("Concurrency Result: Success=%d, Conflict=%d, Error=%d", successCount, conflictCount, errorCount)
}
