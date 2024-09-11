package s3

import (
	"context"
	"net/url"
	"time"
)

const objectURLExpiry = 6 * 24 * time.Hour

func (c *Client) Download(ctx context.Context, key string) (*url.URL, error) {
	url, err := c.Client.PresignedGetObject(ctx, c.Bucket, key, objectURLExpiry, nil)
	if err != nil {
		return nil, err
	}
	return url, nil
}
