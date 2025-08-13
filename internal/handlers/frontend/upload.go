package frontendHandlers

import (
	"log/slog"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/pkg/s3"
	"opencsg.com/portal/pkg/utils/jwt"
)

var _ UploadHandler = (*UploadHandlerImpl)(nil)

type UploadHandler interface {
	Create(c *gin.Context)
	PrivateCreate(c *gin.Context)
	GetUrlByObjectKey(c *gin.Context)
}

type UploadHandlerImpl struct {
	S3        *s3.Client
	PrivateS3 *s3.Client
	jwtUtils  jwt.JwtUtils
}

func NewUploadHandler(config *config.Config) (UploadHandler, error) {
	s3Ins, err := s3.NewMinio(config)
	if err != nil {
		return nil, err
	}
	privateS3Ins, err := s3.NewPrivateMinio(config)
	if err != nil {
		return nil, err
	}
	return &UploadHandlerImpl{
		S3:        s3Ins,
		PrivateS3: privateS3Ins,
		jwtUtils:  jwt.NewJwtUtils(),
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

	c.PureJSON(http.StatusOK, gin.H{"url": url, "code": objectKey})
}

func (i *UploadHandlerImpl) PrivateCreate(c *gin.Context) {
	var (
		file      *multipart.FileHeader
		namespace string
		objectKey string
		err       error
	)

	file, _ = c.FormFile("file")

	if file == nil {
		file, err = c.FormFile("upload")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size too large"})
		return
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

	if c.Query("check_image") == "true" {
		reader.Seek(0, 0)
		buf := make([]byte, 512)
		_, err := reader.Read(buf)
		if err != nil {
			slog.Error("failed to read file", slog.Any("error", err))
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type"})
			return
		}
		reader.Seek(0, 0)

		contentType := http.DetectContentType(buf)

		if contentType != "image/jpeg" && contentType != "image/png" {
			slog.Error("invalid file type", slog.String("type", contentType))
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type"})
			return
		}
	}

	_, objectKey, err = i.PrivateS3.Upload(c, namespace, reader)
	if err != nil {
		slog.Error("failed to upload file", slog.Any("error", err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tempUrl, err := i.PrivateS3.GetTempURL(c, objectKey, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get url"})
		return
	}

	c.PureJSON(http.StatusOK, gin.H{"url": tempUrl, "code": objectKey})
}

func (i *UploadHandlerImpl) GetUrlByObjectKey(c *gin.Context) {
	objectKey := c.Query("object_key")
	if objectKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "object_key is required"})
		return
	}
	url, err := i.PrivateS3.GetTempURL(c, objectKey, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to get url"})
		return
	}
	c.PureJSON(http.StatusOK, gin.H{"url": url, "code": "some_key"})
}
