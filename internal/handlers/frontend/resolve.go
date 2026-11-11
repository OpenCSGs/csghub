package frontendHandlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/server"
	"opencsg.com/portal/pkg/server/backend"
	"opencsg.com/portal/pkg/server/types"
)

// ContentTypeFormatMapping is a map of file extensions to MIME types
var ContentTypeFormatMapping = map[string]string{
	"jpg":  "image/jpeg",
	"jpeg": "image/jpeg",
	"png":  "image/png",
	"gif":  "image/gif",
	"svg":  "image/svg+xml",
	"webp": "image/webp",
	"avif": "image/avif",
	"tiff": "image/tiff",
	"bmp":  "image/bmp",
	"ico":  "image/x-icon",
	"heic": "image/heic",
	"heif": "image/heif",
}

const (
	defaultContentType = "application/octet-stream"
	errorMsgInternal   = "An internal error occurred"
	errorMsgNoData     = "No data available"
)

type ResolveHandler interface {
	Resolve(c *gin.Context)
}

// ResolveHandlerImpl delegates repository access decisions to Server.
type ResolveHandlerImpl struct {
	Server backend.Server
}

// NewResolveHandler creates the repository file proxy.
func NewResolveHandler(config *config.Config) (ResolveHandler, error) {
	server, err := server.NewServer(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create server: %w", err)
	}
	return &ResolveHandlerImpl{
		Server: server,
	}, nil
}

// Resolve proxies repository files using the caller's token or anonymous access.
// @Summary Resolve a repository file
// @Tags Repository
// @Param repo_type path string true "Repository route type" Enums(models,datasets,spaces,codes,mcps,skills)
// @Param namespace path string true "Repository namespace"
// @Param name path string true "Repository name"
// @Param branch path string true "Repository revision"
// @Param path path string true "File path"
// @Success 200 {string} string "File content"
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Router /{repo_type}/{namespace}/{name}/resolve/{branch}/{path} [get]
func (i *ResolveHandlerImpl) Resolve(c *gin.Context) {
	if err := i.buildDownloadReq(c).Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	i.resolveFileOrContent(c, i.downloadResolveFile, i.getFileContent)
}

func (i *ResolveHandlerImpl) resolveFileOrContent(ctx *gin.Context, downloadFunc func(*gin.Context) ([]byte, *http.Response, error), getContentFunc func(*gin.Context) (string, *http.Response, error)) {
	filePath := strings.TrimPrefix(ctx.Param("path"), "/")
	if filePath == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "File path is required"})
		return
	}

	format := getFileExtension(filePath)
	if isImageFormat(format) {
		i.sendImageData(ctx, downloadFunc)
	} else {
		i.renderTextData(ctx, getContentFunc)
	}
}

func (i *ResolveHandlerImpl) sendImageData(ctx *gin.Context, downloadFunc func(*gin.Context) ([]byte, *http.Response, error)) {
	data, resp, err := downloadFunc(ctx)
	if err != nil {
		renderResolveError(ctx, resp)
		return
	}

	if len(data) == 0 {
		ctx.JSON(http.StatusNoContent, gin.H{"error": errorMsgNoData})
		return
	}

	contentType := determineContentType(ctx.Param("path"))
	ctx.Header("Content-Disposition", "inline")
	ctx.Data(http.StatusOK, contentType, data)
}

func (i *ResolveHandlerImpl) renderTextData(ctx *gin.Context, getContentFunc func(*gin.Context) (string, *http.Response, error)) {
	content, resp, err := getContentFunc(ctx)
	if err != nil {
		renderResolveError(ctx, resp)
		return
	}

	ctx.String(http.StatusOK, content)
}

func (i *ResolveHandlerImpl) downloadResolveFile(ctx *gin.Context) ([]byte, *http.Response, error) {
	req := i.buildDownloadReq(ctx)
	data, resp, err := i.downloadFile(ctx, req)
	if err != nil {
		return data, resp, fmt.Errorf("failed to download file: %w", err)
	}
	if resp == nil {
		return data, nil, fmt.Errorf("failed to download file: empty response")
	}
	if resp.StatusCode != http.StatusOK {
		return data, resp, fmt.Errorf("server returned non-success status code: %d", resp.StatusCode)
	}
	return data, resp, nil
}

func (i *ResolveHandlerImpl) getFileContent(ctx *gin.Context) (string, *http.Response, error) {
	req := i.buildDownloadReq(ctx)
	rawResp, resp, err := i.downloadFileRaw(ctx, req)
	if err != nil {
		return "", resp, fmt.Errorf("failed to get file content: %w", err)
	}
	if resp == nil {
		return "", nil, fmt.Errorf("failed to get file content: empty response")
	}
	if resp.StatusCode != http.StatusOK {
		return "", resp, fmt.Errorf("failed to get file content: %s", resp.Status)
	}
	if rawResp == nil {
		return "", resp, fmt.Errorf("failed to get file content: empty response body")
	}
	return rawResp.Data, resp, nil
}

func (i *ResolveHandlerImpl) downloadFile(ctx *gin.Context, req types.DownloadReq) ([]byte, *http.Response, error) {
	userToken, err := ctx.Cookie("user_token")
	if err == nil && userToken != "" {
		return i.Server.DownloadFileWithUserToken(req, userToken)
	}
	return i.Server.DownloadFile(req)
}

func (i *ResolveHandlerImpl) downloadFileRaw(ctx *gin.Context, req types.DownloadReq) (*types.DownloadFileRawResp, *http.Response, error) {
	userToken, err := ctx.Cookie("user_token")
	if err == nil && userToken != "" {
		return i.Server.DownloadFileRawWithUserToken(req, userToken)
	}
	return i.Server.DownloadFileRaw(req)
}

func renderResolveError(ctx *gin.Context, resp *http.Response) {
	statusCode := http.StatusInternalServerError
	if resp != nil && resp.StatusCode > 0 {
		statusCode = resp.StatusCode
	}

	message := errorMsgInternal
	if statusCode != http.StatusInternalServerError {
		if statusText := http.StatusText(statusCode); statusText != "" {
			message = statusText
		}
	}

	ctx.JSON(statusCode, gin.H{"error": message})
}

// buildDownloadReq reads only route fields; query and session identities are never forwarded.
func (i *ResolveHandlerImpl) buildDownloadReq(ctx *gin.Context) types.DownloadReq {
	return types.DownloadReq{
		RepoType:  types.RepoType(ctx.Param("repo_type")),
		Namespace: ctx.Param("namespace"),
		Name:      ctx.Param("name"),
		FilePath:  strings.TrimPrefix(ctx.Param("path"), "/"),
		Ref:       ctx.Param("branch"),
	}
}

func isImageFormat(format string) bool {
	contentType, ok := ContentTypeFormatMapping[format]
	return ok && strings.HasPrefix(contentType, "image/")
}

func determineContentType(filename string) string {
	ext := getFileExtension(filename)
	if contentType, ok := ContentTypeFormatMapping[ext]; ok {
		return contentType
	}
	return defaultContentType
}

// getFileExtension returns a lowercase extension without its dot, or an empty
// string when the filename has no extension or ends in a dot.
func getFileExtension(filename string) string {
	ext := filepath.Ext(filename)
	if len(ext) > 1 {
		return strings.ToLower(ext[1:])
	}
	return ""
}
