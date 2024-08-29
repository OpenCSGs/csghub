package renderHandlers

import "opencsg.com/portal/internal/svc"

type RenderHandlerRegistry struct {
	ModelHandler   ModelHandler
	DatasetHandler DatasetHandler
	CodeHandler    CodeHandler
	SpaceHandler   SpaceHandler
}

func NewHandlersRegistry(svcCtx *svc.ServiceContext) *RenderHandlerRegistry {
	modelHandler := NewModelHandler()
	datasetHandler := NewDatasetHandler()
	codeHandler := NewCodeHandler()
	spaceHandler := NewSpaceHandler()

	return &RenderHandlerRegistry{
		ModelHandler:   modelHandler,
		DatasetHandler: datasetHandler,
		CodeHandler:    codeHandler,
		SpaceHandler:   spaceHandler,
	}
}
