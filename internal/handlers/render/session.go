package renderHandlers

import (
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

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
	Logout(ctx *gin.Context)
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

func (i *SessionHandlerImpl) Logout(ctx *gin.Context) {
	cookies := ctx.Request.Cookies()
	paramRedirectPath := ctx.Query("redirect_to")

	// Loop through the cookies and remove them
	for _, cookie := range cookies {
		ctx.SetCookie(cookie.Name, "", -1, "/", "", false, false)
	}

	if paramRedirectPath == "" {
		ctx.Redirect(http.StatusFound, "/")
	} else {
		ctx.Redirect(http.StatusFound, paramRedirectPath)
	}
}

func (i *SessionHandlerImpl) SignUp(ctx *gin.Context) {
	ctx.Redirect(http.StatusFound, i.Config.SignupURL)
}

func (i *SessionHandlerImpl) Create(ctx *gin.Context) {
	// 调用 jwt token 验证接口获取 userinfos
	var user *models.User
	jwtToken := ctx.Query("jwt")
	if jwtToken == "" {
		slog.Error("Login Error", "error", "jwt is blank")
		ctx.Redirect(http.StatusFound, "/errors/login-failed?error_msg='invalid jwt token'")
		return
	}
	userResp, _, err := i.Server.VerifyJWTToken(jwtToken)
	if err != nil {
		stackTrace := string(debug.Stack())
		slog.Error("Login Error", "error", "verify jwt token failed", "jwt", jwtToken, slog.Any("error", err), "stack", stackTrace)
		ctx.Redirect(http.StatusFound, "/errors/login-failed")
		return
	}

	if userResp == nil {
		slog.Error("Login Error", "error", "verify jwt token failed", "jwt", jwtToken)
		ctx.Redirect(http.StatusFound, "/errors/login-failed?error_msg='invalid jwt token'")
		return
	}

	ctx.SetCookie("user_token", jwtToken, cookieMaxAge, "/", "", false, false)
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
			}

			err = i.userModel.Create(ctx, user)
			if err != nil {
				stackTrace := string(debug.Stack())
				slog.Error("Login Error", "error", "create user failed", slog.Any("error", err), "uuid", userResp.UUID, "stack", stackTrace)
				ctx.Redirect(http.StatusFound, "/errors/login-failed")
				return
			}
		} else {
			ctx.Redirect(http.StatusFound, "/errors/login-failed?error_msg='invalid jwt token'")
			return
		}
	} else {
		user.Name = userResp.Username
		user.Nickname = userResp.Nickname
		user.Phone = userResp.Phone
		user.Email = userResp.Email
		err = i.userModel.Update(ctx, user)
		if err != nil {
			stackTrace := string(debug.Stack())
			slog.Error("Login Error", "error", "update user failed", slog.Any("error", err), "uuid", userResp.UUID, "stack", stackTrace)
			ctx.Redirect(http.StatusFound, "/errors/login-failed")
			return
		}
	}

	user.SetRoles(userResp.Roles...)

	ctx.SetCookie("login_identity", user.LoginIdentity, cookieMaxAge, "/", "", false, false)
	ctx.SetCookie("current_user", userResp.Username, cookieMaxAge, "/", "", false, false)

	user.SessionIP = ctx.ClientIP()
	err = i.userModel.Update(ctx, user)
	if err != nil {
		slog.Error("Login Error", "error", "failed to set user session ip", slog.Any("error", err), "session_ip", user.SessionIP)
		ctx.Redirect(http.StatusFound, "/errors/login-failed")
		return
	}

	ctx.Redirect(http.StatusFound, "/")
}
