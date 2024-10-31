package frontendHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/server"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/types"
	"opencsg.com/portal/pkg/utils/jwt"
)

type TokenHandler interface {
	RefreshToken(c *gin.Context)
}

type TokenHandlerImpl struct {
	Server backend.Server
}

func NewTokenHandler(config *config.Config) (TokenHandler, error) {
	server, err := server.NewServer(config)
	if err != nil {
		return nil, err
	}
	return &TokenHandlerImpl{
		Server: server,
	}, nil
}

func (i *TokenHandlerImpl) RefreshToken(c *gin.Context) {
	currentUser := jwt.GetCurrentUser(c)
	if currentUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	r, _, err := i.Server.CreateJWTToken(types.CreateJWTReq{
		UUID: currentUser.LoginIdentity,
		// CurrentUser: currentUser.Name,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("user_token", r.Data.Token, 3600*24*7, "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{"jwt_token": r.Data.Token})
}
