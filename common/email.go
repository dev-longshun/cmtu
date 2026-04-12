package common

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"slices"
	"strings"
	"time"
)

// SMTPAccountInfo 用于传递 SMTP 账号参数，避免循环依赖
type SMTPAccountInfo struct {
	Server     string
	Port       int
	Account    string
	From       string
	Token      string
	SSLEnabled bool
}

// SMTPAccountProvider 由 smtp_setting 包注册，返回下一个轮选账号
var SMTPAccountProvider func() *SMTPAccountInfo

func generateMessageIDWithFrom(from string) (string, error) {
	split := strings.Split(from, "@")
	if len(split) < 2 {
		return "", fmt.Errorf("invalid SMTP account")
	}
	domain := split[1]
	return fmt.Sprintf("<%d.%s@%s>", time.Now().UnixNano(), GetRandomString(12), domain), nil
}

func SendEmail(subject string, receiver string, content string) error {
	// 优先使用多账号轮选
	if SMTPAccountProvider != nil {
		if acct := SMTPAccountProvider(); acct != nil {
			return sendEmailWithAccount(subject, receiver, content, acct)
		}
	}
	// 回退到旧的全局变量配置
	if SMTPServer == "" && SMTPAccount == "" {
		return fmt.Errorf("SMTP 服务器未配置")
	}
	return sendEmailWithAccount(subject, receiver, content, &SMTPAccountInfo{
		Server:     SMTPServer,
		Port:       SMTPPort,
		Account:    SMTPAccount,
		From:       SMTPFrom,
		Token:      SMTPToken,
		SSLEnabled: SMTPSSLEnabled,
	})
}

func SendEmailWithAccount(subject string, receiver string, content string, acct *SMTPAccountInfo) error {
	return sendEmailWithAccount(subject, receiver, content, acct)
}

func sendEmailWithAccount(subject string, receiver string, content string, acct *SMTPAccountInfo) error {
	from := acct.From
	if from == "" {
		from = acct.Account
	}
	id, err := generateMessageIDWithFrom(from)
	if err != nil {
		return err
	}
	encodedSubject := fmt.Sprintf("=?UTF-8?B?%s?=", base64.StdEncoding.EncodeToString([]byte(subject)))
	mail := []byte(fmt.Sprintf("To: %s\r\n"+
		"From: %s <%s>\r\n"+
		"Subject: %s\r\n"+
		"Date: %s\r\n"+
		"Message-ID: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n\r\n%s\r\n",
		receiver, SystemName, from, encodedSubject, time.Now().Format(time.RFC1123Z), id, content))
	auth := smtp.PlainAuth("", acct.Account, acct.Token, acct.Server)
	addr := fmt.Sprintf("%s:%d", acct.Server, acct.Port)
	to := strings.Split(receiver, ";")
	if acct.Port == 465 || acct.SSLEnabled {
		tlsConfig := &tls.Config{
			InsecureSkipVerify: true,
			ServerName:         acct.Server,
		}
		conn, err := tls.Dial("tcp", fmt.Sprintf("%s:%d", acct.Server, acct.Port), tlsConfig)
		if err != nil {
			return err
		}
		client, err := smtp.NewClient(conn, acct.Server)
		if err != nil {
			return err
		}
		defer client.Close()
		if err = client.Auth(auth); err != nil {
			return err
		}
		if err = client.Mail(from); err != nil {
			return err
		}
		receiverEmails := strings.Split(receiver, ";")
		for _, r := range receiverEmails {
			if err = client.Rcpt(r); err != nil {
				return err
			}
		}
		w, err := client.Data()
		if err != nil {
			return err
		}
		_, err = w.Write(mail)
		if err != nil {
			return err
		}
		err = w.Close()
		if err != nil {
			return err
		}
	} else if isOutlookServer(acct.Account) || slices.Contains(EmailLoginAuthServerList, acct.Server) {
		auth = LoginAuth(acct.Account, acct.Token)
		err = smtp.SendMail(addr, auth, from, to, mail)
	} else {
		err = smtp.SendMail(addr, auth, from, to, mail)
	}
	if err != nil {
		SysError(fmt.Sprintf("failed to send email to %s: %v", receiver, err))
	}
	return err
}
