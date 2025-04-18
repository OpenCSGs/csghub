package renderHandlers

import "opencsg.com/portal/pkg/utils/jwt"

type McpServerHandler interface {
	BaseHandler
}

type McpServerHandlerImpl struct {
	BaseHandlerImpl
}

func NewMcpServerHandler() McpServerHandler {
	return &McpServerHandlerImpl{
		BaseHandlerImpl{
			resourceType:  "mcp_servers",
			isSmallFooter: true,
			jwtUtils:      jwt.NewJwtUtils(),
		},
	}
}
