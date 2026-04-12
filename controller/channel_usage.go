package controller

import (
	"net/http"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetChannelsTodayUsage(c *gin.Context) {
	channels, err := model.GetAllChannels(0, 0, false, false)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	ids := make([]int, 0, len(channels))
	for _, ch := range channels {
		ids = append(ids, ch.Id)
	}
	todayUsage := model.GetTodayUsageForChannels(ids)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    todayUsage,
	})
}

func GetChannelDailyUsage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": "无效的渠道ID"})
		return
	}
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	if startDate == "" || endDate == "" {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": "请提供 start_date 和 end_date 参数"})
		return
	}
	usages, err := model.GetChannelDailyUsageByDateRange(id, startDate, endDate)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    usages,
	})
}
