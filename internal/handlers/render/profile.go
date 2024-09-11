package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/internal/svc"
)

type ProfileHandler interface {
	Detail(ctx *gin.Context)
	Likes(ctx *gin.Context)
}

type ProfileHandlerImpl struct {
	svcCtx    *svc.ServiceContext
	userModel *models.UserStore
}

func NewProfileHandler(svcCtx *svc.ServiceContext) ProfileHandler {
	return &ProfileHandlerImpl{
		svcCtx:    svcCtx,
		userModel: models.NewUserStore(),
	}
}

func (i *ProfileHandlerImpl) Detail(ctx *gin.Context) {
	user_id := ctx.Param("user_id")
	user, err := i.userModel.FindyByName(ctx.Request.Context(), user_id)

	if user.ID == 0 || err != nil {
		ctx.Redirect(http.StatusFound, "/errors/not-found")
		return
	}

	data := map[string]interface{}{
		"initiator": "profile",
		"user":      user,
	}
	renderTemplate(ctx, "profile", data)
}

func (i *ProfileHandlerImpl) Likes(ctx *gin.Context) {
	user_id := ctx.Param("user_id")
	user, err := i.userModel.FindyByName(ctx.Request.Context(), user_id)

	if user.ID == 0 || err != nil {
		ctx.Redirect(http.StatusFound, "/errors/not-found")
		return
	}

	data := map[string]interface{}{
		"initiator": "likes",
		"user":      user,
	}
	renderTemplate(ctx, "profile_likes", data)
}
