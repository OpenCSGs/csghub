package frontendHandlers

import (
	"mime/multipart"
	"net/http"
	"net/url"

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
		url       *url.URL
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

	namespace = c.Param("namespace")
	if namespace == "" {
		namespace = "comment"
	}

	reader, err := file.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	objectKey, err = i.S3.Upload(c, namespace, reader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	url, err = i.S3.Download(c, objectKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url.String(), "code": objectKey})
}
