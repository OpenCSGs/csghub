package frontendHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/types/enum"
)

type SettingsHandler interface {
	SetZhLocale(ctx *gin.Context)
	SetEnLocale(ctx *gin.Context)
}

type SettingsHandlerImpl struct {
	svcCtx *svc.ServiceContext
}

func NewSettingsHandler(svcCtx *svc.ServiceContext) SettingsHandler {
	return &SettingsHandlerImpl{
		svcCtx: svcCtx,
	}
}

func (i *SettingsHandlerImpl) SetZhLocale(ctx *gin.Context) {
	setLocaleCookie(ctx, "zh")
	ctx.Redirect(http.StatusFound, ctx.Request.Referer())
}

func (i *SettingsHandlerImpl) SetEnLocale(ctx *gin.Context) {
	setLocaleCookie(ctx, "en")
	ctx.Redirect(http.StatusFound, ctx.Request.Referer())
}

func setLocaleCookie(ctx *gin.Context, locale string) {
	ctx.SetCookie(enum.LocaleCookieKey, locale, 3600*24*30, "/", "", false, false)
	ctx.Set(enum.LocaleCookieKey, locale)
}
