package csghubserver

import (
	"fmt"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

func (c *CsgHubServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	data, resp, err := c.getResponse(
		"GET",
		fmt.Sprintf("/%s/%s/%s/resolve/%s?current_user=%s", req.RepoType, req.Namespace, req.Name, req.FilePath, req.CurrentUser),
		nil,
		nil,
	)
	return data, resp, err
}

func (c *CsgHubServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	s := new(types.DownloadFileRawResp)
	resp, err := c.getParsedResponse(
		"GET",
		fmt.Sprintf("/%s/%s/%s/raw/%s?current_user=%s", req.RepoType, req.Namespace, req.Name, req.FilePath, req.CurrentUser),
		nil,
		nil,
		s,
	)
	return s, resp, err
}
