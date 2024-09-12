package frontendHandlers

import (
	"log/slog"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/s3"
	"opencsg.com/portal/pkg/utils/jwt"
)

var _ UploadHandler = (*UploadHandlerImpl)(nil)

type UploadHandler interface {
	Create(c *gin.Context)
}

type UploadHandlerImpl struct {
	S3 *s3.Client
}

func NewUploadHandler(config *config.Config) (UploadHandler, error) {
	s3, err := s3.NewMinio(config)
	if err != nil {
		return nil, err
	}
	return &UploadHandlerImpl{
		S3: s3,
	}, nil
}

func (i *UploadHandlerImpl) Create(c *gin.Context) {
	var (
		file      *multipart.FileHeader
		namespace string
		objectKey string
		url       string
		err       error
	)
	currentUser := jwt.GetCurrentUser(c)
	if currentUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	file, err = c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if file == nil {
		file, err = c.FormFile("upload")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	namespace, ok := c.GetPostForm("namespace")
	if namespace == "" || !ok {
		namespace = "comment"
	}

	reader, err := file.Open()
	if err != nil {
		slog.Error("failed to open file", slog.Any("error", err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url, objectKey, err = i.S3.Upload(c, namespace, reader)
	if err != nil {
		slog.Error("failed to upload file", slog.Any("error", err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url, "code": objectKey})
}
