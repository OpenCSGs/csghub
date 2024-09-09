package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/utils/jwt"
)

type SettingHandler interface {
	Profile(ctx *gin.Context)
	AccessToken(ctx *gin.Context)
	StarshipAccessToken(ctx *gin.Context)
	SyncAccessToken(ctx *gin.Context)
	SSHKeys(ctx *gin.Context)
}

type SettingHandlerImpl struct {
	svcCtx *svc.ServiceContext
}

func NewSettingHandler(svcCtx *svc.ServiceContext) SettingHandler {
	return &SettingHandlerImpl{
		svcCtx: svcCtx,
	}
}

func (i *SettingHandlerImpl) Profile(ctx *gin.Context) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser == nil {
		ctx.Redirect(http.StatusFound, i.svcCtx.Config.LoginURL)
		return
	}

	renderTemplate(ctx, "settings_profile", nil)
}

func (i *SettingHandlerImpl) AccessToken(ctx *gin.Context) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser == nil {
		ctx.Redirect(http.StatusFound, i.svcCtx.Config.LoginURL)
		return
	}
	renderTemplate(ctx, "settings_access_token", nil)
}

func (i *SettingHandlerImpl) StarshipAccessToken(ctx *gin.Context) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser == nil {
		ctx.Redirect(http.StatusFound, i.svcCtx.Config.LoginURL)
		return
	}
	renderTemplate(ctx, "settings_starship_access_token", nil)
}

func (i *SettingHandlerImpl) SyncAccessToken(ctx *gin.Context) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser == nil {
		ctx.Redirect(http.StatusFound, i.svcCtx.Config.LoginURL)
		return
	}
	renderTemplate(ctx, "settings_sync_access_token", nil)
}

func (i *SettingHandlerImpl) SSHKeys(ctx *gin.Context) {
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser == nil {
		ctx.Redirect(http.StatusFound, i.svcCtx.Config.LoginURL)
		return
	}
	renderTemplate(ctx, "settings_ssh_keys", nil)
}
