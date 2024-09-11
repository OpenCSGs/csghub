package s3

import (
	"context"
	"fmt"
	"time"
)

const objectURLExpiry = 6 * 24 * time.Hour

func (c *Client) Download(ctx context.Context, key string) string {
	endpoint := c.Client.EndpointURL().String()
	return fmt.Sprintf("%s/%s/%s", endpoint, c.Bucket, key)
}
