package models

import "time"

// TipRecord is an append-only record of a single tipping transaction.
// It captures the three-party fund split at the moment of the tip so that
// historical records remain accurate even if commission rates change later.
//
// CommissionAmount and IdolIncome are stored in cents using integer arithmetic
// (basis points) to avoid IEEE 754 floating-point precision errors.
type TipRecord struct {
	ID               uint      `gorm:"primaryKey;autoIncrement"      json:"id"`
	FromUserID       uint      `gorm:"index;not null"                json:"from_user_id"`
	IdolID           uint      `gorm:"index;not null"                json:"idol_id"`
	Amount           int64     `gorm:"not null"                      json:"amount"`            // total paid by the user, in cents
	CommissionAmount int64     `gorm:"not null"                      json:"commission_amount"` // platform commission deducted, in cents
	IdolIncome       int64     `gorm:"not null"                      json:"idol_income"`       // net amount credited to the idol, in cents
	LedgerTxID       string    `gorm:"type:varchar(64);index"        json:"ledger_tx_id"`       // transaction_id of the corresponding LedgerRecord
	VipDiscountRate  int       `gorm:"not null;default:10000"        json:"vip_discount_rate"`  // basis points applied to commission; 10000 = no VIP discount
	CreatedAt        time.Time `                                     json:"created_at"`
}
