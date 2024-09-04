package csghubserver

import (
	"fmt"
	"io"
	"net/http"

	"opencsg.com/portal/pkg/server/types"
)

func (c *CsgHubServer) DownloadFile(req types.DownlaodReq) (io.ReadCloser, *http.Response, error) {
	_, resp, err := c.getResponse(
		"GET",
		fmt.Sprintf("/%s/%s/%s/resolve/%s", req.RepoType, req.Namespace, req.Name, req.FilePath),
		nil,
		nil,
	)
	return resp.Body, resp, err
}

func (c *CsgHubServer) DownloadFileRaw(req types.DownlaodReq) (*types.DownloadFileRawResp, *http.Response, error) {
	s := new(types.DownloadFileRawResp)
	resp, err := c.getParsedResponse(
		"GET",
		fmt.Sprintf("/%s/%s/%s/raw/%s", req.RepoType, req.Namespace, req.Name, req.FilePath),
		nil,
		nil,
		s,
	)
	return s, resp, err
}
