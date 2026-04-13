package model

import (
	"errors"
	"sort"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"gorm.io/gorm"
)

// Checkin 签到记录
type Checkin struct {
	Id              int    `json:"id" gorm:"primaryKey;autoIncrement"`
	UserId          int    `json:"user_id" gorm:"not null;uniqueIndex:idx_user_checkin_date"`
	CheckinDate     string `json:"checkin_date" gorm:"type:varchar(10);not null;uniqueIndex:idx_user_checkin_date"`
	QuotaAwarded    int    `json:"quota_awarded" gorm:"not null"`
	ConsecutiveDays int    `json:"consecutive_days" gorm:"default:0"`
	BonusAwarded    int    `json:"bonus_awarded" gorm:"default:0"`
	CreatedAt       int64  `json:"created_at" gorm:"bigint"`
}

// CheckinRecord 用于API返回的签到记录
type CheckinRecord struct {
	CheckinDate     string `json:"checkin_date"`
	QuotaAwarded    int    `json:"quota_awarded"`
	ConsecutiveDays int    `json:"consecutive_days"`
	BonusAwarded    int    `json:"bonus_awarded"`
}

func (Checkin) TableName() string {
	return "checkins"
}

// GetUserCheckinRecords 获取用户在指定日期范围内的签到记录
func GetUserCheckinRecords(userId int, startDate, endDate string) ([]Checkin, error) {
	var records []Checkin
	err := DB.Where("user_id = ? AND checkin_date >= ? AND checkin_date <= ?",
		userId, startDate, endDate).
		Order("checkin_date DESC").
		Find(&records).Error
	return records, err
}

// HasCheckedInToday 检查用户今天是否已签到
func HasCheckedInToday(userId int) (bool, error) {
	today := time.Now().Format("2006-01-02")
	var count int64
	err := DB.Model(&Checkin{}).
		Where("user_id = ? AND checkin_date = ?", userId, today).
		Count(&count).Error
	return count > 0, err
}

// GetConsecutiveDays 计算用户截至昨天的连续签到天数
func GetConsecutiveDays(userId int) int {
	consecutive := 0
	now := time.Now()
	for i := 1; i <= 365; i++ {
		date := now.AddDate(0, 0, -i).Format("2006-01-02")
		var count int64
		DB.Model(&Checkin{}).Where("user_id = ? AND checkin_date = ?", userId, date).Count(&count)
		if count == 0 {
			break
		}
		consecutive++
	}
	return consecutive
}

// UserCheckin 执行用户签到
func UserCheckin(userId int) (*Checkin, error) {
	setting := operation_setting.GetCheckinSetting()
	if !setting.Enabled {
		return nil, errors.New("签到功能未启用")
	}

	hasChecked, err := HasCheckedInToday(userId)
	if err != nil {
		return nil, err
	}
	if hasChecked {
		return nil, errors.New("今日已签到")
	}

	// 计算连续天数（含今天）
	consecutiveDays := GetConsecutiveDays(userId) + 1

	// 计算奖励：检查是否命中里程碑
	quotaAwarded := setting.DailyQuota
	bonusAwarded := 0

	// 按天数排序里程碑，精确匹配
	bonuses := make([]operation_setting.StreakBonus, len(setting.StreakBonuses))
	copy(bonuses, setting.StreakBonuses)
	sort.Slice(bonuses, func(i, j int) bool { return bonuses[i].Days < bonuses[j].Days })

	for _, b := range bonuses {
		if consecutiveDays == b.Days {
			// 里程碑当天：总奖励替换为里程碑额度
			bonusAwarded = b.Quota - setting.DailyQuota
			if bonusAwarded < 0 {
				bonusAwarded = 0
			}
			quotaAwarded = setting.DailyQuota + bonusAwarded
			break
		}
	}

	today := time.Now().Format("2006-01-02")
	checkin := &Checkin{
		UserId:          userId,
		CheckinDate:     today,
		QuotaAwarded:    quotaAwarded,
		ConsecutiveDays: consecutiveDays,
		BonusAwarded:    bonusAwarded,
		CreatedAt:       time.Now().Unix(),
	}

	if common.UsingSQLite {
		return userCheckinWithoutTransaction(checkin, userId, quotaAwarded)
	}
	return userCheckinWithTransaction(checkin, userId, quotaAwarded)
}

// userCheckinWithTransaction 使用事务执行签到（MySQL/PostgreSQL）
func userCheckinWithTransaction(checkin *Checkin, userId int, quotaAwarded int) (*Checkin, error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(checkin).Error; err != nil {
			return errors.New("签到失败，请稍后重试")
		}
		if err := tx.Model(&User{}).Where("id = ?", userId).
			Update("quota", gorm.Expr("quota + ?", quotaAwarded)).Error; err != nil {
			return errors.New("签到失败：更新额度出错")
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	go func() {
		_ = cacheIncrUserQuota(userId, int64(quotaAwarded))
	}()
	return checkin, nil
}

// userCheckinWithoutTransaction 不使用事务执行签到（SQLite）
func userCheckinWithoutTransaction(checkin *Checkin, userId int, quotaAwarded int) (*Checkin, error) {
	if err := DB.Create(checkin).Error; err != nil {
		return nil, errors.New("签到失败，请稍后重试")
	}
	if err := IncreaseUserQuota(userId, quotaAwarded, true); err != nil {
		DB.Delete(checkin)
		return nil, errors.New("签到失败：更新额度出错")
	}
	return checkin, nil
}

// GetUserCheckinStats 获取用户签到统计信息
func GetUserCheckinStats(userId int, month string) (map[string]interface{}, error) {
	startDate := month + "-01"
	endDate := month + "-31"

	records, err := GetUserCheckinRecords(userId, startDate, endDate)
	if err != nil {
		return nil, err
	}

	checkinRecords := make([]CheckinRecord, len(records))
	for i, r := range records {
		checkinRecords[i] = CheckinRecord{
			CheckinDate:     r.CheckinDate,
			QuotaAwarded:    r.QuotaAwarded,
			ConsecutiveDays: r.ConsecutiveDays,
			BonusAwarded:    r.BonusAwarded,
		}
	}

	hasCheckedToday, _ := HasCheckedInToday(userId)
	consecutiveDays := GetConsecutiveDays(userId)
	if hasCheckedToday {
		// 今天已签到，连续天数含今天
		consecutiveDays++
	}

	var totalCheckins int64
	var totalQuota int64
	DB.Model(&Checkin{}).Where("user_id = ?", userId).Count(&totalCheckins)
	DB.Model(&Checkin{}).Where("user_id = ?", userId).Select("COALESCE(SUM(quota_awarded), 0)").Scan(&totalQuota)

	return map[string]interface{}{
		"total_quota":      totalQuota,
		"total_checkins":   totalCheckins,
		"checkin_count":    len(records),
		"checked_in_today": hasCheckedToday,
		"consecutive_days": consecutiveDays,
		"records":          checkinRecords,
	}, nil
}
