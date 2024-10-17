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
	"opencsg.com/portal/pkg/utils/jwt"
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

type ResolveHandlerImpl struct {
	Server backend.Server
}

func NewResolveHandler(config *config.Config) (ResolveHandler, error) {
	server, err := server.NewServer(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create server: %w", err)
	}
	return &ResolveHandlerImpl{
		Server: server,
	}, nil
}

func (i *ResolveHandlerImpl) Resolve(c *gin.Context) {
	i.resolveFileOrContent(c, i.downloadResolveFile, i.getFileContent)
}

func (i *ResolveHandlerImpl) resolveFileOrContent(ctx *gin.Context, downloadFunc func(*gin.Context) ([]byte, error), getContentFunc func(*gin.Context) (string, error)) {
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

func (i *ResolveHandlerImpl) sendImageData(ctx *gin.Context, downloadFunc func(*gin.Context) ([]byte, error)) {
	data, err := downloadFunc(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": errorMsgInternal})
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

func (i *ResolveHandlerImpl) renderTextData(ctx *gin.Context, getContentFunc func(*gin.Context) (string, error)) {
	content, err := getContentFunc(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": errorMsgInternal})
		return
	}

	ctx.String(http.StatusOK, content)
}

func (i *ResolveHandlerImpl) downloadResolveFile(ctx *gin.Context) ([]byte, error) {
	req := buildDownloadReq(ctx)
	data, resp, err := i.Server.DownloadFile(req)
	if err != nil {
		return nil, fmt.Errorf("failed to download file: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server returned non-success status code: %d", resp.StatusCode)
	}
	return data, nil
}

func (i *ResolveHandlerImpl) getFileContent(ctx *gin.Context) (string, error) {
	req := buildDownloadReq(ctx)
	rawResp, resp, err := i.Server.DownloadFileRaw(req)
	if err != nil {
		return "", fmt.Errorf("failed to get file content: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to get file content: %s", resp.Status)
	}
	return rawResp.Data, nil
}

func buildDownloadReq(ctx *gin.Context) types.DownloadReq {
	userName := ""
	currentUser := jwt.GetCurrentUser(ctx)
	if currentUser != nil {
		userName = currentUser.Name
	}

	return types.DownloadReq{
		RepoType:    types.RepoType(ctx.Param("repo_type")),
		Namespace:   ctx.Param("namespace"),
		Name:        ctx.Param("name"),
		FilePath:    strings.TrimPrefix(ctx.Param("path"), "/"),
		CurrentUser: userName,
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

func getFileExtension(filename string) string {
	return strings.ToLower(filepath.Ext(filename)[1:])
}
