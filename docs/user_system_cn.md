# 用户系统概述

我们的开源平台支持两种用户系统的接入方式：
- 平台默认提供一个简单的用户登录授权系统，支持用户注册和登录，但不支持密码修改。
- 通过环境变量或系统配置，可以接入支持 OIDC 的用户登录授权系统。

## 如何切换两种用户登录系统

- 我们提供一个环境变量 `ON_PREMISE`，当其值为 `true` 时，系统将使用内置的用户系统进行用户登录授权验证。
- 当其值为 `false` 时，系统将通过接入外部的 OIDC 系统进行授权登录验证。

## OIDC 配置

所需的 OIDC 相关的配置项如下：

1. 用于建立 OIDC 连接
  - identifier: 客户端ID
  - secret: 客户端密钥
  - authorization_endpoint: 授权接口
  - token_endpoint: 获取 access token 接口
  - userinfo_endpoint: 获取用户信息接口
  - redirect_uri: callback URL

2. 用于登录注册
  - login_url: OIDC 登录入口
  - signup_url: OIDC 注册入口

可以通过两种方式提供 OIDC 配置项：

1. 通过环境变量
- OIDC_IDENTIFIER
- OIDC_SECRET
- OIDC_REDIRECT_URI
- OIDC_AUTHORIZATION_ENDPOINT
- OIDC_TOKEN_ENDPOINT
- OIDC_USERINFO_ENDPOINT
- LOGIN_URL
- SIGNUP_URL

2. 通过管理员后台进行系统设置
