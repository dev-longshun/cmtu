package model

import (
	"time"

	"github.com/QuantumNous/new-api/common"
)

func StartChannelDataCleanupTask() {
	if !common.IsMasterNode {
		return
	}
	go func() {
		for {
			time.Sleep(1 * time.Hour)
			CleanupOldChannelDailyUsage(30)
		}
	}()
}
