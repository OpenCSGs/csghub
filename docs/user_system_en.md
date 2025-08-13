# User System Overview

Our open-source platform supports two options for integrating user systems:

- By default, the platform includes a simple user login and authorization system, allowing user registration and login, but password changes are not supported.
- Alternatively, you can connect a user system that supports OIDC using environment variables or system configurations.

## Switching Between User Systems

- The `ON_PREMISE` environment variable controls the login system. When set to `true`, the platform uses its built-in user system for login and authorization.
- When set to `false`, the platform connects to an external OIDC system for login and authorization.

## OIDC Configuration

The required OIDC settings include:

1. To establish the OIDC connection:
  - identifier: client ID
  - secret: client secret
  - authorization_endpoint: authorization endpoint
  - token_endpoint: access token endpoint
  - userinfo_endpoint: user information endpoint
  - redirect_uri: callback URL
  - For login and registration:

2. For login and registration:
  - login_url: OIDC login URL
  - signup_url: OIDC registration URL

You can configure OIDC settings in two ways:

1. Using environment variables:

OIDC_IDENTIFIER
OIDC_SECRET
OIDC_REDIRECT_URI
OIDC_AUTHORIZATION_ENDPOINT
OIDC_TOKEN_ENDPOINT
OIDC_USERINFO_ENDPOINT
LOGIN_URL
SIGNUP_URL

2. Configuring system settings in the admin console
