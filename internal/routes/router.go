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

	userModel := models.NewUserStore()

	// 注册中间件
	g.Use(gin.Recovery())
	g.Use(middleware.AuthMiddleware(userModel))
	g.Use(middleware.Log())

	frontendHandlers, err := frontendHandlers.NewHandlersRegistry(svcCtx)
	if err != nil {
		return nil, err
	}

	renderHandler, err := renderHandlers.NewHandlersRegistry(svcCtx)
	if err != nil {
		return nil, err
	}
	handlersRegistry := &HandlersRegistry{
		FrontendHandlers: frontendHandlers,
		RenderHandler:    renderHandler,
		// AdminHandlers:    adminHandlers.NewHandlersRegistry(svcCtx),
		Config: svcCtx.Config,
	}

	g.HTMLRender = createRender()
	setupStaticRouter(g)
	setupApiRouter(g, handlersRegistry)
	setupViewsRouter(g, handlersRegistry)
	return g, nil
}

// 中间件：注入全局配置
func injectConfig(config types.GlobalConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("Config", config)
		c.Next()
	}
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
		"errors_404":          "errors/404.html",
		"errors_401":          "errors/unauthorized.html",
		"errors_login_failed": "errors/login_failed.html",

		"index":                          "home/index.html",
		"models_index":                   "models/index.html",
		"models_show":                    "models/show.html",
		"models_new":                     "models/new.html",
		"datasets_index":                 "datasets/index.html",
		"datasets_show":                  "datasets/show.html",
		"datasets_new":                   "datasets/new.html",
		"codes_index":                    "codes/index.html",
		"codes_show":                     "codes/show.html",
		"codes_new":                      "codes/new.html",
		"spaces_index":                   "spaces/index.html",
		"spaces_show":                    "spaces/show.html",
		"spaces_new":                     "spaces/new.html",
		"endpoints_show":                 "endpoints/show.html",
		"endpoints_new":                  "endpoints/new.html",
		"finetunes_show":                 "finetunes/show.html",
		"finetunes_new":                  "finetunes/new.html",
		"resource_console_index":         "resource-console/index.html",
		"organizations_show":             "organizations/show.html",
		"organizations_new":              "organizations/new.html",
		"organizations_settings":         "organizations/settings.html",
		"collections_index":              "collections/index.html",
		"collections_show":               "collections/show.html",
		"collections_new":                "collections/new.html",
		"profile":                        "profile/profile.html",
		"profile_likes":                  "profile/likes.html",
		"settings_profile":               "settings/profile.html",
		"settings_access_token":          "settings/access_token.html",
		"settings_starship_access_token": "settings/starship_access_token.html",
		"settings_sync_access_token":     "settings/sync_access_token.html",
		"settings_ssh_keys":              "settings/ssh_keys.html",
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

	adminLayouts := []string{
		"admin/layouts/base.html",
	}

	adminPages := map[string]string{
		"admin_index": "admin/index.html",
	}

	for name, page := range adminPages {
		files := make([]string, len(adminLayouts)+1)
		copy(files, adminLayouts)
		files[len(adminLayouts)] = page

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

	registerErrorRoutes(engine, handlersRegistry)
	registerHomeRoutes(engine, handlersRegistry)
	registerModelRoutes(engine, handlersRegistry)
	registerDatasetRoutes(engine, handlersRegistry)
	registerCodeRoutes(engine, handlersRegistry)
	registerSpaceRoutes(engine, handlersRegistry)
	registerEndpointRoutes(engine, handlersRegistry)
	registerFinetuneRoutes(engine, handlersRegistry)
	registerSessionsRoutes(engine, handlersRegistry)
	registerOrganizationRoutes(engine, handlersRegistry)
	registerCollectionRoutes(engine, handlersRegistry)
	registerProfileRoutes(engine, handlersRegistry)
	registerSettingRoutes(engine, handlersRegistry)
	registerResourceConsoleRoutes(engine, handlersRegistry)
	registerAdminRoutes(engine, handlersRegistry)
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
	internal_api.POST("/upload", handlersRegistry.FrontendHandlers.UploadHandler.Create)

	resolve_group := g.Group("")
	resolve_group.GET("/:repo_type/:namespace/:name/resolve/:branch/*path", handlersRegistry.FrontendHandlers.ResolveHandler.Resolve)
}
