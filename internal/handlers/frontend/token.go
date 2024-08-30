package frontendHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/pkg/rpc"
	"opencsg.com/portal/pkg/utils/jwt"
)

type TokenHandler interface {
	RefreshToken(c *gin.Context)
}

type TokenHandlerImpl struct{}

func NewTokenHandler() TokenHandler {
	return &TokenHandlerImpl{}
}

func (i *TokenHandlerImpl) RefreshToken(c *gin.Context) {
	currentUser := jwt.GetCurrentUser(c)
	if currentUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	server_api, err := rpc.GetServerAPI()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get ServerAPI instance"})
		return
	}

	token, err := server_api.FetchJWTToken(c, currentUser.Name, currentUser.LoginIdentity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("user_token", token, 3600*24*7, "/", "", false, false)

	c.JSON(http.StatusOK, gin.H{"message": "Token set successfully"})
}
