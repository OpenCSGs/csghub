package types

type ImageSensitiveCheckResp struct {
	Message string `json:"msg"`
	Data    string `json:"data"`
}

type ImageSensitiveCheckReq struct {
	Scenario      string `json:"scenario"`
	OssBucketName string `json:"oss_bucket_name"`
	OssObjectName string `json:"oss_object_name"`
}
