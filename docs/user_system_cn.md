# 用户系统概述
CSGHub 平台通过对接 Casdoor 实现了用户的登录授权，Casdoor 自身具备单点登录和第三方登录的能力，用户可以方便的进行配置和集成。

## 集成方式
在 csghub-server 的 user service 可以通过如下环境变量的配置进行 Casdoor 的接入：
- STARHUB_SERVER_CASDOOR_CLIENT_ID: ${STARHUB_SERVER_CASDOOR_CLIENT_ID}
- STARHUB_SERVER_CASDOOR_CLIENT_SECRET: ${STARHUB_SERVER_CASDOOR_CLIENT_SECRET}
- STARHUB_SERVER_CASDOOR_ENDPOINT: ${STARHUB_SERVER_CASDOOR_ENDPOINT}
- STARHUB_SERVER_CASDOOR_CERTIFICATE: <casdoor_stg_cert-token_jwt_key.pem>
- STARHUB_SERVER_CASDOOR_ORGANIZATION_NAME: ${STARHUB_SERVER_CASDOOR_ORGANIZATION_NAME}
- STARHUB_SERVER_CASDOOR_APPLICATION_NAME: ${STARHUB_SERVER_CASDOOR_APPLICATION_NAME}

## 特别注意
1. 第三方登录的用户，因为各个集成的第三方系统的差异（可能会没有用户名，或者用户名为中文等情况），这些差异跟我们自身系统不兼容
所以对于第三方登录的用户，我们强制要求用户对用户名进行更新，且只能更新一次
2. 目前 csghub-server 还未完成 casdoor 密码回写的集成，所以系统暂不支持更新用户密码
