package config

import (
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	SuperUsers     string `envconfig:"CSGHUB_PORTAL_SUPER_USERS" default:""`
	OnPremise      bool   `envconfig:"CSGHUB_PORTAL_ON_PREMISE" default:"true"`
	SensitiveCheck bool   `envconfig:"CSGHUB_PORTAL_SENSITIVE_CHECK" default:"false"`
	EnableHttps    bool   `envconfig:"CSGHUB_PORTAL_ENABLE_HTTPS" default:"true"`

	StarhubServer struct {
		BaseURL string `envconfig:"CSGHUB_PORTAL_STARHUB_BASE_URL" default:"http://localhost:8080"`
		APIKey  string `envconfig:"CSGHUB_PORTAL_STARHUB_API_KEY" default:"f3a7b9c1d6e5f8e2a1b5d4f9e6a2b8d7c3a4e2b1d9f6e7a8d2c5a7b4c1e3f5b8a1d4f9b7d6e2f8a5d3b1e7f9c6a8b2d1e4f7d5b6e9f2a4b3c8e1d7f995hd82hf"`
	}

	Database struct {
		DSN     string `envconfig:"CSGHUB_PORTAL_DATABASE_DSN" default:"postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable"`
		Dialect string `envconfig:"CSGHUB_PORTAL_DATABASE_DIALECT" default:"pg"`
	}
}

func LoadConfig() (*Config, error) {
	config := new(Config)
	err := envconfig.Process("", config)
	if err != nil {
		return nil, err
	}
	return config, nil
}
