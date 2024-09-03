package renderHandlers

type SpaceHandler interface {
	BaseHandler
}

type SpaceHandlerImpl struct {
	BaseHandlerImpl
}

func NewSpaceHandler() SpaceHandler {
	return &SpaceHandlerImpl{
		BaseHandlerImpl{
			resourceType: "spaces",
		},
	}
}
