package utils

import "testing"

func TestApplyDiscount(t *testing.T) {
	tests := []struct {
		name          string
		originalPrice int64
		discountRate  int
		want          int64
	}{
		// Core business cases
		{
			name:          "100 yuan with 10% off = 90 yuan",
			originalPrice: 10000, // 100.00 yuan in cents
			discountRate:  9000,  // 10% off
			want:          9000,  // 90.00 yuan in cents
		},
		{
			name:          "99 yuan with 10% off rounds up to 8910 cents",
			originalPrice: 9900, // 99.00 yuan in cents
			discountRate:  9000, // 10% off → exact = 8910.0 cents
			want:          8910, // no rounding needed; exact result
		},
		{
			// 1 cent * 9000 / 10000 = 0.9 cents → ceiling = 1 cent
			name:          "fractional cent rounds up (ceiling)",
			originalPrice: 1,
			discountRate:  9000,
			want:          1,
		},

		// Boundary: discountRate = 10000 (no discount)
		{
			name:          "discountRate 10000 returns original price",
			originalPrice: 10000,
			discountRate:  10000,
			want:          10000,
		},
		// Boundary: discountRate = 0 (guard, no discount applied)
		{
			name:          "discountRate 0 returns original price",
			originalPrice: 10000,
			discountRate:  0,
			want:          10000,
		},
		// Out-of-range: negative
		{
			name:          "negative discountRate returns original price",
			originalPrice: 10000,
			discountRate:  -1,
			want:          10000,
		},
		// Out-of-range: above 10000
		{
			name:          "discountRate above 10000 returns original price",
			originalPrice: 10000,
			discountRate:  10001,
			want:          10000,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ApplyDiscount(tt.originalPrice, tt.discountRate)
			if got != tt.want {
				t.Errorf("ApplyDiscount(%d, %d) = %d, want %d",
					tt.originalPrice, tt.discountRate, got, tt.want)
			}
		})
	}
}
