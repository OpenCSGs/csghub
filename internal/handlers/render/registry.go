package renderHandlers

import "opencsg.com/portal/internal/svc"

type RenderHandlerRegistry struct {
	ModelHandler        ModelHandler
	DatasetHandler      DatasetHandler
	CodeHandler         CodeHandler
	SpaceHandler        SpaceHandler
	EndpointHandler     EndpointHandler
	FinetuneHandler     FinetuneHandler
	SessionHandler      SessionHandler
	OrganizationHandler OrganizationHandler
	CollectionsHandler  CollectionsHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *RenderHandlerRegistry {
	modelHandler := NewModelHandler()
	datasetHandler := NewDatasetHandler()
	codeHandler := NewCodeHandler()
	spaceHandler := NewSpaceHandler()
	endpointHandler := NewEndpointHandler()
	finetuneHandler := NewFinetuneHandler()
	sessionHandler := NewSessionHandler(svcCtx.Config)
	organizationHandler := NewOrganizationHandler()
	collectionsHandler := NewCollectionsHandler()

	return &RenderHandlerRegistry{
		ModelHandler:        modelHandler,
		DatasetHandler:      datasetHandler,
		CodeHandler:         codeHandler,
		SpaceHandler:        spaceHandler,
		EndpointHandler:     endpointHandler,
		FinetuneHandler:     finetuneHandler,
		SessionHandler:      sessionHandler,
		OrganizationHandler: organizationHandler,
		CollectionsHandler:  collectionsHandler,
	}
}
