package renderHandlers

import (
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/types"
	"opencsg.com/portal/pkg/utils/jwt"
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

func getConfig(ctx *gin.Context) types.GlobalConfig {
	return ctx.MustGet("Config").(types.GlobalConfig)
}

func getCurrentUserInfo(ctx *gin.Context) (models.User, bool) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser != nil {
		return *currentUser, true
	}
	return models.User{}, false
}
