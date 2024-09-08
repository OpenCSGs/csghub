package renderHandlers

import (
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/server"
	"opencsg.com/portal/pkg/server/backend"
)

const (
	cookieMaxAge = 3600 * 24 * 7
)

type SessionHandler interface {
	Login(ctx *gin.Context)
	SignUp(ctx *gin.Context)
	Create(ctx *gin.Context)
}

type SessionHandlerImpl struct {
	Config    *config.Config
	Server    backend.Server
	userModel *models.UserStore
}

func NewSessionHandler(config *config.Config) (SessionHandler, error) {
	server, err := server.NewServer(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create server: %w", err)
	}
	return &SessionHandlerImpl{
		Config:    config,
		userModel: models.NewUserStore(),
		Server:    server,
	}, nil
}

func (i *SessionHandlerImpl) Login(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.LoginURL)
}

func (i *SessionHandlerImpl) SignUp(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.SignupURL)
}

func (i *SessionHandlerImpl) Create(ctx *gin.Context) {
	// 调用 jwt token 验证接口获取 userinfos
	var user *models.User
	jwtToken := ctx.Query("jwt")
	if jwtToken == "" {
		ctx.Redirect(http.StatusFound, "/error/login-failed?error_msg='invalid jwt token'")
		return
	}
	userResp, _, err := i.Server.VerifyJWTToken(jwtToken)
	if err != nil {
		ctx.Redirect(http.StatusFound, "/error/login-failed")
		return
	}

	if userResp == nil {
		ctx.Redirect(http.StatusFound, "/error/login-failed?error_msg='invalid jwt token'")
		return
	}

	ctx.SetCookie("user_token", ctx.Param("jwt"), cookieMaxAge, "/", "", false, false)
	ctx.SetCookie("can_change_username", fmt.Sprintf("%v", userResp.CanChangeUserName), cookieMaxAge, "/", "", false, false)

	dbUser, err := i.userModel.FindByLoginIdentity(ctx, userResp.UUID)
	user = &dbUser
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			user = &models.User{
				Name:          userResp.Username,
				Nickname:      userResp.Nickname,
				Phone:         userResp.Phone,
				Email:         userResp.Email,
				LoginIdentity: userResp.UUID,
				RolesMask:     strings.Join(userResp.Roles, ","),
			}

			err = i.userModel.Create(ctx, user)
			if err != nil {
				slog.Error("failed to create user", slog.Any("error", err))
				ctx.Redirect(http.StatusInternalServerError, "/error/login-failed")
			}
		}
		ctx.Redirect(http.StatusFound, "/error/login-failed?error_msg='invalid jwt token'")
		return
	}

	ctx.SetCookie("login_identity", user.LoginIdentity, cookieMaxAge, "/", "", false, false)
	ctx.SetCookie("current_user", user.Name, cookieMaxAge, "/", "", false, false)
	ctx.SetCookie("admin_user", fmt.Sprintf("%t", user.IsAdmin()), cookieMaxAge, "/", "", false, false)

	user.SessionIP = ctx.ClientIP()
	err = i.userModel.Update(ctx, user)
	if err != nil {
		slog.Error("failed to set user session ip", slog.Any("error", err))
		ctx.Redirect(http.StatusInternalServerError, "/error/login-failed")
		return
	}

	ctx.Redirect(http.StatusFound, "/")
	// login_by_server_user_infos 通过 userinfo 创建用户
	// ? 如何初始化 userModel 以及创建  create user 接口
	// log_in 设置 user session，其他 cookies
}
