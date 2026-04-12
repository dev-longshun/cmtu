package common

import (
	_ "embed"
	"encoding/base64"
	"fmt"
	"strings"
)

//go:embed email_logo.png
var emailLogoPNG []byte

// getLogoDataURI 返回内嵌的 Logo base64 data URI
func getLogoDataURI() string {
	if len(emailLogoPNG) == 0 {
		return ""
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(emailLogoPNG)
}

// BuildEmailHTML 构建统一风格的 HTML 邮件，顶部 Logo + 内容区
func BuildEmailHTML(logoURL string, bodyHTML string) string {
	// 优先使用内嵌 Logo，避免外部 URL 被邮箱客户端拦截
	actualLogo := getLogoDataURI()
	if actualLogo == "" || strings.Contains(actualLogo, "data:image") == false {
		actualLogo = logoURL // fallback 到传入的 URL
	}

	logoBlock := ""
	if actualLogo != "" {
		logoBlock = fmt.Sprintf(`<tr><td align="center" style="padding:32px 0 16px 0;">
          <img src="%s" alt="%s" width="64" height="64" style="border-radius:50%%;display:block;" />
        </td></tr>`, actualLogo, SystemName)
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%%%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        %s
        <!-- Site Name -->
        <tr><td align="center" style="padding:0 0 24px 0;font-size:20px;font-weight:600;color:#333;">
          %s
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:0 36px 32px 36px;font-size:15px;line-height:1.6;color:#555;">
          %s
        </td></tr>
        <!-- Footer -->
        <tr><td align="center" style="padding:16px 36px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
          %s
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, logoBlock, SystemName, bodyHTML, SystemName)
}
