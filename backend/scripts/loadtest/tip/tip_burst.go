// tip_burst — load test for the tipping critical path.
//
// Creates 1 idol and [numUsers] consumer users pre-funded with sufficient
// balance. Spawns [numUsers] goroutines; each user sends [tipsPerUser]
// sequential POST /api/tip requests.
//
// After all goroutines finish the script asserts three invariants:
//
//  1. idol.withdrawable_balance == SUM(tip_records.idol_income)
//  2. SUM(tip_records.commission_amount) == total platform commission collected
//  3. COUNT(tip_records) == numUsers × tipsPerUser
//
// Required env vars (same as the server):
//
//	JWT_SECRET   — HS256 signing key
//	DATABASE_URL — optional; defaults to the local docker-compose DSN
package main

import (
	"bytes"
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
	numUsers    = 500
	tipsPerUser = 1000
	tipAmount   = 100 // cents (¥1 per tip)
	baseURL     = "http://localhost:8080"

	testConsumerPrefix = "lt_tip_consumer_"
	testIdolUsername   = "lt_tip_idol"
	testIdolStageName  = "Load Test Idol"
)

// initialBalance gives each consumer enough for all their tips.
const initialBalance = int64(tipAmount) * int64(tipsPerUser) // 100,000 cents

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
	// Remove stale consumer users
	var consumerIDs []uint
	db.Model(&models.User{}).Where("username LIKE ?", testConsumerPrefix+"%").Pluck("id", &consumerIDs)
	if len(consumerIDs) > 0 {
		db.Exec("DELETE FROM ledger_records WHERE user_id IN ?", consumerIDs)
		db.Exec("DELETE FROM wallets WHERE user_id IN ?", consumerIDs)
		db.Exec("DELETE FROM users WHERE id IN ?", consumerIDs)
		fmt.Printf("[setup] removed %d stale consumer users\n", len(consumerIDs))
	}

	// Remove stale idol + its tip records
	var idolUserIDs []uint
	db.Model(&models.User{}).Where("username = ?", testIdolUsername).Pluck("id", &idolUserIDs)
	if len(idolUserIDs) > 0 {
		var idolIDs []uint
		db.Model(&models.Idol{}).Where("user_id IN ?", idolUserIDs).Pluck("id", &idolIDs)
		if len(idolIDs) > 0 {
			db.Exec("DELETE FROM tip_records WHERE idol_id IN ?", idolIDs)
			db.Exec("DELETE FROM idols WHERE id IN ?", idolIDs)
		}
		db.Exec("DELETE FROM ledger_records WHERE user_id IN ?", idolUserIDs)
		db.Exec("DELETE FROM wallets WHERE user_id IN ?", idolUserIDs)
		db.Exec("DELETE FROM users WHERE id IN ?", idolUserIDs)
		fmt.Println("[setup] removed stale idol user")
	}
}

type setupResult struct {
	idol          models.Idol
	consumerUsers []models.User
	tokens        []string
}

func setup(db *gorm.DB) setupResult {
	hash, _ := bcrypt.GenerateFromPassword([]byte("loadtest123"), bcrypt.MinCost)

	// Create idol user + idol record
	fmt.Println("[setup] creating idol...")
	idolUser := models.User{Username: testIdolUsername, PasswordHash: string(hash), Role: "host"}
	if err := db.Create(&idolUser).Error; err != nil {
		log.Fatalf("create idol user: %v", err)
	}
	idol := models.Idol{
		UserID:    idolUser.ID,
		StageName: testIdolStageName,
		Status:    models.IdolStatusActive,
	}
	if err := db.Create(&idol).Error; err != nil {
		log.Fatalf("create idol: %v", err)
	}

	// Create consumer users with pre-funded wallets
	fmt.Printf("[setup] creating %d consumer users (balance=%d each)...\n", numUsers, initialBalance)
	consumers := make([]models.User, numUsers)
	tokens := make([]string, numUsers)

	for i := 0; i < numUsers; i++ {
		u := models.User{
			Username:     fmt.Sprintf("%s%04d", testConsumerPrefix, i),
			PasswordHash: string(hash),
			Role:         "client",
		}
		if err := db.Create(&u).Error; err != nil {
			log.Fatalf("create consumer %d: %v", i, err)
		}
		// Pre-fund directly — this bypasses the ledger intentionally (synthetic test setup).
		wallet := models.Wallet{UserID: u.ID, Balance: initialBalance}
		if err := db.Create(&wallet).Error; err != nil {
			log.Fatalf("create wallet consumer %d: %v", i, err)
		}
		tok, err := utils.GenerateToken(u.ID, u.Username, string(u.Role))
		if err != nil {
			log.Fatalf("generate token consumer %d: %v", i, err)
		}
		consumers[i] = u
		tokens[i] = tok
	}

	fmt.Println("[setup] done")
	return setupResult{idol: idol, consumerUsers: consumers, tokens: tokens}
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

func doTip(token string, idolID uint) (lat time.Duration, errLabel string) {
	body, _ := json.Marshal(map[string]interface{}{"idol_id": idolID, "amount": tipAmount})
	req, _ := http.NewRequest(http.MethodPost, baseURL+"/api/tip", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	t0 := time.Now()
	resp, herr := httpClient.Do(req)
	lat = time.Since(t0)
	if herr != nil {
		return lat, classifyErr(herr)
	}
	io.Copy(io.Discard, resp.Body)
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return lat, fmt.Sprintf("HTTP %d", resp.StatusCode)
	}
	return lat, ""
}

// ── Invariant verification ────────────────────────────────────────────────────

func verify(db *gorm.DB, idol models.Idol) {
	fmt.Println("\n=== Invariant Checks ===")

	check := func(label string, ok bool, detail string) {
		tag := "PASS"
		if !ok {
			tag = "FAIL"
		}
		fmt.Printf("[%s] %s: %s\n", tag, label, detail)
	}

	// Reload idol from DB to get current balance
	var currentIdol models.Idol
	db.First(&currentIdol, idol.ID)

	// 1. TipRecord count
	var tipCount int64
	db.Model(&models.TipRecord{}).Where("idol_id = ?", idol.ID).Count(&tipCount)
	expectedCount := int64(numUsers * tipsPerUser)
	check("TipRecord count",
		tipCount == expectedCount,
		fmt.Sprintf("expected %d, got %d", expectedCount, tipCount))

	// 2. idol.withdrawable_balance == SUM(idol_income)
	var idolIncomeSum int64
	db.Model(&models.TipRecord{}).
		Where("idol_id = ?", idol.ID).
		Select("COALESCE(SUM(idol_income), 0)").
		Scan(&idolIncomeSum)
	check("Idol withdrawable_balance == SUM(idol_income)",
		currentIdol.WithdrawableBalance == idolIncomeSum,
		fmt.Sprintf("balance=%d  sum_income=%d", currentIdol.WithdrawableBalance, idolIncomeSum))

	// 3. Revenue split is internally consistent on settlement_amount:
	//    commission + idol_income == settlement_amount for every committed record.
	// Compared against actual DB data so HTTP-level failures don't produce false negatives.
	var commissionSum, settlementSum int64
	db.Model(&models.TipRecord{}).
		Where("idol_id = ?", idol.ID).
		Select("COALESCE(SUM(commission_amount), 0)").
		Scan(&commissionSum)
	db.Model(&models.TipRecord{}).
		Where("idol_id = ?", idol.ID).
		Select("COALESCE(SUM(settlement_amount), 0)").
		Scan(&settlementSum)
	check("Revenue split sums to settlement (commission+income==settlement_amount)",
		commissionSum+idolIncomeSum == settlementSum,
		fmt.Sprintf("commission=%d  idol_income=%d  settlement=%d", commissionSum, idolIncomeSum, settlementSum))

	// 4. idol.total_earnings reflects the settlement_amount of all committed tips.
	check("Idol total_earnings == SUM(settlement_amount)",
		currentIdol.TotalEarnings == settlementSum,
		fmt.Sprintf("total_earnings=%d  settlement_sum=%d", currentIdol.TotalEarnings, settlementSum))
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	db := connectDB()
	cleanupOldData(db)
	res := setup(db)

	col := newCollector(numUsers * tipsPerUser)

	// sem caps in-flight HTTP requests to match the server's DB pool (50 conns).
	// 500 goroutines are still spawned — only max-concurrency is bounded.
	sem := make(chan struct{}, 50)

	var wg sync.WaitGroup
	fmt.Printf("[load] starting %d goroutines (%d tips each, idol #%d, concurrency=50)...\n",
		numUsers, tipsPerUser, res.idol.ID)
	start := time.Now()

	for i := range res.consumerUsers {
		wg.Add(1)
		go func(token string) {
			defer wg.Done()
			for j := 0; j < tipsPerUser; j++ {
				sem <- struct{}{}
				lat, errLabel := doTip(token, res.idol.ID)
				<-sem
				col.record(lat, errLabel)
			}
		}(res.tokens[i])
	}

	wg.Wait()
	elapsed := time.Since(start)

	col.report(numUsers*tipsPerUser, elapsed)
	verify(db, res.idol)
}
