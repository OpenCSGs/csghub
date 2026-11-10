# Tổng quan về hệ thống người dùng

Nền tảng mã nguồn mở của chúng tôi hỗ trợ hai cách tích hợp hệ thống người dùng:

- Mặc định, nền tảng có sẵn một hệ thống đăng nhập và phân quyền người dùng đơn giản, cho phép đăng ký và đăng nhập, nhưng không hỗ trợ đổi mật khẩu.
- Ngoài ra, bạn có thể kết nối một hệ thống người dùng hỗ trợ OIDC thông qua biến môi trường hoặc cấu hình hệ thống.

## Chuyển đổi giữa các hệ thống người dùng

- Biến môi trường `ON_PREMISE` điều khiển hệ thống đăng nhập. Khi đặt là `true`, nền tảng dùng hệ thống người dùng tích hợp sẵn để đăng nhập và phân quyền.
- Khi đặt là `false`, nền tảng kết nối tới một hệ thống OIDC bên ngoài để đăng nhập và phân quyền.

## Cấu hình OIDC

Các thiết lập OIDC cần có gồm:

1. Để thiết lập kết nối OIDC:
  - identifier: client ID
  - secret: client secret
  - authorization_endpoint: endpoint cấp quyền
  - token_endpoint: endpoint lấy access token
  - userinfo_endpoint: endpoint thông tin người dùng
  - redirect_uri: URL callback

2. Để đăng nhập và đăng ký:
  - login_url: URL đăng nhập OIDC
  - signup_url: URL đăng ký OIDC

Bạn có thể cấu hình OIDC theo hai cách:

1. Dùng biến môi trường:

OIDC_IDENTIFIER
OIDC_SECRET
OIDC_REDIRECT_URI
OIDC_AUTHORIZATION_ENDPOINT
OIDC_TOKEN_ENDPOINT
OIDC_USERINFO_ENDPOINT
LOGIN_URL
SIGNUP_URL

2. Cấu hình trong phần cài đặt hệ thống của trang quản trị (admin console)
