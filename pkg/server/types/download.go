package types

type RepoType string

const (
	RepoTypeModel   RepoType = "model"
	RepoTypeDataset RepoType = "dataset"
	RepoTypeSpace   RepoType = "space"
	RepoTypeCode    RepoType = "code"
)

type DownloadReq struct {
	RepoType    RepoType `json:"repo_type"`
	Namespace   string   `json:"namespace"`
	Name        string   `json:"name"`
	FilePath    string   `json:"file_path"`
	CurrentUser string   `json:"current_user"`
}

type DownloadFileRawResp struct {
	Message string `json:"msg"`
	Data    string `json:"data"`
}
