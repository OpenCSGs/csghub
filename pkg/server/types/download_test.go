package types

import "testing"

// TestDownloadReqValidate covers supported Server routes, legacy names, and path boundaries.
func TestDownloadReqValidate(t *testing.T) {
	valid := DownloadReq{RepoType: RepoTypeModel, Namespace: "Org.v1-2", Name: "0_repo.v2", FilePath: "dir/README.md"}
	for _, repoType := range []RepoType{"models", "datasets", "spaces", "codes", "mcps", "skills"} {
		req := valid
		req.RepoType = repoType
		if err := req.Validate(); err != nil {
			t.Errorf("Server file route %q rejected: %v", repoType, err)
		}
	}
	for _, filePath := range []string{".gitattributes", "nested/中文 file.md", "dir/a?current_user=owner&ref=other#tag", "dir/100%+&.txt", "literal/%2e%2e/%2f.txt"} {
		req := valid
		req.FilePath = filePath
		if err := req.Validate(); err != nil {
			t.Errorf("literal file path %q rejected: %v", filePath, err)
		}
	}
	for _, namespace := range []string{"alice+lab", "alice@example.com", "研发组", "Team One", "org?current_user=owner#fragment", "%2e%2e", "%2e%2e%2fusers"} {
		req := valid
		req.Namespace = namespace
		if err := req.Validate(); err != nil {
			t.Errorf("literal namespace %q rejected: %v", namespace, err)
		}
	}
	for _, tc := range []struct {
		field string
		value string
	}{
		{"type", ""}, {"type", "model"}, {"type", "users"}, {"type", "prompts"}, {"type", "templates"}, {"type", "mcpservers"},
		{"namespace", ""}, {"namespace", "."}, {"namespace", ".."}, {"namespace", "org/name"}, {"namespace", "org\\name"}, {"namespace", "org\x00name"}, {"namespace", "org\r\nname"}, {"namespace", "org\u0085name"},
		{"name", ""}, {"name", "."}, {"name", ".."}, {"name", "repo/other"}, {"name", "repo?current_user=owner"}, {"name", "repo#fragment"}, {"name", "repo\\name"}, {"name", "repo%2f.."},
		{"path", ""}, {"path", "/file"}, {"path", "../file"}, {"path", "dir/../../file"}, {"path", "dir/./file"}, {"path", "dir//file"}, {"path", "dir/"}, {"path", "dir\\file"}, {"path", "dir/\x00file"}, {"path", "dir/\r\nfile"},
	} {
		t.Run(tc.field+"/"+tc.value, func(t *testing.T) {
			req := valid
			switch tc.field {
			case "type":
				req.RepoType = RepoType(tc.value)
			case "namespace":
				req.Namespace = tc.value
			case "name":
				req.Name = tc.value
			case "path":
				req.FilePath = tc.value
			}
			if err := req.Validate(); err == nil {
				t.Fatal("unsafe repository target accepted")
			}
		})
	}
}
