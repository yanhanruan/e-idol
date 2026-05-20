// Package jobs contains background scheduled tasks for the application.
//
// # Dual-protection VIP expiration strategy
//
// This package and VipService.GetUserVipStatus work together to keep VIP levels
// accurate at all times through two complementary mechanisms:
//
//  1. Lazy check (VipService.GetUserVipStatus): executed on every VIP permission
//     validation request. It detects expiry in real time and resets the level
//     immediately, so an active user is never seen as VIP after their subscription
//     lapses — even if the scheduled job has not yet run.
//
//  2. Scheduled batch job (ExpireVipJob, this file): runs at 03:00 AM daily and
//     issues a single bulk UPDATE to clear all remaining stale levels. This
//     proactively cleans up inactive users who have not made any request since
//     their expiry, preventing stale data from accumulating indefinitely in the
//     database.
//
// Both mechanisms are necessary:
//   - The lazy check alone would leave inactive users with stale level values.
//   - The scheduled job alone would leave a window of up to ~24 hours during which
//     an active user could still appear as VIP after expiry.
package jobs

import (
	"log"
	"time"

	"e-idol-backend/internal/models"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

// VipExpireJob performs the nightly batch expiration of lapsed VIP accounts.
type VipExpireJob struct {
	db *gorm.DB
}

func NewVipExpireJob(db *gorm.DB) *VipExpireJob {
	return &VipExpireJob{db: db}
}

// Run issues a single bulk UPDATE to reset every expired VIP account to level 0.
func (j *VipExpireJob) Run() {
	result := j.db.Model(&models.UserVip{}).
		Where("expire_at < ? AND level > 0", time.Now()).
		Update("level", 0)

	if result.Error != nil {
		log.Printf("[vip_expire_job] batch expiry failed: %v", result.Error)
		return
	}

	log.Printf("[vip_expire_job] downgraded %d expired VIP account(s)", result.RowsAffected)
}

// StartVipExpireScheduler registers the nightly VIP expiration job and starts
// the cron scheduler. The scheduler runs its jobs in a dedicated goroutine
// managed by the cron library; callers do not need to wrap this call in go.
//
// The returned *cron.Cron can be stopped gracefully on shutdown.
func StartVipExpireScheduler(db *gorm.DB) *cron.Cron {
	c := cron.New()
	c.AddFunc("0 3 * * *", NewVipExpireJob(db).Run) // daily at 03:00 AM
	c.Start()
	return c
}
