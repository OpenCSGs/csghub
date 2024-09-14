# 迁移到 Gitaly 

## 前言

在 Release v0.9.0 中，我们将原有的 Git server 由 `Gitea` 迁移到了 `Gitaly`。`Gitaly` 是 `GitLab` 的一个组件，它将 Git 操作从 `GitLab` 应用程序中移出，并运行在单独的服务器上。`Gitaly` 是一个 gRPC 服务，它将 Git 操作委托给 Git 存储库。`Gitaly` 可以在多个服务器上运行，以实现高可用性和可扩展性。在迁移到 `Gitaly` 后，将获得更好的性能和更高的扩展性。此文档将帮助你从 `Gitea` 版的服务迁移到 `Gitaly` 版的服务。


## 迁移步骤

### 1. 准备工作

在开始迁移之前，需要确保以下几点：

1. Gitee 版服务的仓库存储目录已经挂载在了磁盘上，并且能够被访问。
2. CSGHub 服务已经不再接受任何请求，避免数据迁移中出现数据丢失。

### 2. 迁移步骤

1. 获取 Gitee 版服务的仓库存储目录，例如： `/data/gitdata/git/repositories`。
2. 将该目录配置到 gitaly 配置文件中，在gitaly 配置文件中找到 [[storage]] 项，配置 path 值为第 1 步中的目录。
3. 启动 CSGHub 所有服务，进入 csghub-server 容器，执行 `./starhub git generate-lfs-meta-objects`。

### 3. 验证迁移结果

登录新版的服务，查看仓库是否已经成功迁移，并且仓库中的文件是否完整。