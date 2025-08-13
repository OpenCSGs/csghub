# 迁移到 Gin 版本

首先我们假设，我们假设您已经部署好了一个 Rails 版本的 CSGHub Portal。

## 拉取最新的仓库，默认使用 Gin 版本

```bash
git fetch origin
git reset --hard origin/main
```

通过此代码，您可以将本地的 `main` 分支重置为远程的 `main` 分支，同时还会拉取一个名为 `rails-main 的分支`，其中包含旧的 Rails 版本代码。

## 部署 Gin Server

请参考[该文档](https://github.com/OpenCSGs/csghub/blob/main/docs/setup.md)部署你的 Gin 服务器。默认情况下 Gin 会使用 `8090` 端口。

### 数据库设置

您可以通过环境变量 `CSGHUB_PORTAL_DATABASE_DSN` 来设置数据库连接。可以使用和 Rails 版本相同的数据库，因为我们已完成兼容性处理。  

请注意，默认的数据库 URL 是：  
`postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable`  
这可能与您的 Rails 服务器使用的数据库名称不同，因此您可能需要更新该 URL 以便在本地运行。
