// go test -v -count=1 -timeout 300s ./internal/services/ -run TestTipServiceSuite 2>&1

package services

import (
	"context"
	"fmt"
	"testing"
	"time"

	"e-idol-backend/internal/database"
	"e-idol-backend/internal/models"

	"github.com/stretchr/testify/suite"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	gormPostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ── Suite ─────────────────────────────────────────────────────────────────────

type TipServiceTestSuite struct {
	suite.Suite
	ctx       context.Context
	db        *gorm.DB
	container *tcpostgres.PostgresContainer
}

func TestTipServiceSuite(t *testing.T) {
	suite.Run(t, new(TipServiceTestSuite))
}

func (s *TipServiceTestSuite) SetupSuite() {
	s.ctx = context.Background()

	pgContainer, err := tcpostgres.Run(s.ctx,
		"postgres:15-alpine",
		tcpostgres.WithDatabase("testdb"),
		tcpostgres.WithUsername("postgres"),
		tcpostgres.WithPassword("password"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(60*time.Second),
		),
	)
	s.Require().NoError(err)
	s.container = pgContainer

	connStr, err := pgContainer.ConnectionString(s.ctx, "sslmode=disable")
	s.Require().NoError(err)

	s.db, err = gorm.Open(gormPostgres.Open(connStr), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	s.Require().NoError(err)

	database.AutoMigrate(s.db)
}

func (s *TipServiceTestSuite) TearDownSuite() {
	if s.container != nil {
		s.Require().NoError(s.container.Terminate(s.ctx))
	}
}

func (s *TipServiceTestSuite) SetupTest() {
	// The commission rate cache is package-level. Clear it before each test so
	// every test seeds and reads its own PlatformCommissionConfig row.
	commissionRateCache.Delete("active_rate")
}

// ── Fixture helpers ───────────────────────────────────────────────────────────

const (
	testCommissionRate = 3000 // 30 % platform commission
	testVipDiscount    = 9000 // 10 % off (consumer pays 90 %)
)

// seedCommissionConfig inserts a PlatformCommissionConfig effective one hour ago.
func (s *TipServiceTestSuite) seedCommissionConfig(tx *gorm.DB, rate int) {
	cfg := models.PlatformCommissionConfig{
		EffectiveAt:    time.Now().Add(-time.Hour),
		CommissionRate: rate,
	}
	s.Require().NoError(tx.Create(&cfg).Error)
}

type tipFixture struct {
	consumer models.User
	wallet   models.Wallet
	idol     models.Idol
}

// seedTipFixture creates a consumer user + wallet and an active idol.
// suffix is used to guarantee unique usernames within a test.
func (s *TipServiceTestSuite) seedTipFixture(tx *gorm.DB, suffix string, consumerBalance int64) tipFixture {
	consumer := models.User{
		Username:     fmt.Sprintf("tip_consumer_%s", suffix),
		PasswordHash: "x",
		Role:         models.RoleClient,
	}
	s.Require().NoError(tx.Create(&consumer).Error)

	wallet := models.Wallet{UserID: consumer.ID, Balance: consumerBalance}
	s.Require().NoError(tx.Create(&wallet).Error)

	idolUser := models.User{
		Username:     fmt.Sprintf("tip_idol_%s", suffix),
		PasswordHash: "x",
		Role:         models.RoleHost,
	}
	s.Require().NoError(tx.Create(&idolUser).Error)

	idol := models.Idol{
		UserID:    idolUser.ID,
		StageName: "Test Idol",
		Status:    models.IdolStatusActive,
	}
	s.Require().NoError(tx.Create(&idol).Error)

	return tipFixture{consumer: consumer, wallet: wallet, idol: idol}
}

// seedActiveVip creates a VipPlan and a non-expired UserVip for the consumer.
func (s *TipServiceTestSuite) seedActiveVip(tx *gorm.DB, consumerID uint, discountRate int) {
	plan := models.VipPlan{
		Name:         "Test VIP Plan",
		Level:        1,
		DurationDays: 30,
		Price:        9900,
		DiscountRate: discountRate,
		IsActive:     true,
	}
	s.Require().NoError(tx.Create(&plan).Error)

	vip := models.UserVip{
		UserID:     consumerID,
		Level:      1,
		ExpireAt:   time.Now().Add(30 * 24 * time.Hour),
		LastPlanID: plan.ID,
	}
	s.Require().NoError(tx.Create(&vip).Error)
}

// seedExpiredVip creates a UserVip whose ExpireAt is in the past.
func (s *TipServiceTestSuite) seedExpiredVip(tx *gorm.DB, consumerID uint, discountRate int) {
	plan := models.VipPlan{
		Name:         "Expired VIP Plan",
		Level:        1,
		DurationDays: 30,
		Price:        9900,
		DiscountRate: discountRate,
		IsActive:     true,
	}
	s.Require().NoError(tx.Create(&plan).Error)

	vip := models.UserVip{
		UserID:     consumerID,
		Level:      1,
		ExpireAt:   time.Now().Add(-time.Hour), // already lapsed
		LastPlanID: plan.ID,
	}
	s.Require().NoError(tx.Create(&vip).Error)
}

// ── Layer 1: Pure function tests (no DB required) ─────────────────────────────

func (s *TipServiceTestSuite) TestComputePaidAmount_NoDiscount() {
	s.Equal(int64(1000), computePaidAmount(1000, 10000),
		"rate=10000 (full price) must return originalAmount unchanged")
}

func (s *TipServiceTestSuite) TestComputePaidAmount_TenPercentOff() {
	// 1000 * 9000 = 9_000_000; (9_000_000 + 9999) / 10000 = 900 (exact, no ceiling triggered)
	s.Equal(int64(900), computePaidAmount(1000, 9000))
}

func (s *TipServiceTestSuite) TestComputePaidAmount_CeilingOnFractionalCent() {
	// 1 * 9000 = 9000; (9000 + 9999) / 10000 = 1 (ceiling keeps 1 cent, not 0)
	s.Equal(int64(1), computePaidAmount(1, 9000),
		"ceiling division must prevent rounding down to 0")
}

func (s *TipServiceTestSuite) TestComputePaidAmount_GuardZeroRate() {
	s.Equal(int64(1000), computePaidAmount(1000, 0),
		"rate=0 is invalid; must return originalAmount")
}

func (s *TipServiceTestSuite) TestComputePaidAmount_GuardNegativeRate() {
	s.Equal(int64(1000), computePaidAmount(1000, -1),
		"negative rate is invalid; must return originalAmount")
}

func (s *TipServiceTestSuite) TestComputePaidAmount_GuardOverflowRate() {
	s.Equal(int64(1000), computePaidAmount(1000, 10001),
		"rate>10000 is invalid; must return originalAmount")
}

func (s *TipServiceTestSuite) TestComputeSettlementAmount_AlwaysEqualsOriginal() {
	for _, v := range []int64{1, 100, 1000, 99999} {
		s.Equal(v, computeSettlementAmount(v),
			"computeSettlementAmount(%d) must equal its input", v)
	}
}

func (s *TipServiceTestSuite) TestAmountInvariant_PaidPlusDiscountEqualsOriginal() {
	cases := []struct {
		original int64
		rate     int
		label    string
	}{
		{1000, 10000, "no discount"},
		{1000, 9000, "10% off"},
		{1000, 8000, "20% off"},
		{1000, 5000, "50% off"},
		{1, 9000, "fractional-cent input"},
		{999, 9000, "non-round amount"},
		{100, 7777, "irregular rate"},
	}
	for _, c := range cases {
		paid := computePaidAmount(c.original, c.rate)
		discount := c.original - paid
		s.Equal(c.original, paid+discount,
			"[%s] paid+discount must equal original", c.label)
		s.GreaterOrEqual(discount, int64(0),
			"[%s] discount must be non-negative", c.label)
		s.LessOrEqual(paid, c.original,
			"[%s] paid must not exceed original", c.label)
		s.Greater(paid, int64(0),
			"[%s] paid must be positive", c.label)
	}
}

// ── Layer 2: Integration tests ────────────────────────────────────────────────

// TestTip_NonVIP verifies the standard (no-discount) tip flow:
//   - PaidAmount = OriginalAmount = SettlementAmount
//   - DiscountAmount = 0
//   - Consumer wallet debited OriginalAmount
//   - Idol income based on SettlementAmount at the platform commission rate
func (s *TipServiceTestSuite) TestTip_NonVIP() {
	tx := s.db.Begin()
	defer tx.Rollback()

	s.seedCommissionConfig(tx, testCommissionRate)
	const originalAmount = int64(1000) // ¥10.00
	f := s.seedTipFixture(tx, "nonvip", originalAmount)
	svc := NewTipService(tx)

	record, err := svc.Tip(int64(f.consumer.ID), int64(f.idol.ID), originalAmount)
	s.Require().NoError(err)
	s.Require().NotNil(record)

	// Amount fields
	s.Equal(originalAmount, record.OriginalAmount)
	s.Equal(originalAmount, record.PaidAmount, "non-VIP: paid must equal original")
	s.Equal(int64(0), record.DiscountAmount, "non-VIP: discount must be zero")
	s.Equal(originalAmount, record.SettlementAmount)

	// Revenue split: commission=300, idolIncome=700
	expectedCommission := originalAmount * testCommissionRate / 10000 // 300
	expectedIdolIncome := originalAmount - expectedCommission          // 700
	s.Equal(expectedCommission, record.CommissionAmount)
	s.Equal(expectedIdolIncome, record.IdolIncome)

	// Consumer wallet fully debited by PaidAmount
	var w models.Wallet
	s.Require().NoError(tx.First(&w, f.wallet.ID).Error)
	s.Equal(int64(0), w.Balance, "wallet must be fully debited by paid_amount")

	// Idol balances reflect settlement-based income
	var idol models.Idol
	s.Require().NoError(tx.First(&idol, f.idol.ID).Error)
	s.Equal(expectedIdolIncome, idol.WithdrawableBalance)
	s.Equal(originalAmount, idol.TotalEarnings,
		"total_earnings must use settlement_amount, not paid_amount")
}

// TestTip_VIP_TenPercentOff verifies that a VIP consumer:
//   - is charged PaidAmount (< OriginalAmount)
//   - produces a DiscountAmount that the platform absorbs
//   - does NOT change the idol's revenue (still based on SettlementAmount)
func (s *TipServiceTestSuite) TestTip_VIP_TenPercentOff() {
	tx := s.db.Begin()
	defer tx.Rollback()

	s.seedCommissionConfig(tx, testCommissionRate)
	const originalAmount = int64(1000)
	// Fund consumer with originalAmount; only paidAmount will be deducted.
	f := s.seedTipFixture(tx, "vip10off", originalAmount)
	s.seedActiveVip(tx, f.consumer.ID, testVipDiscount) // 9000 bps = 10% off
	svc := NewTipService(tx)

	record, err := svc.Tip(int64(f.consumer.ID), int64(f.idol.ID), originalAmount)
	s.Require().NoError(err)
	s.Require().NotNil(record)

	expectedPaid := computePaidAmount(originalAmount, testVipDiscount) // 900
	expectedDiscount := originalAmount - expectedPaid                   // 100

	// Amount fields
	s.Equal(originalAmount, record.OriginalAmount)
	s.Equal(expectedPaid, record.PaidAmount, "VIP: paid_amount must be discounted")
	s.Equal(expectedDiscount, record.DiscountAmount,
		"platform absorbs discount_amount=%d", expectedDiscount)
	s.Equal(originalAmount, record.SettlementAmount,
		"settlement_amount is always original_amount")

	// Revenue split is identical to non-VIP at the same originalAmount
	expectedCommission := originalAmount * testCommissionRate / 10000 // 300
	expectedIdolIncome := originalAmount - expectedCommission          // 700
	s.Equal(expectedCommission, record.CommissionAmount,
		"commission uses settlement_amount, not paid_amount")
	s.Equal(expectedIdolIncome, record.IdolIncome,
		"idol income is unaffected by consumer VIP discount")

	// Consumer wallet retains the discount (was charged 900, not 1000)
	var w models.Wallet
	s.Require().NoError(tx.First(&w, f.wallet.ID).Error)
	s.Equal(expectedDiscount, w.Balance,
		"wallet retains discount_amount=%d after tip", expectedDiscount)

	// Idol balances identical to non-VIP scenario
	var idol models.Idol
	s.Require().NoError(tx.First(&idol, f.idol.ID).Error)
	s.Equal(expectedIdolIncome, idol.WithdrawableBalance)
	s.Equal(originalAmount, idol.TotalEarnings)
}

// TestTip_ExpiredVIP_TreatedAsNonVIP verifies that an expired VIP subscription
// confers no discount — the consumer is charged the full OriginalAmount.
func (s *TipServiceTestSuite) TestTip_ExpiredVIP_TreatedAsNonVIP() {
	tx := s.db.Begin()
	defer tx.Rollback()

	s.seedCommissionConfig(tx, testCommissionRate)
	const originalAmount = int64(1000)
	f := s.seedTipFixture(tx, "expvip", originalAmount)
	s.seedExpiredVip(tx, f.consumer.ID, testVipDiscount)
	svc := NewTipService(tx)

	record, err := svc.Tip(int64(f.consumer.ID), int64(f.idol.ID), originalAmount)
	s.Require().NoError(err)
	s.Require().NotNil(record)

	s.Equal(originalAmount, record.PaidAmount,
		"expired VIP must not apply a discount")
	s.Equal(int64(0), record.DiscountAmount,
		"discount_amount must be 0 for expired VIP")
	s.Equal(originalAmount, record.SettlementAmount)

	// Wallet fully debited — no discount was applied
	var w models.Wallet
	s.Require().NoError(tx.First(&w, f.wallet.ID).Error)
	s.Equal(int64(0), w.Balance)
}

// TestTip_InsufficientBalance_PaidAmountIsThreshold confirms that the deduction
// threshold is PaidAmount, not OriginalAmount.
//
// A VIP consumer funded with exactly paidAmount cents must succeed, even though
// that balance would be insufficient to cover the full originalAmount.
func (s *TipServiceTestSuite) TestTip_InsufficientBalance_PaidAmountIsThreshold() {
	tx := s.db.Begin()
	defer tx.Rollback()

	s.seedCommissionConfig(tx, testCommissionRate)
	const originalAmount = int64(1000)
	expectedPaid := computePaidAmount(originalAmount, testVipDiscount) // 900

	// Fund wallet with exactly paidAmount — below originalAmount, sufficient for paidAmount.
	f := s.seedTipFixture(tx, "threshold", expectedPaid)
	s.seedActiveVip(tx, f.consumer.ID, testVipDiscount)
	svc := NewTipService(tx)

	record, err := svc.Tip(int64(f.consumer.ID), int64(f.idol.ID), originalAmount)
	s.Require().NoError(err,
		"VIP consumer with balance==paidAmount (%d) must succeed", expectedPaid)

	s.Equal(expectedPaid, record.PaidAmount)
	s.Equal(originalAmount-expectedPaid, record.DiscountAmount)

	// Wallet is now empty
	var w models.Wallet
	s.Require().NoError(tx.First(&w, f.wallet.ID).Error)
	s.Equal(int64(0), w.Balance,
		"wallet must be fully drained by paid_amount")
}
