package renderHandlers

import "opencsg.com/portal/internal/svc"

type RenderHandlerRegistry struct {
	ModelHandler        ModelHandler
	DatasetHandler      DatasetHandler
	CodeHandler         CodeHandler
	SpaceHandler        SpaceHandler
	SessionHandler      SessionHandler
	OrganizationHandler OrganizationHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *RenderHandlerRegistry {
	modelHandler := NewModelHandler()
	datasetHandler := NewDatasetHandler()
	codeHandler := NewCodeHandler()
	spaceHandler := NewSpaceHandler()
	sessionHandler := NewSessionHandler(svcCtx.Config)
	organizationHandler := NewOrganizationHandler()

	return &RenderHandlerRegistry{
		ModelHandler:        modelHandler,
		DatasetHandler:      datasetHandler,
		CodeHandler:         codeHandler,
		SpaceHandler:        spaceHandler,
		SessionHandler:      sessionHandler,
		OrganizationHandler: organizationHandler,
	}
}
