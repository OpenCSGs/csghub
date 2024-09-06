package csghubserver

import (
	"bytes"
	"encoding/json"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

// Check if image has sensitive content
func (c *CsgHubServer) ImageSecureCheck(req types.ImageSensitiveCheckReq) (*types.ImageSensitiveCheckResp, *http.Response, error) {
	checkResp := new(types.ImageSensitiveCheckResp)
	body, err := json.Marshal(&req)
	if err != nil {
		return nil, nil, err
	}
	resp, err := c.getParsedResponse(
		"POST",
		"/sensitive/image",
		nil,
		bytes.NewReader(body),
		checkResp,
	)
	return checkResp, resp, err
}
