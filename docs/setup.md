[English Version](./setup_en.md)

## 安装和启动指南

### 安装 Go

1. 访问 [Go 官方下载页面](https://golang.org/dl/)。

2. 下载适合您操作系统的 Go 安装包。

3. 按照 [Go 安装指南](https://golang.org/doc/install) 进行安装。

4. 安装完成后，打开终端并运行以下命令验证安装：

   ```shell
   go version
   ```

   如果安装成功，您将看到 Go 的版本信息。

### 安装 Node.js 和 Yarn

1. 访问 [Node.js 官方网站](https://nodejs.org/)。

2. 下载并安装适合您操作系统的 LTS（长期支持）版本。

3. 安装完成后，打开终端并运行以下命令验证安装：

   ```shell
   node --version
   npm --version
   ```

4. 安装 Yarn：

   ```shell
   npm install -g yarn
   ```

5. 验证 Yarn 安装：

   ```shell
   yarn --version
   ```

### 设置 Go Path

1. 确定您的工作空间：选择一个目录作为您的 Go 工作空间，例如 `~/go`。

2. 设置 `GOPATH`：将以下内容添加到您的 shell 配置文件中（例如 `.bashrc` 或 `.zshrc`）：

   ```bash
   export GOPATH=$HOME/go
   export PATH=$PATH:$GOPATH/bin
   ```

3. 应用更改：运行以下命令之一以确保配置文件更新生效：

   ```shell
   source ~/.bashrc
   # 或
   source ~/.zshrc
   ```

4. 验证设置：运行以下命令以验证 `GOPATH` 是否正确设置：

   ```shell
   go env GOPATH
   ```

   输出应为您的工作空间目录，例如 `/home/username/go`。

### 设置环境变量（推荐使用 direnv）

1. 安装 direnv：按照 [direnv 官方文档](https://direnv.net/) 的说明进行安装。

2. 配置 direnv：在您的 shell 配置文件（如 `.bashrc`、`.zshrc` 等）中添加以下行：

   ```shell
   eval "$(direnv hook bash)"  # 如果使用 bash
   # 或
   eval "$(direnv hook zsh)"   # 如果使用 zsh
   ```

   重新加载您的 shell 配置文件或重启终端。

3. 创建 .envrc 文件：在项目根目录下，运行：

   ```shell
   cp .envrc.example .envrc
   ```

4. 编辑 .envrc 文件：根据您的需求编辑 `.envrc` 文件，设置必要的环境变量。例如：

   ```shell
   export CSGHUB_PORTAL_S3_ACCESS_KEY_ID=xxx
   export CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET=yyy
   # 添加其他需要的环境变量
   ```

5. 允许 direnv 加载 .envrc 文件：在项目根目录下运行：

   ```shell
   direnv allow .
   ```

### 获取 Go 依赖项

要安装必要的 Go 模块，运行：

```shell
go mod tidy
```

### 安装 Air 用于实时重载

Air 是一个允许 Go 应用程序实时重载的工具。使用以下命令安装：

```shell
go install github.com/cosmtrek/air@latest
```

### 获取前端依赖项

打开 `frontend` 目录并使用 Yarn 安装依赖项：

```shell
cd frontend
yarn install
```

### 设置数据库

1. 创建数据库：在您的数据库管理系统中创建一个新的数据库。推荐使用 PostgreSQL，可以使用以下命令：

   ```sql
   CREATE DATABASE your_database_name;
   ```

   请确保将 `your_database_name` 替换为您想要使用的实际数据库名称。

2. 更新 .envrc 文件：确保您的 `.envrc` 文件中包含正确的数据库连接信息。

3. 初始化数据库：运行以下命令来初始化数据库：

   ```shell
   go run cmd/csghub-portal/main.go migration init
   ```

4. 执行数据库迁移：运行以下命令来执行数据库迁移：

   ```shell
   go run cmd/csghub-portal/main.go migration migrate
   ```

## 启动

### 同时启动前后端服务

要同时启动前后端服务，运行以下命令：

```shell
make
```

### 单独启动前端服务

如果只想启动前端服务，运行以下命令：

```shell
make run-frontend
```

### 单独启动 Go 服务

如果只想启动 Go 服务，运行以下命令：

```shell
make run-backend
```

### 通过 VS Code 启动

1. 启动服务器：选择 "portal" 配置并按 F5 或点击 "Run and Debug"。
2. 初始化数据库：选择 "init" 配置并运行。
3. 执行数据库迁移：选择 "migrate" 配置并运行。
4. 回滚数据库迁移：选择 "rollback" 配置并运行。

### 通过命令行方式编译项目

1. 编译项目：

   ```shell
   make build
   ```

2. 运行编译后的可执行文件：

   ```shell
   ./csghub-portal start server
   ```

### 访问应用程序

当两个服务都运行后，打开您的网页浏览器并访问：

[http://localhost:8090](http://localhost:8090)

这将允许您查看和交互应用程序。

