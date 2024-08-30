package rpc

import (
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type FetchJWTResp struct {
	ExpireAt time.Time `json:"expire_at"`
	Token    string    `json:"token"`
}

func (s *ServerAPI) FetchJWTToken(c *gin.Context, username string, loginIdentity string) (string, error) {
	url := "/jwt/token?current_user=" + username
	headers := map[string]string{}

	body := map[string]string{
		"current_user": username,
		"uuid":         loginIdentity,
	}

	resp, err := s.MakeRequest(c, http.MethodPost, url, headers, body)
	if err != nil {
		return "", err
	}

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var apiResp struct {
		Msg  string        `json:"msg"`
		Data *FetchJWTResp `json:"data"`
	}

	err = json.Unmarshal(respBody, &apiResp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error unmarshalling JSON response"})
		return "", err
	}

	return apiResp.Data.Token, nil
}
