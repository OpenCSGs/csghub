## 安装

### 设置 Go Path（如果已完成此设置，可以跳过此步骤）

Go 使用 `GOPATH` 环境变量来指定工作空间位置。以下是设置方法：

#### 1. 确定您的工作空间

选择一个目录作为您的 Go 工作空间，例如 `~/go`。

#### 2. 设置 `GOPATH`

将以下内容添加到您的 shell 配置文件中（例如 `.bashrc` 或 `.zshrc`）：

```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

#### 3. 应用更改

应用更改以确保配置文件更新生效：

```shell
source ~/.bashrc
```

或

```shell
source ~/.zshrc
```

#### 4. 验证设置

运行以下命令以验证 `GOPATH` 是否正确设置：

```shell
go env GOPATH
```

输出应为您的工作空间目录，例如 `/home/username/go`。

### 设置环境变量

在项目根目录下，根据 `.env.example` 文件创建 `.env` 文件，并根据需要修改其中的配置。

```shell
cp .env.example .env
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

## 启动

### 启动前端服务

要启动前端服务，运行以下命令：

```shell
cd frontend
yarn dev_build
```

### 启动 Go 服务

在项目根目录打开一个新的终端标签，并使用 Air 启动 Go 服务：

```shell
air
```

### 访问应用程序

当两个服务都运行后，打开您的网页浏览器并访问：

[http://localhost:8090](http://localhost:8090)

这将允许您查看和交互应用程序。