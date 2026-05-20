package models

import "time"

// TipRecord is an append-only record of a single tipping transaction.
// It captures the full four-way amount split at the moment of the tip so that
// historical records remain accurate even if rates or discount policies change later.
//
// Amount semantics:
//   - OriginalAmount   full tip value before any discount (what the consumer declared)
//   - PaidAmount       actual cents deducted from the consumer's wallet (≤ OriginalAmount)
//   - DiscountAmount   VIP subsidy absorbed by the platform; persisted for accounting reconciliation
//   - SettlementAmount basis for idol commission calculation; equals OriginalAmount today,
//                      kept separate to accommodate future scenarios (partial refunds, etc.)
//
// For non-VIP users: PaidAmount = OriginalAmount = SettlementAmount, DiscountAmount = 0.
// All values are in cents; integer arithmetic only — no float64.
//
// Invariants enforced at both the DB (CHECK constraints) and application layers:
//   - original_amount > 0
//   - 0 < paid_amount <= original_amount
//   - discount_amount >= 0
//   - settlement_amount > 0
type TipRecord struct {
	ID               uint      `gorm:"primaryKey;autoIncrement"                                                          json:"id"`
	FromUserID       uint      `gorm:"index;not null"                                                                    json:"from_user_id"`
	IdolID           uint      `gorm:"index;not null"                                                                    json:"idol_id"`
	OriginalAmount   int64     `gorm:"not null;check:chk_tip_original_pos,original_amount > 0"                           json:"original_amount"`   // full tip before any VIP discount, in cents
	PaidAmount       int64     `gorm:"not null;check:chk_tip_paid_range,paid_amount > 0 AND paid_amount <= original_amount" json:"paid_amount"`      // actual amount charged to consumer, in cents
	DiscountAmount   int64     `gorm:"not null;default:0;check:chk_tip_discount_nonneg,discount_amount >= 0"             json:"discount_amount"`   // platform-absorbed VIP subsidy, in cents
	SettlementAmount int64     `gorm:"not null;check:chk_tip_settlement_pos,settlement_amount > 0"                       json:"settlement_amount"` // basis for idol commission split, in cents
	CommissionAmount int64     `gorm:"not null"                                                                          json:"commission_amount"` // platform commission on SettlementAmount, in cents
	IdolIncome       int64     `gorm:"not null"                                                                          json:"idol_income"`       // net credited to idol = SettlementAmount - CommissionAmount, in cents
	LedgerTxID       string    `gorm:"type:varchar(64);index"                                                            json:"ledger_tx_id"`      // transaction_id of the corresponding consumer LedgerRecord
	CreatedAt        time.Time `                                                                                          json:"created_at"`
}
