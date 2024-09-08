package config

import (
	"github.com/kelseyhightower/envconfig"
)

type DatabaseDialect string

const (
	DialectPostgres DatabaseDialect = "pg"
	DialectSQLite   DatabaseDialect = "sqlite"
)

type Config struct {
	ServerPort     int    `envconfig:"CSGHUB_PORTAL_SERVER_PORT" default:"8090"`
	SuperUsers     string `envconfig:"CSGHUB_PORTAL_SUPER_USERS" default:""`
	OnPremise      bool   `envconfig:"CSGHUB_PORTAL_ON_PREMISE" default:"true"`
	SensitiveCheck bool   `envconfig:"CSGHUB_PORTAL_SENSITIVE_CHECK" default:"false"`
	EnableHttps    bool   `envconfig:"CSGHUB_PORTAL_ENABLE_HTTPS" default:"true"`
	SignupURL      string `envconfig:"CSGHUB_PORTAL_SIGNUP_URL" default:""`
	LoginURL       string `envconfig:"CSGHUB_PORTAL_LOGIN_URL" default:"http://60.205.228.141:8000/login/oauth/authorize?client_id=4ba65e712c5dabca3e48&response_type=code&redirect_uri=http://localhost:8080/api/v1/callback/casdoor&scope=read&state=casdoor"`

	StarhubServer struct {
		BaseURL string `envconfig:"CSGHUB_PORTAL_STARHUB_BASE_URL" default:"http://localhost:8080"`
		APIKey  string `envconfig:"CSGHUB_PORTAL_STARHUB_API_KEY" default:"f3a7b9c1d6e5f8e2a1b5d4f9e6a2b8d7c3a4e2b1d9f6e7a8d2c5a7b4c1e3f5b8a1d4f9b7d6e2f8a5d3b1e7f9c6a8b2d1e4f7d5b6e9f2a4b3c8e1d7f995hd82hf"`
	}

	Database struct {
		DSN     string          `envconfig:"CSGHUB_PORTAL_DATABASE_DSN" default:"postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable"`
		Dialect DatabaseDialect `envconfig:"CSGHUB_PORTAL_DATABASE_DIALECT" default:"pg"`
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
