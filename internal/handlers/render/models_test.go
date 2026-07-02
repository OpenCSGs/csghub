package renderHandlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	mockRenderBase "opencsg.com/portal/_mocks/opencsg.com/portal/handlers/render"
	"opencsg.com/portal/pkg/types"
)

func TestModelHandlerImpl_List(t *testing.T) {
	mockBase := mockRenderBase.NewMockRenderBase(t)

	mockBase.EXPECT().
		RenderTemplate(mock.Anything, "models_index", mock.Anything).
		Return()

	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Set("Config", types.GlobalConfig{})

	req, _ := http.NewRequest("GET", "/models", nil)
	ctx.Request = req

	handler := &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType:       "models",
			renderBaseInstance: mockBase,
		},
	}

	handler.List(ctx)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestModelHandlerImpl_Detail(t *testing.T) {
	mockBase := mockRenderBase.NewMockRenderBase(t)

	mockBase.EXPECT().
		RenderTemplate(mock.Anything, "models_show", mock.MatchedBy(func(data map[string]interface{}) bool {
			return data["namespace"] == "test-namespace" &&
				data["modelName"] == "test-model" &&
				data["actionName"] == "show" &&
				data["defaultTab"] == "summary"
		})).
		Return()

	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Set("Config", types.GlobalConfig{})

	// Mock route parameters in Gin context
	ctx.Params = gin.Params{
		{Key: "namespace", Value: "test-namespace"},
		{Key: "model_name", Value: "test-model"},
	}

	req, _ := http.NewRequest("GET", "/models/test-namespace/test-model", nil)
	ctx.Request = req

	handler := &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType:       "models",
			renderBaseInstance: mockBase,
		},
	}

	handler.Detail(ctx)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestModelHandlerImpl_New(t *testing.T) {
	mockBase := mockRenderBase.NewMockRenderBase(t)

	mockBase.EXPECT().
		RenderTemplate(mock.Anything, "models_new", mock.MatchedBy(func(data map[string]interface{}) bool {
			_, exists := data["licenses"]
			return exists
		})).
		Return()

	w := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(w)
	ctx.Set("Config", types.GlobalConfig{})

	req, _ := http.NewRequest("GET", "/models/new", nil)
	ctx.Request = req

	handler := &ModelHandlerImpl{
		BaseHandlerImpl{
			resourceType:       "models",
			renderBaseInstance: mockBase,
		},
	}

	handler.New(ctx)

	assert.Equal(t, http.StatusOK, w.Code)
}
