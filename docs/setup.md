[English Version](./setup_en.md)

### 通用环境变量
- **RAILS_MASTER_KEY** \
  用于解密 Rails Credentials，当前开源项目的 master key 为：`64f15f995b044427e43fe4897370fd66`

- **ON_PREMISE** \
  一个用于切换项目版本的开关，如果为 true 则是 on premise 版本，否则是非 on premise 版本。目前的主要差别在于，非 on premise 的版本支持的登录方式为 OIDC 的登录授权方式。on premise 版本的登录方式为系统自带的登录授权。

- **SENSITIVE_CHECK** \
  一个用于打开和关闭敏感信息监测的开关，如果为 true 表示打开了敏感信息监测。这个需要同 Starhub Server 协作使用，如果 Starhub Server 开通了支持敏感信息监测的 API 那么我们就可以打开这个开关。

- **SUPER_USERS** \
  你可以通过这个环境变量设置系统的超级管理员用户，设置的方式为逗号分隔的电话号码。这也意味着，在注册的时候需要填写匹配的电话号码。

### System Config(系统配置)
这个是一种进行项目配置的方式，基于一个数据对象 SystemConfig，对应到数据库表 system_configs。针对每个环境使用管理员账号只需要新建一条 SystemConfig 记录。

目前系统支持这些 System Config 字段，他们都是 jsonb 的类型：

当前你可以随时添加更多其他的字段

### 项目依赖
在启动项目之前，请先确保所有的依赖都完成设置

##### 对象存储
项目集成了 S3 的标准接口，可以通过下面的方式进行配置：

  - 环境变量
  - Rails Credentials
  - System Config

支持如下字段(环境变量需大写)：

  - bucket_name
  - endpoint
  - access_id
  - access_secret
  - region

##### Starhub Server
当前项目是 Starhub Client，我们模型数据集等功能都依赖于 Starhub Server 提供的服务。我们可以通过下面的方式进行配置：

  - 环境变量
  - Rails Credentials
  - System Config

支持的字段如下：

  - 环境变量：STARHUB_BASE_URL, STARHUB_TOKEN
  - Credentials/SystemConfig: base_url, token

##### OIDC
如果使用是非 on premise 的版本，即 ON_PREMISE 为 false，那么系统支持的登录授权方式为 OIDC 的方式，可以通过下面的方式进行配置：

  - 环境变量
  - Rails Credentials
  - System Config

环境变量支持的字段如下：

  - OIDC_IDENTIFIER
  - OIDC_SECRET
  - OIDC_REDIRECT_URI
  - OIDC_AUTHORIZATION_ENDPOINT
  - OIDC_TOKEN_ENDPOINT
  - OIDC_USERINFO_ENDPOINT

其他两种方式支持的字段如下：

  - identifier
  - secret
  - redirect_uri
  - authorization_endpoint
  - token_endpoint
  - userinfo_endpoint


### 项目启动步骤

1. 克隆项目代码

```
git clone <项目代码仓库地址>
cd <项目目录>
```

2. 安装依赖

确保你已经安装了Ruby（推荐版本 3.1 或更高）和Node.js（推荐版本 16.0 或更高）。

```
bundle install
yarn install
```

这将安装项目所需的 Ruby 和 JavaScript 依赖项。

3. 配置数据库

```
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
```

这将创建并迁移数据库以及初始化数据，确保你的数据库配置正确。

4. 启动开发服务器

```
bin/dev
```

这将启动 Rails 开发服务器以及 tailwind css 编译，并监听默认的本地开发端口（通常可用 http://localhost:3000 来访问）。


### 系统初始化默认用户

系统会默认创建一个超级用户 `admin001`，密码默认为 `admin001`，可以通过 `http://localhost:3000/admin` 进入后台进行系统配置和管理。

### 多源同步

多源同步为私有化部署的用户提供了从`OpenCSG`社区同步模型和数据集的能力。同步下来的模型和数据集不可修改，除此之外与本地创建的模型和数据集无异。

在正确使用多源同步功能之前，需要先设置2个环境变量。

1. 配置 `STARHUB_SERVER_PUBLIC_DOMAIN` 为 `https://hub.opencsg.com`。
2. 配置 `STARHUB_SERVER_MIRROR_URL` 为 `https://sync.opencsg.com`。

启动 all in one 脚本，稍等片刻，就可以看到 OpenCSG 社区中的模型和数据集了。
项目默认内置了一个只读权限的token，允许浏览`OpenCSG`社区的模型和数据集的`README`内容和文件列表，但无法将模型和数据集下载到本地。如需要具备同步下载功能的token，请通过 [opencsg.com](https://opencsg.com) 官网申请。
