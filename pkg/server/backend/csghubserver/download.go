package csghubserver

import (
	"net/http"
	"net/url"

	"opencsg.com/portal/pkg/server/types"
)

// downloadURL confines the request to a repository file route. URL.Path and
// url.Values encode filenames and revisions separately according to RFC 3986.
func downloadURL(req types.DownloadReq, operation string) (string, error) {
	if err := req.Validate(); err != nil {
		return "", err
	}
	u := url.URL{Path: "/" + string(req.RepoType) + "/" + req.Namespace + "/" + req.Name + "/" + operation + "/" + req.FilePath}
	u.RawQuery = url.Values{"ref": {req.Ref}}.Encode()
	return u.String(), nil
}

// DownloadFile downloads a file anonymously, without the internal service key.
func (c *CsgHubServer) DownloadFile(req types.DownloadReq) ([]byte, *http.Response, error) {
	return c.DownloadFileWithUserToken(req, "")
}

// DownloadFileWithUserToken uses only the supplied token; an empty token is anonymous.
// A rejected token is never retried with service credentials.
func (c *CsgHubServer) DownloadFileWithUserToken(req types.DownloadReq, userToken string) ([]byte, *http.Response, error) {
	path, err := downloadURL(req, "resolve")
	if err != nil {
		return nil, nil, err
	}
	return c.getRepositoryResponse(path, userToken)
}

// DownloadFileRaw reads text anonymously, without the internal service key.
func (c *CsgHubServer) DownloadFileRaw(req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	return c.DownloadFileRawWithUserToken(req, "")
}

// DownloadFileRawWithUserToken reads text with only the supplied token, if present.
func (c *CsgHubServer) DownloadFileRawWithUserToken(req types.DownloadReq, userToken string) (*types.DownloadFileRawResp, *http.Response, error) {
	path, err := downloadURL(req, "raw")
	if err != nil {
		return nil, nil, err
	}
	s := new(types.DownloadFileRawResp)
	resp, err := c.getParsedRepositoryResponse(path, userToken, s)
	return s, resp, err
}
