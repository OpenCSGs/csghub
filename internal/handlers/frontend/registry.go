package frontendHandlers

import "opencsg.com/portal/internal/svc"

type FrontendHandlerRegistry struct {
	SettingsHandler SettingsHandler
	PingHandler     PingHandler
	TokenHandler    TokenHandler
	UploadHandler   UploadHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) (*FrontendHandlerRegistry, error) {
	settingsHandler := NewSettingsHandler(svcCtx)
	pingHandler := NewPingHandler()
	tokenHandler, err := NewTokenHandler(svcCtx.Config)
	if err != nil {
		return nil, err
	}
	uploadHandler, err := NewUploadHandler(svcCtx.Config)
	if err != nil {
		return nil, err
	}

	return &FrontendHandlerRegistry{
		SettingsHandler: settingsHandler,
		PingHandler:     pingHandler,
		TokenHandler:    tokenHandler,
		UploadHandler:   uploadHandler,
	}, nil
}
