package renderHandlers

type EndpointHandler interface {
	BaseHandler
}

type EndpointHandlerImpl struct {
	BaseHandlerImpl
}

func NewEndpointHandler() EndpointHandler {
	return &EndpointHandlerImpl{
		BaseHandlerImpl{
			resourceType: "endpoints",
		},
	}
}
