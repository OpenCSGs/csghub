package routes

import (
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/config"
	"opencsg.com/portal/frontend"
	frontendHandlers "opencsg.com/portal/internal/handlers/frontend"
	renderHandlers "opencsg.com/portal/internal/handlers/render"
	"opencsg.com/portal/internal/middleware"
	"opencsg.com/portal/internal/models"
	"opencsg.com/portal/internal/svc"
	"opencsg.com/portal/pkg/types"
	"opencsg.com/portal/pkg/utils/jwt"
)

// 全局配置结构体

type HandlersRegistry struct {
	FrontendHandlers *frontendHandlers.FrontendHandlerRegistry
	RenderHandler    *renderHandlers.RenderHandlerRegistry
	// adminHandlers    *adminHandlers.AdminHandlerRegistry
	Config *config.Config
}

func Initialize(svcCtx *svc.ServiceContext) (*gin.Engine, error) {
	g := gin.New()
	// 设置信任网络 []string
	// nil 为不计算，避免性能消耗，上线应当设置
	_ = g.SetTrustedProxies(nil)

	userModel := models.NewUserStore(svcCtx.Db)

	// 注册中间件
	g.Use(gin.Recovery())
	g.Use(middleware.AuthMiddleware(userModel))
	g.Use(middleware.Log())

	frontendHandlers, err := frontendHandlers.NewHandlersRegistry(svcCtx)
	if err != nil {
		return nil, err
	}
	handlersRegistry := &HandlersRegistry{
		FrontendHandlers: frontendHandlers,
		RenderHandler:    renderHandlers.NewHandlersRegistry(svcCtx),
		// AdminHandlers:    adminHandlers.NewHandlersRegistry(svcCtx),
		Config: svcCtx.Config,
	}

	g.HTMLRender = createRender()
	setupStaticRouter(g)
	setupViewsRouter(g, handlersRegistry)
	setupApiRouter(g, handlersRegistry)
	return g, nil
}

// 中间件：注入全局配置
func injectConfig(config types.GlobalConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("Config", config)
		c.Next()
	}
}

// 辅助函数：获取注入的配置
func getConfig(c *gin.Context) types.GlobalConfig {
	return c.MustGet("Config").(types.GlobalConfig)
}

func getCurrentUserInfo(c *gin.Context) (models.User, bool) {
	currentUser := jwt.GetCurrentUser(c)
	if currentUser != nil {
		return *currentUser, true
	}
	return models.User{}, false
}

// 辅助函数：创建模板数据
func createTemplateData(c *gin.Context, extraData map[string]interface{}) gin.H {
	config := getConfig(c)
	currentUser, isLoggedIn := getCurrentUserInfo(c)

	data := gin.H{
		"csghubServer": config.ServerBaseUrl,
		"onPremise":    config.OnPremise,
		"enableHttps":  config.EnableHttps,
		"currentUser":  currentUser,
		"isLoggedIn":   isLoggedIn,
	}

	for k, v := range extraData {
		data[k] = v
	}

	return data
}

func createRender() multitemplate.Renderer {
	viewsFS, err := fs.Sub(frontend.Dist, "dist/src/views")
	if err != nil {
		// 处理错误，例如 panic 或日志记录
		panic(err)
	}

	r := multitemplate.NewRenderer()

	// 定义基础布局文件
	layouts := []string{
		"layouts/base.html",
		"layouts/navbar.html",
		"layouts/footer.html",
	}

	// 定义页面和对应的模板文件
	pages := map[string]string{
		"index":          "home/index.html",
		"models_index":   "models/index.html",
		"models_show":    "models/show.html",
		"datasets_index": "datasets/index.html",
		"datasets_show":  "datasets/show.html",
		"codes_index":    "codes/index.html",
		"codes_show":     "codes/show.html",
		"spaces_index":   "spaces/index.html",
		"spaces_show":    "spaces/show.html",
	}

	// 动态添加模板
	for name, page := range pages {
		files := make([]string, len(layouts)+1)
		copy(files, layouts)
		files[len(layouts)] = page

		tmpl, err := template.ParseFS(viewsFS, files...)
		if err != nil {
			panic(err)
		}
		r.Add(name, tmpl)
	}

	return r
}

func setupViewsRouter(engine *gin.Engine, handlersRegistry *HandlersRegistry) {
	// 创建全局配置实例
	var globalConfig = types.GlobalConfig{
		ServerBaseUrl: handlersRegistry.Config.StarhubServer.BaseURL,
		OnPremise:     handlersRegistry.Config.OnPremise,
		EnableHttps:   handlersRegistry.Config.EnableHttps,
	}
	// 使用中间件注入全局配置
	engine.Use(injectConfig(globalConfig))

	registerHomeRoutes(engine, handlersRegistry)
	registerModelRoutes(engine, handlersRegistry)
	registerDatasetRoutes(engine, handlersRegistry)
	registerCodeRoutes(engine, handlersRegistry)
	registerSpaceRoutes(engine, handlersRegistry)
	registerSessionsRoutes(engine, handlersRegistry)
}

func setupStaticRouter(engine *gin.Engine) {
	dist, _ := fs.Sub(frontend.Dist, "dist")
	imageFolder, _ := fs.Sub(frontend.Dist, "dist/images")
	fileServer := http.FileServer(http.FS(dist))

	engine.Use(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/assets") {
			filePath := strings.TrimPrefix(c.Request.URL.Path, "/")
			if _, err := fs.Stat(dist, filePath); os.IsNotExist(err) {
				// Serve index.html when the file doesn't exist
				c.Request.URL.Path = "/"
			}
			fileServer.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	})

	engine.StaticFS("/images", http.FS(imageFolder))
}

func setupApiRouter(g *gin.Engine, handlersRegistry *HandlersRegistry) {
	internal_api := g.Group("/internal_api")

	internal_api.GET("/ping", handlersRegistry.FrontendHandlers.PingHandler.Ping)
	internal_api.GET("/:locale/settings/locale", handlersRegistry.FrontendHandlers.SettingsHandler.SetLocale)
	internal_api.PUT("/users/jwt_token", handlersRegistry.FrontendHandlers.TokenHandler.RefreshToken)
}
