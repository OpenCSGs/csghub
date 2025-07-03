package s3

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

func (c *Client) Upload(ctx context.Context, t string, reader io.ReadCloser) (string, string, error) {
	objectKey := getObjectKeyByType(t)
	info, err := c.Client.PutObject(ctx, c.Bucket, objectKey, reader, -1, minio.PutObjectOptions{})

	return info.Location, objectKey, err
}

func (c *Client) GetTempURL(ctx context.Context, objectKey string, expiry time.Duration) (string, error) {
	url, err := c.Client.PresignedGetObject(ctx, c.Bucket, objectKey, expiry, nil)
	if err != nil {
		return "", fmt.Errorf("生成预签名 URL 失败: %v", err)
	}

	return url.String(), nil
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
