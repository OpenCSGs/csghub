package renderHandlers

import "opencsg.com/portal/internal/svc"

type RenderHandlerRegistry struct {
	ErrorHandler        ErrorHandler
	ModelHandler        ModelHandler
	DatasetHandler      DatasetHandler
	CodeHandler         CodeHandler
	SpaceHandler        SpaceHandler
	EndpointHandler     EndpointHandler
	FinetuneHandler     FinetuneHandler
	SessionHandler      SessionHandler
	OrganizationHandler OrganizationHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *RenderHandlerRegistry {
	errorHandler := NewErrorHandler()
	modelHandler := NewModelHandler()
	datasetHandler := NewDatasetHandler()
	codeHandler := NewCodeHandler()
	spaceHandler := NewSpaceHandler()
	endpointHandler := NewEndpointHandler()
	finetuneHandler := NewFinetuneHandler()
	sessionHandler := NewSessionHandler(svcCtx.Config)
	organizationHandler := NewOrganizationHandler()

	return &RenderHandlerRegistry{
		ErrorHandler:        errorHandler,
		ModelHandler:        modelHandler,
		DatasetHandler:      datasetHandler,
		CodeHandler:         codeHandler,
		SpaceHandler:        spaceHandler,
		EndpointHandler:     endpointHandler,
		FinetuneHandler:     finetuneHandler,
		SessionHandler:      sessionHandler,
		OrganizationHandler: organizationHandler,
	}
}
