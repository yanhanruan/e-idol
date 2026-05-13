package utils

// ApplyDiscount calculates the price after a VIP discount.
//
//   - originalPrice: original price in cents.
//   - discountRate:  basis points (0–10000). 9000 = 10% off, 10000 = full price.
//
// Returns the discounted price in cents, rounded up (ceiling) so that fractional
// cents never cause merchant loss.
//
// All arithmetic uses int64. Floating-point operations are strictly forbidden
// here because IEEE 754 cannot represent many decimal fractions exactly, and
// those rounding errors compound across transactions in financial systems.
//
// Ceiling formula: (originalPrice * discountRate + 9999) / 10000
//
// If discountRate <= 0 or >= 10000, originalPrice is returned unchanged.
func ApplyDiscount(originalPrice int64, discountRate int) int64 {
	if discountRate <= 0 || discountRate >= 10000 {
		return originalPrice
	}
	return (originalPrice*int64(discountRate) + 9999) / 10000
}
