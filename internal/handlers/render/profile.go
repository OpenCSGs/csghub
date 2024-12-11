package renderHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/server"
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

	user := i.retrieveUserInfoByUsername(user_id)

	if user == nil {
		ctx.Redirect(http.StatusFound, "/errors/not-found")
		return
	}

	data := map[string]interface{}{
		"initiator": "profile",
		"user":      user,
	}
	RenderBaseInstance.RenderTemplate(ctx, "profile", data)
}

func (i *ProfileHandlerImpl) Likes(ctx *gin.Context) {
	user_id := ctx.Param("user_id")

	user := i.retrieveUserInfoByUsername(user_id)

	data := map[string]interface{}{
		"initiator": "likes",
		"user":      user,
	}
	RenderBaseInstance.RenderTemplate(ctx, "profile_likes", data)
}

func (i *ProfileHandlerImpl) retrieveUserInfoByUsername(username string) *models.User {
	csghubServer, err := server.NewServer(i.svcCtx.Config)
	if err != nil {
		return nil
	}
	userResp, _, err := csghubServer.GetUserInfoByUsername(username)

	var user *models.User

	if err == nil {
		user = &models.User{
			Name:          userResp.Data.Username,
			Nickname:      userResp.Data.Nickname,
			Phone:         userResp.Data.Phone,
			Email:         userResp.Data.Email,
			LoginIdentity: userResp.Data.UUID,
		}
		user.SetRoles(userResp.Data.Roles...)
	} else {
		return nil
	}
	return user
}
