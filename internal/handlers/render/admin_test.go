package renderHandlers

import (
	"testing"

	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	mockjwt "opencsg.com/portal/_mocks/opencsg.com/portal/pkg/utils/jwt"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/types"
	// Add this line if missing
)

func TestAdminHandlerImpl_Index(t *testing.T) {
	// Define a type for the arguments
	type args struct {
		ctx *gin.Context
	}

	mockJwtUtils := mockjwt.NewMockJwtUtils(t)
	var user = &models.User{}
	user.SetRoles("admin")
	mockJwtUtils.EXPECT().GetCurrentUser(mock.Anything).Return(user)

	// Define test cases
	tests := []struct {
		name    string
		i       *AdminHandlerImpl
		args    args
		setup   func() // Setup function to initialize mocks and context
		wantErr bool   // Whether we expect an error
	}{
		{
			name: "Valid currentUser and roles",
			i: &AdminHandlerImpl{
				jwtUtils: mockJwtUtils,
			},
			args: args{
				ctx: func() *gin.Context {
					var globalConfig = types.GlobalConfig{
						ServerBaseUrl: "",
						OnPremise:     true,
						EnableHttps:   true,
					}
					w := httptest.NewRecorder()
					ctx, _ := gin.CreateTestContext(w)
					ctx.Set("Config", globalConfig)
					return ctx
				}(),
			},
			setup:   func() {},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Run the setup function to initialize mocks and context
			if tt.setup != nil {
				tt.setup()
			}

			// Call the method under test
			tt.i.Index(tt.args.ctx)

			// Check if the correct status code is returned
			assert.Equal(t, http.StatusOK, tt.args.ctx.Writer.Status())
		})
	}
}
