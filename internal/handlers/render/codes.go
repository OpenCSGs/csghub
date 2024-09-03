package renderHandlers

type CodeHandler interface {
	BaseHandler
}

type CodeHandlerImpl struct {
	BaseHandlerImpl
}

func NewCodeHandler() CodeHandler {
	return &CodeHandlerImpl{
		BaseHandlerImpl{
			resourceType: "codes",
		},
	}
}
