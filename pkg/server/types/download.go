package types

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

// RepoType identifies a Server repository route prefix.
type RepoType string

// These are the repository types with raw and resolve routes in Server's
// api/router/api.go and api/router/api_mcp.go, including MCP and Skill repositories.
const (
	RepoTypeModel   RepoType = "models"
	RepoTypeDataset RepoType = "datasets"
	RepoTypeSpace   RepoType = "spaces"
	RepoTypeCode    RepoType = "codes"
	RepoTypeMCP     RepoType = "mcps"
	RepoTypeSkill   RepoType = "skills"
)

// repositoryName retains the repository-name character check without imposing
// creation length or prefix rules on existing and imported repositories.
var repositoryName = regexp.MustCompile(`^[a-zA-Z0-9._-]+$`)

// ValidateRepository ensures a repository target stays within a supported route.
// Callers must URL-encode the validated segments before sending requests.
func ValidateRepository(repoType RepoType, namespace, name string) error {
	switch repoType {
	case RepoTypeModel, RepoTypeDataset, RepoTypeSpace, RepoTypeCode, RepoTypeMCP, RepoTypeSkill:
	default:
		return fmt.Errorf("unsupported repository type")
	}
	// SSO namespaces follow their provider's naming rules; enforce only path safety.
	if namespace == "" || namespace == "." || namespace == ".." ||
		strings.ContainsAny(namespace, `/\`) || strings.IndexFunc(namespace, unicode.IsControl) >= 0 {
		return fmt.Errorf("invalid repository namespace or name")
	}
	if !repositoryName.MatchString(name) || name == "." || name == ".." {
		return fmt.Errorf("invalid repository namespace or name")
	}
	return nil
}

// DownloadReq selects a repository file; identity is supplied only by a user token.
type DownloadReq struct {
	RepoType  RepoType `json:"repo_type"`
	Namespace string   `json:"namespace"`
	Name      string   `json:"name"`
	FilePath  string   `json:"file_path"`
	// Ref is encoded as a single query value; Server validates Git revision semantics.
	Ref string `json:"ref"`
}

// Validate rejects route traversal while retaining nested paths and literal URL
// characters in filenames. Callers must URL-encode the validated path separately.
func (r DownloadReq) Validate() error {
	if err := ValidateRepository(r.RepoType, r.Namespace, r.Name); err != nil {
		return err
	}
	if strings.Contains(r.FilePath, `\`) || strings.IndexFunc(r.FilePath, unicode.IsControl) >= 0 {
		return fmt.Errorf("invalid file path")
	}
	for _, segment := range strings.Split(r.FilePath, "/") {
		if segment == "" || segment == "." || segment == ".." {
			return fmt.Errorf("invalid file path")
		}
	}
	return nil
}

// DownloadFileRawResp contains the text returned by Server's raw file endpoint.
type DownloadFileRawResp struct {
	Message string `json:"msg"`
	Data    string `json:"data"`
}
