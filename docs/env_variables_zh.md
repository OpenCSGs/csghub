# 环境变量配置

本文档详细说明了 CSGHub Portal 项目所需的环境变量。您可以根据您的部署环境（SaaS 或私有化部署）选择相应的配置。

## 配置文件

项目提供了两个环境文件模板：

- `.env.example`: 用于 `docker-compose` 或直接通过 `source` 命令加载。
- `.envrc.example`: 用于 `direnv`，在进入项目目录时自动加载。

您可以将其中一个文件复制为 `.env` 或 `.envrc`，并根据您的实际需求修改其中的值。

## 通用配置

| 环境变量 | 类型 | 描述 | 默认值 |
|---|---|---|---|
| `CSGHUB_PORTAL_ON_PREMISE` | 布尔值 | 是否为私有化部署。`true` 表示私有化部署，`false` 表示 SaaS 部署。 | `true` |
| `CSGHUB_PORTAL_SENSITIVE_CHECK` | 布尔值 | 是否开启敏感内容检查。 | `false` |
| `CSGHUB_PORTAL_ENABLE_HTTPS` | 布尔值 | 是否在站点 URL 中强制使用 HTTPS。 | `true` |
| `CSGHUB_PORTAL_SERVER_PORT` | 整数 | Portal 服务的监听端口。 | `8090` |
| `CSGHUB_PORTAL_SUPER_USERS` | 字符串 | 超级管理员用户名列表，多个用户以逗号分隔。 | `""` |

## csghub-server API 配置

| 环境变量 | 类型 | 描述 | 默认值 |
|---|---|---|---|
| `CSGHUB_PORTAL_STARHUB_BASE_URL` | 字符串 | csghub-server 服务的 URL。 | `http://localhost:8080` |
| `CSGHUB_PORTAL_STARHUB_API_KEY` | 字符串 | 用于访问 csghub-server API 的密钥。 | `0c11...` |

## 数据库配置

| 环境变量 | 类型 | 描述 | 默认值 |
|---|---|---|---|
| `CSGHUB_PORTAL_DATABASE_DSN` | 字符串 | 数据库连接字符串（DSN）。 | `postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable` |
| `CSGHUB_PORTAL_DATABASE_DIALECT` | 字符串 | 数据库类型。可选值为 `pg` (PostgreSQL) 或 `sqlite`。 | `pg` |

## S3 存储配置

CSGHub Portal 使用两个 S3 Bucket，一个用于公共文件，一个用于私有文件。

### 公共 S3 Bucket

| 环境变量 | 类型 | 描述 | 默认值 |
|---|---|---|---|
| `CSGHUB_PORTAL_S3_ENDPOINT` | 字符串 | S3 服务的 Endpoint。 | `localhost:9000` |
| `CSGHUB_PORTAL_S3_ENABLE_SSL` | 布尔值 | 是否对 S3 Endpoint 使用 SSL。 | `false` |
| `CSGHUB_PORTAL_S3_REGION` | 字符串 | S3 Bucket 所在的区域。 | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_ID` | 字符串 | S3 访问密钥 ID。 | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET` | 字符串 | S3 访问密钥 Secret。 | `""` |
| `CSGHUB_PORTAL_S3_BUCKET` | 字符串 | 用于存储公共文件的 S3 Bucket 名称。 | `""` |

### 私有 S3 Bucket

| 环境变量 | 类型 | 描述 | 默认值 |
|---|---|---|---|
| `CSGHUB_PORTAL_PRIVATE_S3_ENDPOINT` | 字符串 | 私有 S3 服务的 Endpoint。 | `localhost:9000` |
| `CSGHUB_PORTAL_PRIVATE_S3_ENABLE_SSL` | 布尔值 | 是否对私有 S3 Endpoint 使用 SSL。 | `false` |
| `CSGHUB_PORTAL_PRIVATE_S3_REGION` | 字符串 | 私有 S3 Bucket 所在的区域。 | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_ID` | 字符串 | 私有 S3 访问密钥 ID。 | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_SECRET` | 字符串 | 私有 S3 访问密钥 Secret。 | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_BUCKET` | 字符串 | 用于存储私有文件的 S3 Bucket 名称。 | `""` |

## 身份验证配置

| 环境变量 | 类型 | 描述 |
|---|---|---|
| `CSGHUB_PORTAL_SIGNUP_URL` | 字符串 | 指向外部身份验证提供商的注册页面 URL。 |
| `CSGHUB_PORTAL_LOGIN_URL` | 字符串 | 指向外部身份验证提供商的登录页面 URL。 |