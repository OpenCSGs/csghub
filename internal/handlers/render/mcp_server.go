package renderHandlers

type McpServerHandler interface {
	BaseHandler
}

type McpServerHandlerImpl struct {
	BaseHandlerImpl
}

func NewMcpServerHandler() McpServerHandler {
	return &McpServerHandlerImpl{
		BaseHandlerImpl{
			resourceType: "mcp_servers",
		},
	}
}
