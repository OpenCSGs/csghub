package types

type UserResp struct {
	ID            int64    `json:"id"`
	Nickname      string   `json:"nickname"`
	Name          string   `json:"username"`
	Email         string   `json:"email"`
	LoginIdentity string   `json:"uuid"`
	Gender        string   `json:"gender"`
	Roles         []string `json:"roles"`
	Phone         string   `json:"phone"`
}
