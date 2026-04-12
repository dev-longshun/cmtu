package model

import (
	"fmt"
	"sync"
	"time"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type ChannelDailyUsage struct {
	Id           int    `json:"id" gorm:"primaryKey"`
	ChannelId    int    `json:"channel_id" gorm:"index:idx_cdu_channel_date,priority:1"`
	Date         string `json:"date" gorm:"type:varchar(10);index:idx_cdu_channel_date,priority:2"`
	QuotaUsed    int64  `json:"quota_used" gorm:"default:0;bigint"`
	RequestCount int    `json:"request_count" gorm:"default:0"`
	TokenUsed    int64  `json:"token_used" gorm:"default:0;bigint"`
	UpdatedAt    int64  `json:"updated_at" gorm:"bigint"`
}

var cacheChannelDailyUsage = make(map[string]*ChannelDailyUsage)
var cacheChannelDailyUsageLock sync.Mutex

func LogChannelDailyUsage(channelId int, quota int, tokenUsed int) {
	if channelId == 0 {
		return
	}
	date := time.Now().Format("2006-01-02")
	key := fmt.Sprintf("%d-%s", channelId, date)

	cacheChannelDailyUsageLock.Lock()
	defer cacheChannelDailyUsageLock.Unlock()

	if entry, ok := cacheChannelDailyUsage[key]; ok {
		entry.QuotaUsed += int64(quota)
		entry.RequestCount++
		entry.TokenUsed += int64(tokenUsed)
	} else {
		cacheChannelDailyUsage[key] = &ChannelDailyUsage{
			ChannelId:    channelId,
			Date:         date,
			QuotaUsed:    int64(quota),
			RequestCount: 1,
			TokenUsed:    int64(tokenUsed),
		}
	}
}
func SaveChannelDailyUsageCache() {
	cacheChannelDailyUsageLock.Lock()
	defer cacheChannelDailyUsageLock.Unlock()
	size := len(cacheChannelDailyUsage)
	if size == 0 {
		return
	}
	for _, entry := range cacheChannelDailyUsage {
		existing := &ChannelDailyUsage{}
		DB.Where("channel_id = ? AND date = ?", entry.ChannelId, entry.Date).First(existing)
		if existing.Id > 0 {
			DB.Model(&ChannelDailyUsage{}).Where("channel_id = ? AND date = ?", entry.ChannelId, entry.Date).Updates(map[string]interface{}{
				"quota_used":    gorm.Expr("quota_used + ?", entry.QuotaUsed),
				"request_count": gorm.Expr("request_count + ?", entry.RequestCount),
				"token_used":    gorm.Expr("token_used + ?", entry.TokenUsed),
				"updated_at":    common.GetTimestamp(),
			})
		} else {
			entry.UpdatedAt = common.GetTimestamp()
			DB.Create(entry)
		}
	}
	cacheChannelDailyUsage = make(map[string]*ChannelDailyUsage)
	common.SysLog(fmt.Sprintf("保存渠道每日用量数据成功，共保存%d条数据", size))
}

func UpdateChannelDailyUsage() {
	for {
		time.Sleep(time.Duration(common.DataExportInterval) * time.Minute)
		SaveChannelDailyUsageCache()
	}
}

func GetTodayUsageForChannels(channelIds []int) map[int]int64 {
	result := make(map[int]int64)
	if len(channelIds) == 0 {
		return result
	}
	today := time.Now().Format("2006-01-02")
	var usages []ChannelDailyUsage
	DB.Where("channel_id IN ? AND date = ?", channelIds, today).Find(&usages)
	for _, u := range usages {
		result[u.ChannelId] = u.QuotaUsed
	}
	// also add in-memory cache (not yet flushed)
	cacheChannelDailyUsageLock.Lock()
	for _, entry := range cacheChannelDailyUsage {
		if entry.Date == today {
			result[entry.ChannelId] += entry.QuotaUsed
		}
	}
	cacheChannelDailyUsageLock.Unlock()
	return result
}

func GetChannelDailyUsageByDateRange(channelId int, startDate string, endDate string) ([]*ChannelDailyUsage, error) {
	var usages []*ChannelDailyUsage
	err := DB.Where("channel_id = ? AND date >= ? AND date <= ?", channelId, startDate, endDate).
		Order("date desc").Find(&usages).Error
	return usages, err
}

func CleanupOldChannelDailyUsage(retentionDays int) {
	cutoff := time.Now().AddDate(0, 0, -retentionDays).Format("2006-01-02")
	result := DB.Where("date < ?", cutoff).Delete(&ChannelDailyUsage{})
	if result.Error != nil {
		common.SysLog(fmt.Sprintf("清理渠道每日用量数据失败: %s", result.Error))
	} else if result.RowsAffected > 0 {
		common.SysLog(fmt.Sprintf("清理渠道每日用量数据成功，共清理%d条数据", result.RowsAffected))
	}
}
