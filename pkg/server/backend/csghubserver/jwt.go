package csghubserver

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

// Verify JWT token and get user info
func (c *CsgHubServer) VerifyJWTToken(token string) (*types.User, *http.Response, error) {
	s := new(types.VerifyJWTTokenResp)
	resp, err := c.getParsedResponse(
		"GET",
		fmt.Sprintf("/jwt/%s", token),
		nil,
		nil,
		s,
	)
	return s.Data, resp, err
}

// Refresh JWT token
func (c *CsgHubServer) CreateJWTToken(req types.CreateJWTReq) (*types.CreateJWTResp, *http.Response, error) {
	checkResp := new(types.CreateJWTResp)
	body, err := json.Marshal(&req)
	if err != nil {
		return nil, nil, err
	}
	resp, err := c.getParsedResponse(
		"POST",
		fmt.Sprintf("/jwt/token?current_user_uuid=%s", req.UUID),
		nil,
		bytes.NewReader(body),
		checkResp,
	)
	return checkResp, resp, err
}
