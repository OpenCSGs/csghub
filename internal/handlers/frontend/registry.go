package frontendHandlers

import "opencsg.com/portal/internal/svc"

type FrontendHandlerRegistry struct {
	SettingsHandler SettingsHandler
	PingHandler     PingHandler
	TokenHandler    TokenHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *FrontendHandlerRegistry {
	settingsHandler := NewSettingsHandler(svcCtx)
	pingHandler := NewPingHandler()
	tokenHandler := NewTokenHandler()

	return &FrontendHandlerRegistry{
		SettingsHandler: settingsHandler,
		PingHandler:     pingHandler,
		TokenHandler:    tokenHandler,
	}
}
