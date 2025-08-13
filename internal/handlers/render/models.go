package renderHandlers

type ModelHandler interface {
	BaseHandler
}

type ModelHandlerImpl struct {
	BaseHandlerImpl
}

func NewModelHandler() ModelHandler {
	return &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType: "models",
		},
	}
}
