package s3

import (
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

	return &Client{
		Client: *minioClient,
		Bucket: cfg.S3.Bucket,
	}, nil
}

func NewPrivateMinio(cfg *config.Config) (*Client, error) {
	minioClient, err := minio.New(cfg.PrivateS3.Endpoint, &minio.Options{
		Creds:        credentials.NewStaticV4(cfg.PrivateS3.AccessKeyID, cfg.PrivateS3.AccessKeySecret, ""),
		Secure:       cfg.PrivateS3.EnableSSL,
		BucketLookup: minio.BucketLookupAuto,
		Region:       cfg.PrivateS3.Region,
	})
	if err != nil {
		return nil, err
	}

	return &Client{
		Client: *minioClient,
		Bucket: cfg.PrivateS3.Bucket,
	}, nil
}

type Client struct {
	minio.Client
	Bucket string
}
