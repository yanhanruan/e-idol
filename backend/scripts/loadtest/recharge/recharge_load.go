// recharge_load — load test for the wallet recharge + webhook critical path.
//
// Spawns [numUsers] goroutines; each user performs [rechargesPerUser] sequential
// (POST /api/wallet/recharge  →  POST /api/wallet/webhook/recharge) pairs.
//
// After all goroutines finish the script asserts three invariants:
//
//  1. SUM(wallet.balance) for all test users == numUsers × rechargesPerUser × rechargeAmount
//  2. COUNT(ledger_records WHERE type=recharge AND status=success) == numUsers × rechargesPerUser
//  3. COUNT(DISTINCT transaction_id) == COUNT(*) — no duplicate credits
//
// Required env vars (same as the server):
//
//	JWT_SECRET      — HS256 signing key
//	MOCK_PAY_SECRET — HMAC-SHA256 key used to sign webhook payloads
//	DATABASE_URL    — optional; defaults to the local docker-compose DSN
package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"e-idol-backend/internal/models"
	"e-idol-backend/pkg/utils"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	numUsers         = 1000
	rechargesPerUser = 10
	rechargeAmount   = 1000 // cents (¥10)
	baseURL          = "http://localhost:8080"
	testUserPrefix   = "lt_recharge_"
)

// ── HTTP client ───────────────────────────────────────────────────────────────

var httpClient = &http.Client{
	Timeout: 30 * time.Second,
	Transport: &http.Transport{
		MaxIdleConns:        2000,
		MaxIdleConnsPerHost: 2000,
		IdleConnTimeout:     90 * time.Second,
	},
}

// ── Latency collector ─────────────────────────────────────────────────────────

type collector struct {
	mu        sync.Mutex
	latencies []time.Duration
	errTypes  map[string]int // error label → count
}

func newCollector(cap int) *collector {
	return &collector{
		latencies: make([]time.Duration, 0, cap),
		errTypes:  make(map[string]int),
	}
}

// record appends a latency sample. errLabel is "" on success or a short
// descriptor ("HTTP 500", "timeout", …) on failure.
func (c *collector) record(d time.Duration, errLabel string) {
	c.mu.Lock()
	c.latencies = append(c.latencies, d)
	if errLabel != "" {
		c.errTypes[errLabel]++
	}
	c.mu.Unlock()
}

func (c *collector) totalErrors() int {
	n := 0
	for _, v := range c.errTypes {
		n += v
	}
	return n
}

func (c *collector) report(totalReqs int, elapsed time.Duration) {
	sort.Slice(c.latencies, func(i, j int) bool { return c.latencies[i] < c.latencies[j] })
	n := len(c.latencies)

	pct := func(p float64) time.Duration {
		if n == 0 {
			return 0
		}
		idx := int(float64(n)*p) - 1
		if idx < 0 {
			idx = 0
		}
		if idx >= n {
			idx = n - 1
		}
		return c.latencies[idx]
	}

	errs := c.totalErrors()
	qps := float64(totalReqs) / elapsed.Seconds()
	errRate := float64(errs) / float64(totalReqs) * 100
	p95 := pct(0.95)
	p99 := pct(0.99)

	fmt.Println("\n=== Load Test Results ===")
	fmt.Printf("Total requests : %d\n", totalReqs)
	fmt.Printf("Errors         : %d\n", errs)
	fmt.Printf("Error rate     : %.2f%%\n", errRate)
	fmt.Printf("Duration       : %.1fs\n", elapsed.Seconds())
	fmt.Printf("QPS            : %.1f\n", qps)
	fmt.Printf("P50 latency    : %v\n", pct(0.50).Round(time.Millisecond))
	fmt.Printf("P95 latency    : %v\n", p95.Round(time.Millisecond))
	fmt.Printf("P99 latency    : %v\n", p99.Round(time.Millisecond))
	fmt.Printf("P95→P99 gap    : %v\n", (p99 - p95).Round(time.Millisecond))

	if len(c.errTypes) > 0 {
		type kv struct {
			label string
			count int
		}
		pairs := make([]kv, 0, len(c.errTypes))
		for k, v := range c.errTypes {
			pairs = append(pairs, kv{k, v})
		}
		sort.Slice(pairs, func(i, j int) bool { return pairs[i].count > pairs[j].count })
		fmt.Println("\n=== Error Breakdown ===")
		for _, p := range pairs {
			fmt.Printf("  %-35s : %d\n", p.label, p.count)
		}
	}
}

// ── DB helpers ────────────────────────────────────────────────────────────────

func connectDB() *gorm.DB {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=password dbname=eidol_db port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Discard})
	if err != nil {
		log.Fatalf("DB connect: %v", err)
	}
	return db
}

func cleanupOldData(db *gorm.DB) {
	var ids []uint
	db.Model(&models.User{}).Where("username LIKE ?", testUserPrefix+"%").Pluck("id", &ids)
	if len(ids) == 0 {
		return
	}
	db.Exec("DELETE FROM ledger_records WHERE user_id IN ?", ids)
	db.Exec("DELETE FROM wallets WHERE user_id IN ?", ids)
	db.Exec("DELETE FROM users WHERE id IN ?", ids)
	fmt.Printf("[setup] removed %d stale test users from previous run\n", len(ids))
}

func setupUsers(db *gorm.DB) ([]models.User, []string) {
	hash, _ := bcrypt.GenerateFromPassword([]byte("loadtest123"), bcrypt.MinCost)
	users := make([]models.User, numUsers)
	tokens := make([]string, numUsers)

	fmt.Printf("[setup] creating %d test users + wallets...\n", numUsers)
	for i := 0; i < numUsers; i++ {
		u := models.User{
			Username:     fmt.Sprintf("%s%04d", testUserPrefix, i),
			PasswordHash: string(hash),
			Role:         "client",
		}
		if err := db.Create(&u).Error; err != nil {
			log.Fatalf("create user %d: %v", i, err)
		}
		if err := db.Create(&models.Wallet{UserID: u.ID}).Error; err != nil {
			log.Fatalf("create wallet user %d: %v", i, err)
		}
		tok, err := utils.GenerateToken(u.ID, u.Username, string(u.Role))
		if err != nil {
			log.Fatalf("generate token user %d: %v", i, err)
		}
		users[i] = u
		tokens[i] = tok
	}
	fmt.Println("[setup] done")
	return users, tokens
}

// ── HTTP request helpers ──────────────────────────────────────────────────────

func webhookSign(txID, status, secret string) string {
	payload := fmt.Sprintf("status=%s&transaction_id=%s", status, txID)
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	return hex.EncodeToString(mac.Sum(nil))
}

// classifyErr converts a network-level error to a short label used in the
// error breakdown table.
func classifyErr(err error) string {
	s := err.Error()
	switch {
	case strings.Contains(s, "context deadline exceeded") || strings.Contains(s, "timeout"):
		return "network: timeout"
	case strings.Contains(s, "connection refused"):
		return "network: connection refused"
	case strings.Contains(s, "EOF"):
		return "network: EOF"
	default:
		if len(s) > 50 {
			s = s[:50] + "…"
		}
		return "network: " + s
	}
}

func doRecharge(token string) (txID string, lat time.Duration, errLabel string) {
	body, _ := json.Marshal(map[string]interface{}{"amount": rechargeAmount, "channel": "mock"})
	req, _ := http.NewRequest(http.MethodPost, baseURL+"/api/wallet/recharge", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	t0 := time.Now()
	resp, herr := httpClient.Do(req)
	lat = time.Since(t0)
	if herr != nil {
		return "", lat, classifyErr(herr)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		io.Copy(io.Discard, resp.Body)
		return "", lat, fmt.Sprintf("recharge: HTTP %d", resp.StatusCode)
	}

	var out struct {
		Data struct {
			TransactionID string `json:"transaction_id"`
		} `json:"data"`
	}
	if e := json.NewDecoder(resp.Body).Decode(&out); e != nil {
		return "", lat, "recharge: decode error"
	}
	return out.Data.TransactionID, lat, ""
}

func doWebhook(txID, secret string) (lat time.Duration, errLabel string) {
	sign := webhookSign(txID, "success", secret)
	body, _ := json.Marshal(map[string]string{
		"transaction_id": txID,
		"status":         "success",
		"sign":           sign,
	})
	req, _ := http.NewRequest(http.MethodPost, baseURL+"/api/wallet/webhook/recharge", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	t0 := time.Now()
	resp, herr := httpClient.Do(req)
	lat = time.Since(t0)
	if herr != nil {
		return lat, classifyErr(herr)
	}
	io.Copy(io.Discard, resp.Body)
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return lat, fmt.Sprintf("webhook: HTTP %d", resp.StatusCode)
	}
	return lat, ""
}

// ── Invariant verification ────────────────────────────────────────────────────

func verify(db *gorm.DB, users []models.User) {
	fmt.Println("\n=== Invariant Checks ===")
	ids := make([]uint, len(users))
	for i, u := range users {
		ids[i] = u.ID
	}

	check := func(label string, ok bool, detail string) {
		tag := "PASS"
		if !ok {
			tag = "FAIL"
		}
		fmt.Printf("[%s] %s: %s\n", tag, label, detail)
	}

	// 1. Total wallet balance
	var balanceSum int64
	db.Raw("SELECT COALESCE(SUM(balance), 0) FROM wallets WHERE user_id IN ? AND deleted_at IS NULL", ids).Scan(&balanceSum)
	expected := int64(numUsers) * int64(rechargesPerUser) * int64(rechargeAmount)
	check("Wallet balance sum",
		balanceSum == expected,
		fmt.Sprintf("expected %d, got %d", expected, balanceSum))

	// 2. LedgerRecord count (confirmed recharges only)
	var ledgerCount int64
	db.Model(&models.LedgerRecord{}).
		Where("user_id IN ? AND transaction_type = ? AND status = ?",
			ids, models.TxTypeRecharge, models.TxStatusSuccess).
		Count(&ledgerCount)
	expectedLedger := int64(numUsers * rechargesPerUser)
	check("LedgerRecord count",
		ledgerCount == expectedLedger,
		fmt.Sprintf("expected %d, got %d", expectedLedger, ledgerCount))

	// 3. No duplicate transaction_ids (idempotency guard)
	var distinctCount int64
	db.Raw(`SELECT COUNT(DISTINCT transaction_id) FROM ledger_records
		WHERE user_id IN ? AND transaction_type = ? AND status = ?`,
		ids, string(models.TxTypeRecharge), string(models.TxStatusSuccess)).Scan(&distinctCount)
	check("No duplicate credits",
		distinctCount == ledgerCount,
		fmt.Sprintf("%d distinct IDs vs %d records", distinctCount, ledgerCount))
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	// empty string is valid — the server uses the same env var, so they will always agree
	secret := os.Getenv("MOCK_PAY_SECRET")

	db := connectDB()
	cleanupOldData(db)
	users, tokens := setupUsers(db)

	col := newCollector(numUsers * rechargesPerUser * 2)

	// sem caps in-flight HTTP requests to match the server's DB pool (50 conns).
	// 1000 goroutines are still spawned — only max-concurrency is bounded.
	sem := make(chan struct{}, 50)

	var wg sync.WaitGroup
	fmt.Printf("[load] starting %d goroutines (%d recharges each, concurrency=50)...\n", numUsers, rechargesPerUser)
	start := time.Now()

	for i := range users {
		wg.Add(1)
		go func(token string) {
			defer wg.Done()
			for j := 0; j < rechargesPerUser; j++ {
				sem <- struct{}{}
				txID, lat, rLabel := doRecharge(token)
				<-sem
				col.record(lat, rLabel)
				if rLabel != "" {
					continue
				}
				sem <- struct{}{}
				wLat, wLabel := doWebhook(txID, secret)
				<-sem
				col.record(wLat, wLabel)
			}
		}(tokens[i])
	}

	wg.Wait()
	elapsed := time.Since(start)

	col.report(numUsers*rechargesPerUser*2, elapsed)
	verify(db, users)
}
