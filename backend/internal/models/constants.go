package models

// TransactionType 交易类型
type TransactionType string

const (
	TxTypeRecharge   TransactionType = "recharge"   // 充值
	TxTypeConsume    TransactionType = "consume"    // 消费
	TxTypeRefund     TransactionType = "refund"     // 退款
	TxTypeTip        TransactionType = "tip"        // 打赏
	TxTypeTipIncome  TransactionType = "tip_income" // 打赏收入
	TxTypeCommission TransactionType = "commission" // 佣金/手续费
	TxTypeWithdraw   TransactionType = "withdraw"   // 提现
)

// TransactionStatus 交易状态
type TransactionStatus string

const (
	TxStatusPending  TransactionStatus = "pending"  // 处理中
	TxStatusSuccess  TransactionStatus = "success"  // 成功
	TxStatusFailed   TransactionStatus = "failed"   // 失败
	TxStatusReversed TransactionStatus = "reversed" // 已冲正/撤销
)
