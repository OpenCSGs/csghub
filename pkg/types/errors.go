package types

import "errors"

var (
	NotFoundError = errors.New("not found")
	InternalError = errors.New("internal error")
	AuthError     = errors.New("auth error")
)
