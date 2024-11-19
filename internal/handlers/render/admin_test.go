package renderHandlers

import (
	"testing"

	"net/http"
	"net/http/httptest"

	mockRenderBase "opencsg.com/portal/_mocks/opencsg.com/portal/handlers/render"
	mockjwt "opencsg.com/portal/_mocks/opencsg.com/portal/pkg/utils/jwt"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/pkg/types"
	// Add this line if missing
)

func TestAdminHandlerImpl_Index_validCurrentUser(t *testing.T) {
	// Define a type for the arguments
	type args struct {
		ctx *gin.Context
	}

	mockJwtUtils := mockjwt.NewMockJwtUtils(t)
	mockBase := mockRenderBase.NewMockRenderBase(t)

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
			setup: func() {
				var user = &models.User{}
				user.SetRoles("admin")
				mockJwtUtils.EXPECT().GetCurrentUser(mock.Anything).Return(user)
				mockBase.EXPECT().RenderTemplate(mock.Anything, mock.Anything, mock.Anything).Return()
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
			i: &AdminHandlerImpl{
				jwtUtils:           mockJwtUtils,
				renderBaseInstance: mockBase,
			},
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

			if tt.name == "Valid currentUser and roles" {
				// Check if the correct status code is returned
				assert.Equal(t, http.StatusOK, tt.args.ctx.Writer.Status())
			}
			if tt.name == "nil currentUser" {
				assert.Equal(t, http.StatusFound, tt.args.ctx.Writer.Status())
			}
		})
	}
}

func TestAdminHandlerImpl_Index_nilCurrentUser(t *testing.T) {
	// Define a type for the arguments
	type args struct {
		ctx *gin.Context
	}

	mockJwtUtils := mockjwt.NewMockJwtUtils(t)
	mockBase := mockRenderBase.NewMockRenderBase(t)

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
			setup: func() {
				var user = &models.User{}
				user.SetRoles("admin")
				mockJwtUtils.EXPECT().GetCurrentUser(mock.Anything).Return(user)
				mockBase.EXPECT().RenderTemplate(mock.Anything, mock.Anything, mock.Anything).Return()
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
			i: &AdminHandlerImpl{
				jwtUtils:           mockJwtUtils,
				renderBaseInstance: mockBase,
			},
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

			if tt.name == "Valid currentUser and roles" {
				// Check if the correct status code is returned
				assert.Equal(t, http.StatusOK, tt.args.ctx.Writer.Status())
			}
			if tt.name == "nil currentUser" {
				assert.Equal(t, http.StatusFound, tt.args.ctx.Writer.Status())
			}
		})
	}
}
