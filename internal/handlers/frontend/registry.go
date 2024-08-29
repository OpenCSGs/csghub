package frontendHandlers

import "opencsg.com/portal/internal/svc"

type FrontendHandlerRegistry struct {
	SettingsHandler SettingsHandler
	PingHandler     PingHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *FrontendHandlerRegistry {
	settingsHandler := NewSettingsHandler(svcCtx)
	pingHandler := NewPingHandler()

	return &FrontendHandlerRegistry{
		SettingsHandler: settingsHandler,
		PingHandler:     pingHandler,
	}
}
