package renderHandlers

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/middleware"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/constants"
)

// 辅助函数：创建模板数据
func CreateTemplateData(ctx *gin.Context, extraData map[string]interface{}) gin.H {
	config := getConfig(ctx)
	currentUser, isLoggedIn := getCurrentUserInfo(ctx)

	data := gin.H{
		"csghubServer": config.ServerBaseUrl,
		"onPremise":    config.OnPremise,
		"enableHttps":  config.EnableHttps,
		"currentUser":  currentUser,
		"isLoggedIn":   isLoggedIn,
	}

	for k, v := range extraData {
		data[k] = v
	}

	return data
}

func getConfig(ctx *gin.Context) constants.GlobalConfig {
	return ctx.MustGet("Config").(constants.GlobalConfig)
}

func getCurrentUserInfo(ctx *gin.Context) (models.User, bool) {
	currentUser := middleware.GetCurrentUser(ctx)
	if currentUser != nil {
		return *currentUser, true
	}
	return models.User{}, false
}
