# 迁移到 Gin 版本

首先我们假设，你已经有一个 Rails 版本的 CSGHub Portal 部署好了。

## 拉取最新的仓库，默认使用 Gin 版本

```bash
git fetch origin
git reset --hard origin/main
```

通过这个代码，你可以把本地的 main 分支重置为远程的 main 分支，同时你也会拉取一个名为 'rails-main' 的分支，这个分支中包含了旧的 Rails 版本的代码。

## 部署你的 Gin server
请参考[Setup](setup_en.md) 来部署你的 Gin 服务器。是的，默认情况下 Gin 会使用 8090 端口。

### 数据库设置
你可以通过环境变量 CSGHUB_PORTAL_DATABASE_DSN 来设置数据库连接。你可以使用和 Rails 版本相同的数据库，因为我们已经完成了兼容性考虑。

需要注意的是默认的数据库URL是:“postgresql://postgres:postgres@localhost:5432/starhub_portal?”sslmode=disable"这可能与您的Rails服务器有不同的数据库名称，您可能需要更新它在本地运行。