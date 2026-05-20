package services

import "errors"

var (
	ErrConcurrentConflict  = errors.New("concurrent update conflict")
	ErrInsufficientBalance = errors.New("insufficient balance")
	ErrWalletNotFound      = errors.New("wallet not found")
	ErrVipPlanNotFound     = errors.New("vip plan not found or inactive")
	ErrIdolNotFound        = errors.New("idol not found")
	ErrIdolBanned          = errors.New("idol is currently banned")
)
