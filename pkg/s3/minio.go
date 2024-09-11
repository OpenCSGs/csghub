package s3

import (
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"opencsg.com/portal/config"
)

func NewMinio(cfg *config.Config) (*Client, error) {
	minioClient, err := minio.New(cfg.S3.Endpoint, &minio.Options{
		Creds:        credentials.NewStaticV4(cfg.S3.AccessKeyID, cfg.S3.AccessKeySecret, ""),
		Secure:       cfg.S3.EnableSSL,
		BucketLookup: minio.BucketLookupAuto,
		Region:       cfg.S3.Region,
	})
	if err != nil {
		return nil, err
	}

	policy := `{"Version": "2012-10-17","Statement": [{"Action": ["s3:GetObject"],"Effect": "Allow","Principal": {"AWS": ["*"]},"Resource": ["arn:aws:s3:::%s/*"],"Sid": ""}]}`

	policy = fmt.Sprintf(policy, cfg.S3.Bucket)
	err = minioClient.SetBucketPolicy(context.Background(), cfg.S3.Bucket, policy)
	if err != nil {
		return nil, fmt.Errorf("failed to set bucket %s policy: %w", cfg.S3.Bucket, err)
	}

	return &Client{
		Client: *minioClient,
		Bucket: cfg.S3.Bucket,
	}, nil
}

type Client struct {
	minio.Client
	Bucket string
}
