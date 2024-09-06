package renderHandlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/server"
)

type SessionHandler interface {
	Login(ctx *gin.Context)
	SignUp(ctx *gin.Context)
	Logout(ctx *gin.Context)
	Create(ctx *gin.Context)
}

type SessionHandlerImpl struct {
	Config *config.Config
}

func NewSessionHandler(config *config.Config) SessionHandler {
	return &SessionHandlerImpl{
		Config: config,
	}
}

func (i *SessionHandlerImpl) Login(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.SignupURL)
}

func (i *SessionHandlerImpl) SignUp(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.LoginURL)
}

func (i *SessionHandlerImpl) Logout(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, "/")
}

func (i *SessionHandlerImpl) Create(ctx *gin.Context) {
	// 调用 jwt token 验证接口获取 userinfos
	server, err := server.NewServer(i.Config)
	if err != nil {
		// ToDo: need to redirect to /errors/login-failed
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	userResp, _, err := server.VerifyJWTToken(ctx.Param("jwt"))
	if err != nil {
		// ToDo: need to redirect to /errors/login-failed
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.SetCookie("user_token", ctx.Param("jwt"), 3600*24*7, "/", "", false, false)
	ctx.SetCookie("can_change_username", userResp.CanChangeUserName, 3600*24*7, "/", "", false, false)
	svcCtx, err := svc.NewServiceContext(i.Config)
	if err != nil {
		return fmt.Errorf("initializing service context: %w", err)
	}
	userModel := models.NewUserStore(svcCtx.Db)
	user, err := userModel.Create(userResp)
	// login_by_server_user_infos 通过 userinfo 创建用户
	// ? 如何初始化 userModel 以及创建  create user 接口
	// log_in 设置 user session，其他 cookies
}
