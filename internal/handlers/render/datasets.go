package renderHandlers

type DatasetHandler interface {
	BaseHandler
}

type DatasetHandlerImpl struct {
	BaseHandlerImpl
}

func NewDatasetHandler() DatasetHandler {
	return &DatasetHandlerImpl{
		BaseHandlerImpl{
			resourceType: "datasets",
			showTemplate: "datasets_show",
		},
	}
}
