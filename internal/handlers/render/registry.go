package renderHandlers

import (
	"fmt"

	"opencsg.com/portal/internal/svc"
)

type RenderHandlerRegistry struct {
	ErrorHandler           ErrorHandler
	ModelHandler           ModelHandler
	DatasetHandler         DatasetHandler
	CodeHandler            CodeHandler
	SpaceHandler           SpaceHandler
	EndpointHandler        EndpointHandler
	FinetuneHandler        FinetuneHandler
	SessionHandler         SessionHandler
	OrganizationHandler    OrganizationHandler
	CollectionsHandler     CollectionsHandler
	ProfileHandler         ProfileHandler
	SettingHandler         SettingHandler
	ResourceConsoleHandler ResourceConsoleHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) (*RenderHandlerRegistry, error) {
	errorHandler := NewErrorHandler()
	modelHandler := NewModelHandler()
	datasetHandler := NewDatasetHandler()
	codeHandler := NewCodeHandler()
	spaceHandler := NewSpaceHandler()
	endpointHandler := NewEndpointHandler()
	finetuneHandler := NewFinetuneHandler()
	resourceConsoleHandler := NewResourceConsoleHandler()
	sessionHandler, err := NewSessionHandler(svcCtx.Config)
	if err != nil {
		return nil, fmt.Errorf("failed to create session handler: %w", err)
	}
	organizationHandler := NewOrganizationHandler()
	collectionsHandler := NewCollectionsHandler()
	profileHandler := NewProfileHandler(svcCtx)
	settingHandler := NewSettingHandler(svcCtx)

	return &RenderHandlerRegistry{
		ErrorHandler:           errorHandler,
		ModelHandler:           modelHandler,
		DatasetHandler:         datasetHandler,
		CodeHandler:            codeHandler,
		SpaceHandler:           spaceHandler,
		EndpointHandler:        endpointHandler,
		FinetuneHandler:        finetuneHandler,
		SessionHandler:         sessionHandler,
		OrganizationHandler:    organizationHandler,
		CollectionsHandler:     collectionsHandler,
		ProfileHandler:         profileHandler,
		SettingHandler:         settingHandler,
		ResourceConsoleHandler: resourceConsoleHandler,
	}, nil
}
