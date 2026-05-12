package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

// VerifyHMAC reports whether sign equals the HMAC-SHA256 of payload under secret.
// Uses hmac.Equal for constant-time comparison to prevent timing attacks.
func VerifyHMAC(payload []byte, sign string, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(sign))
}
