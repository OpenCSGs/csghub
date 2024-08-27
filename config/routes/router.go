package routes

import (
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"opencsg.com/portal/api/handler"
	"opencsg.com/portal/config"
	"opencsg.com/portal/config/middleware"
	"opencsg.com/portal/frontend"
	"opencsg.com/portal/store/database"
)

const (
	viewsPath = "frontend/dist/src/views"
)

// 全局配置结构体
type GlobalConfig struct {
	ServerBaseUrl string
	OnPremise     string
	EnableHttps   string
}

func Initialize() *gin.Engine {
	g := gin.Default()
	// 设置信任网络 []string
	// nil 为不计算，避免性能消耗，上线应当设置
	_ = g.SetTrustedProxies(nil)

	store := database.NewUserStore()

	// 注册中间件
	g.Use(middleware.AuthMiddleware(store))

	g.HTMLRender = createRender()
	setupStaticRouter(g)
	setupViewsRouter(g)
	setupApiRouter(g)
	return g
}

// 中间件：注入全局配置
func injectConfig(config GlobalConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("Config", config)
		c.Next()
	}
}

// 辅助函数：获取注入的配置
func getConfig(c *gin.Context) GlobalConfig {
	return c.MustGet("Config").(GlobalConfig)
}

func getCurrentUserInfo(c *gin.Context) (database.User, bool) {
	currentUser := middleware.GetCurrentUser(c)
	if currentUser != nil {
		return *currentUser, true
	}
	return database.User{}, false
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
	r := multitemplate.NewRenderer()

	// 定义基础布局文件
	layouts := []string{
		filepath.Join(viewsPath, "layouts/base.html"),
		filepath.Join(viewsPath, "layouts/navbar.html"),
		filepath.Join(viewsPath, "layouts/footer.html"),
	}

	// 定义页面和对应的模板文件
	pages := map[string]string{
		"index":          filepath.Join(viewsPath, "home/index.html"),
		"models_index":   filepath.Join(viewsPath, "models/index.html"),
		"models_show":    filepath.Join(viewsPath, "models/show.html"),
		"datasets_index": filepath.Join(viewsPath, "datasets/index.html"),
		"datasets_show":  filepath.Join(viewsPath, "datasets/show.html"),
		"codes_index":    filepath.Join(viewsPath, "codes/index.html"),
		"codes_show":     filepath.Join(viewsPath, "codes/show.html"),
		"spaces_index":   filepath.Join(viewsPath, "spaces/index.html"),
		"spaces_show":    filepath.Join(viewsPath, "spaces/show.html"),
	}

	// 动态添加模板
	for name, page := range pages {
		files := append(layouts, page)
		r.AddFromFiles(name, files...)
	}

	return r
}

func setupViewsRouter(engine *gin.Engine) {
	// 创建全局配置实例
	var globalConfig = GlobalConfig{
		ServerBaseUrl: config.Env("STARHUB_INNER_BASE_URL", "https://hub.opencsg-stg.com").(string),
		OnPremise:     config.Env("ON_PREMISE", "false").(string),
		EnableHttps:   config.Env("ENABLE_HTTPS", "false").(string),
	}
	// 使用中间件注入全局配置
	engine.Use(injectConfig(globalConfig))

	registerHomeRoutes(engine)
	registerModelRoutes(engine)
	registerDatasetRoutes(engine)
	registerCodeRoutes(engine)
	registerSpaceRoutes(engine)
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

func setupApiRouter(g *gin.Engine) {
	internal_api := g.Group("/internal_api")

	{
		internal_api.GET("/ping", handler.Ping)
	}

	{
		internal_api.GET("/:locale/settings/locale", handler.SetLocale)
	}
}
