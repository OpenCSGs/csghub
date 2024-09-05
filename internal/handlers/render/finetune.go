package renderHandlers

type FinetuneHandler interface {
	BaseHandler
}

type FinetuneHandlerImpl struct {
	BaseHandlerImpl
}

func NewFinetuneHandler() FinetuneHandler {
	return &FinetuneHandlerImpl{
		BaseHandlerImpl{
			resourceType: "finetunes",
		},
	}
}
