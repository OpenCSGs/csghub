package renderHandlers

import "opencsg.com/portal/pkg/utils/jwt"

type SkillHandler interface {
	BaseHandler
}

type SkillHandlerImpl struct {
	BaseHandlerImpl
}

func NewSkillHandler() SkillHandler {
	return &SkillHandlerImpl{
		BaseHandlerImpl{
			resourceType:  "skills",
			isSmallFooter: true,
			jwtUtils:      jwt.NewJwtUtils(),
		},
	}
}
