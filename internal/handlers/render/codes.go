package renderHandlers

type CodeHandler interface {
	BaseHandler
}

type CodeHandlerImpl struct {
	BaseHandlerImpl
}

func NewCodeHandler() ModelHandler {
	return &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType: "codes",
		},
	}
}
