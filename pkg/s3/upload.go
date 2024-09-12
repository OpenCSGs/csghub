package s3

import (
	"context"
	"fmt"
	"io"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

func (c *Client) Upload(ctx context.Context, t string, reader io.ReadCloser) (string, string, error) {
	objectKey := getObjectKeyByType(t)
	info, err := c.Client.PutObject(ctx, c.Bucket, objectKey, reader, -1, minio.PutObjectOptions{})

	return info.Location, objectKey, err
}

func getObjectKeyByType(t string) string {
	name := uuid.New().String()
	switch t {
	case "user-avatar":
		return fmt.Sprintf("avatar/%s", name)
	case "org-logo":
		return fmt.Sprintf("org_logo/%s", name)
	case "comment":
		return fmt.Sprintf("comment/%s", name)
	case "application-space-cover-image":
		return fmt.Sprintf("space/%s", name)
	case "admin-photo":
		return fmt.Sprintf("admin-photo/%s", name)
	default:
		return name
	}
}
