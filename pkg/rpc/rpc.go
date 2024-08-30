package rpc

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"opencsg.com/portal/internal/config"
)

type ServerAPI struct {
	BaseURL    string
	HTTPClient *http.Client
}

var (
	instance *ServerAPI
	once     sync.Once
)

// GetServerAPI returns the singleton instance of ServerAPI
func GetServerAPI() (*ServerAPI, error) {
	var err error
	once.Do(func() {
		instance, err = newServerAPI()
	})
	return instance, err
}

// newServerAPI creates a new ServerAPI instance
func newServerAPI() (*ServerAPI, error) {
	baseURL := config.Env("STARHUB_INNER_BASE_URL", "").(string)
	if baseURL == "" {
		return nil, fmt.Errorf("base URL not set in environment")
	}

	return &ServerAPI{
		BaseURL: baseURL + "/api/v1",
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}, nil
}

func (s *ServerAPI) MakeRequest(ctx context.Context, method, endpoint string, headers map[string]string, body interface{}) (*http.Response, error) {
	fullURL := s.BaseURL + endpoint

	var reqBody *bytes.Buffer
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("error encoding JSON body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonBody)
	}

	req, err := http.NewRequestWithContext(ctx, method, fullURL, reqBody)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	if token := config.Env("STARHUB_TOKEN", "").(string); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	for key, value := range headers {
		req.Header.Set(key, value)
	}

	resp, err := s.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}

	return resp, nil
}
