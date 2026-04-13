package operation_setting

import "github.com/QuantumNous/new-api/setting/config"

// StreakBonus 连续签到里程碑奖励
type StreakBonus struct {
	Days  int `json:"days"`  // 连续天数（如 7、14）
	Quota int `json:"quota"` // 当天总奖励（替换基础奖励，quota 内部单位）
}

// CheckinSetting 签到功能配置
type CheckinSetting struct {
	Enabled       bool          `json:"enabled"`        // 是否启用签到功能
	MinQuota      int           `json:"min_quota"`      // 保留旧字段兼容
	MaxQuota      int           `json:"max_quota"`      // 保留旧字段兼容
	DailyQuota    int           `json:"daily_quota"`    // 每日固定奖励（quota 内部单位）
	StreakBonuses []StreakBonus  `json:"streak_bonuses"` // 连续签到里程碑配置
}

// 默认配置
var checkinSetting = CheckinSetting{
	Enabled:    false,
	MinQuota:   1000,
	MaxQuota:   10000,
	DailyQuota: 500000, // 100🍓 = 500000 quota（1🍓 = 5000 quota）
	StreakBonuses: []StreakBonus{
		{Days: 7, Quota: 2500000},   // 第7天总共500🍓
		{Days: 14, Quota: 5000000},  // 第14天总共1000🍓
	},
}

func init() {
	config.GlobalConfig.Register("checkin_setting", &checkinSetting)
}

func GetCheckinSetting() *CheckinSetting {
	return &checkinSetting
}

func IsCheckinEnabled() bool {
	return checkinSetting.Enabled
}

// GetCheckinQuotaRange 保留兼容
func GetCheckinQuotaRange() (min, max int) {
	return checkinSetting.MinQuota, checkinSetting.MaxQuota
}
