package smtp_setting

import (
	"sync/atomic"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting/config"
)

type SMTPAccount struct {
	Server     string `json:"server"`
	Port       int    `json:"port"`
	Account    string `json:"account"`
	From       string `json:"from"`
	Token      string `json:"token"`
	SSLEnabled bool   `json:"ssl_enabled"`
}

type SMTPSetting struct {
	Accounts []SMTPAccount `json:"accounts"`
}

var smtpSetting = SMTPSetting{
	Accounts: []SMTPAccount{},
}

var counter uint64

func init() {
	config.GlobalConfig.Register("smtp_setting", &smtpSetting)

	// 注册轮选 provider 到 common 包（避免循环依赖）
	common.SMTPAccountProvider = func() *common.SMTPAccountInfo {
		acct := GetNextAccount()
		if acct == nil {
			return nil
		}
		return &common.SMTPAccountInfo{
			Server:     acct.Server,
			Port:       acct.Port,
			Account:    acct.Account,
			From:       acct.From,
			Token:      acct.Token,
			SSLEnabled: acct.SSLEnabled,
		}
	}
}

func GetSMTPSetting() *SMTPSetting {
	return &smtpSetting
}

// GetNextAccount 轮选下一个 SMTP 账号，返回 nil 表示无可用账号
func GetNextAccount() *SMTPAccount {
	accounts := smtpSetting.Accounts
	n := len(accounts)
	if n == 0 {
		return nil
	}
	idx := atomic.AddUint64(&counter, 1) - 1
	acct := accounts[idx%uint64(n)]
	return &acct
}
