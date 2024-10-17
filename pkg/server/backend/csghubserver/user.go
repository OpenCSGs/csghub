package csghubserver

import (
	"fmt"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

func (c *CsgHubServer) GetUserInfo(uuid string) (*types.VerifyJWTTokenResp, *http.Response, error) {
	userResp := new(types.VerifyJWTTokenResp)

	resp, err := c.getParsedResponse(
		"GET",
		fmt.Sprintf("/user/%s?type=uuid", uuid),
		nil,
		nil,
		userResp,
	)
	return userResp, resp, err
}
