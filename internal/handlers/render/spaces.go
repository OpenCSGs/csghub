package renderHandlers

type SpaceHandler interface {
	BaseHandler
}

type SpaceHandlerImpl struct {
	BaseHandlerImpl
}

func NewSpaceHandler() ModelHandler {
	return &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType: "spaces",
		},
	}
}
