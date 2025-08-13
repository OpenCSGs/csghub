package types

import "time"

type VerifyJWTTokenResp struct {
	Message string `json:"msg"`
	Data    *User  `json:"data"`
}
type User struct {
	Username          string         `json:"username"`
	Nickname          string         `json:"nickname"`
	Phone             string         `json:"phone,omitempty"`
	Email             string         `json:"email,omitempty"`
	UUID              string         `json:"uuid,omitempty"`
	Avatar            string         `json:"avatar,omitempty"`
	Bio               string         `json:"bio,omitempty"`
	Homepage          string         `json:"homepage,omitempty"`
	Roles             []string       `json:"roles,omitempty"`
	LastLoginAt       string         `json:"last_login_at,omitempty"`
	Orgs              []Organization `json:"orgs,omitempty"`
	CanChangeUserName bool           `json:"can_change_username"`
}

type Organization struct {
	// unique name of the organization
	Name     string `json:"path"`
	Nickname string `json:"name,omitempty"`
	Homepage string `json:"homepage,omitempty"`
	Logo     string `json:"logo,omitempty"`
	OrgType  string `json:"org_type,omitempty"`
	Verified bool   `json:"verified"`
}

type CreateJWTReq struct {
	UUID string `json:"uuid"`
	// CurrentUser string `json:"current_user"`
}

type CreateJWTResp struct {
	Msg  string `json:"msg"`
	Data struct {
		ExpireAt time.Time `json:"expire_at"`
		Token    string    `json:"token"`
	} `json:"data"`
}
