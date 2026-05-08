package services

import "errors"

var (
	ErrConcurrentConflict  = errors.New("concurrent update conflict")
	ErrInsufficientBalance = errors.New("insufficient balance")
	ErrWalletNotFound      = errors.New("wallet not found")
)
