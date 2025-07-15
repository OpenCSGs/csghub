# Environment Variables Configuration

This document provides a detailed explanation of the environment variables required for the CSGHub Portal project. You can choose the appropriate configuration based on your deployment environment (SaaS or on-premise).

## Configuration Files

The project provides two environment file templates:

- `.env.example`: For use with `docker-compose` or for direct loading via the `source` command.
- `.envrc.example`: For use with `direnv`, which automatically loads variables when you enter the project directory.

You can copy one of these files to `.env` or `.envrc` and modify the values according to your needs.

## General Configuration

| Environment Variable | Type | Description | Default Value |
|---|---|---|---|
| `CSGHUB_PORTAL_ON_PREMISE` | Boolean | Whether it is an on-premise deployment. `true` for on-premise, `false` for SaaS. | `true` |
| `CSGHUB_PORTAL_SENSITIVE_CHECK` | Boolean | Whether to enable sensitive content checking. | `false` |
| `CSGHUB_PORTAL_ENABLE_HTTPS` | Boolean | Whether to force the use of HTTPS in site URLs. | `true` |
| `CSGHUB_PORTAL_SERVER_PORT` | Integer | The listening port for the Portal service. | `8090` |
| `CSGHUB_PORTAL_SUPER_USERS` | String | A comma-separated list of superuser usernames. | `""` |

## csghub-server API Configuration

| Environment Variable | Type | Description | Default Value |
|---|---|---|---|
| `CSGHUB_PORTAL_STARHUB_BASE_URL` | String | The URL of the csghub-server service. | `http://localhost:8080` |
| `CSGHUB_PORTAL_STARHUB_API_KEY` | String | The API key for accessing the csghub-server API. | `0c11...` |

## Database Configuration

| Environment Variable | Type | Description | Default Value |
|---|---|---|---|
| `CSGHUB_PORTAL_DATABASE_DSN` | String | The Data Source Name (DSN) for the database connection. | `postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable` |
| `CSGHUB_PORTAL_DATABASE_DIALECT` | String | The type of database. Possible values are `pg` (PostgreSQL) or `sqlite`. | `pg` |

## S3 Storage Configuration

CSGHub Portal uses two S3 buckets: one for public files and one for private files.

### Public S3 Bucket

| Environment Variable | Type | Description | Default Value |
|---|---|---|---|
| `CSGHUB_PORTAL_S3_ENDPOINT` | String | The endpoint for the S3 service. | `localhost:9000` |
| `CSGHUB_PORTAL_S3_ENABLE_SSL` | Boolean | Whether to use SSL for the S3 endpoint. | `false` |
| `CSGHUB_PORTAL_S3_REGION` | String | The region where the S3 bucket is located. | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_ID` | String | The access key ID for S3. | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET` | String | The secret access key for S3. | `""` |
| `CSGHUB_PORTAL_S3_BUCKET` | String | The name of the S3 bucket for public files. | `""` |

### Private S3 Bucket

| Environment Variable | Type | Description | Default Value |
|---|---|---|---|
| `CSGHUB_PORTAL_PRIVATE_S3_ENDPOINT` | String | The endpoint for the private S3 service. | `localhost:9000` |
| `CSGHUB_PORTAL_PRIVATE_S3_ENABLE_SSL` | Boolean | Whether to use SSL for the private S3 endpoint. | `false` |
| `CSGHUB_PORTAL_PRIVATE_S3_REGION` | String | The region where the private S3 bucket is located. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_ID` | String | The access key ID for the private S3. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_SECRET` | String | The secret access key for the private S3. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_BUCKET` | String | The name of the S3 bucket for private files. | `""` |

## Authentication Configuration

| Environment Variable | Type | Description |
|---|---|---|
| `CSGHUB_PORTAL_SIGNUP_URL` | String | The URL to the signup page of an external authentication provider. |
| `CSGHUB_PORTAL_LOGIN_URL` | String | The URL to the login page of an external authentication provider. |
