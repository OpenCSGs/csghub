# Cấu hình biến môi trường

Tài liệu này giải thích chi tiết các biến môi trường cần thiết cho dự án CSGHub Portal. Bạn có thể chọn cấu hình phù hợp với môi trường triển khai của mình (SaaS hoặc tại chỗ/on-premise).

## Tệp cấu hình

Dự án cung cấp hai tệp mẫu cho biến môi trường:

- `.env.example`: Dùng với `docker-compose` hoặc để nạp trực tiếp bằng lệnh `source`.
- `.envrc.example`: Dùng với `direnv`, công cụ sẽ tự động nạp biến khi bạn vào thư mục dự án.

Bạn có thể sao chép một trong hai tệp này thành `.env` hoặc `.envrc` rồi sửa các giá trị theo nhu cầu.

## Cấu hình chung

| Biến môi trường | Kiểu | Mô tả | Giá trị mặc định |
|---|---|---|---|
| `CSGHUB_PORTAL_ON_PREMISE` | Boolean | Có phải triển khai tại chỗ hay không. `true` là triển khai tại chỗ, `false` là SaaS. | `true` |
| `CSGHUB_PORTAL_SENSITIVE_CHECK` | Boolean | Có bật kiểm tra nội dung nhạy cảm hay không. | `false` |
| `CSGHUB_PORTAL_ENABLE_HTTPS` | Boolean | Có bắt buộc dùng HTTPS trong URL của trang hay không. | `true` |
| `CSGHUB_PORTAL_SERVER_PORT` | Integer | Cổng lắng nghe của dịch vụ Portal. | `8090` |
| `CSGHUB_PORTAL_SUPER_USERS` | String | Danh sách tên người dùng quản trị cấp cao (superuser), phân tách bằng dấu phẩy. | `""` |

## Cấu hình API của csghub-server

| Biến môi trường | Kiểu | Mô tả | Giá trị mặc định |
|---|---|---|---|
| `CSGHUB_PORTAL_STARHUB_BASE_URL` | String | URL của dịch vụ csghub-server. | `http://localhost:8080` |
| `CSGHUB_PORTAL_STARHUB_API_KEY` | String | API key để truy cập API của csghub-server. | `0c11...` |

## Cấu hình cơ sở dữ liệu

| Biến môi trường | Kiểu | Mô tả | Giá trị mặc định |
|---|---|---|---|
| `CSGHUB_PORTAL_DATABASE_DSN` | String | Chuỗi nguồn dữ liệu (DSN) để kết nối cơ sở dữ liệu. | `postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable` |
| `CSGHUB_PORTAL_DATABASE_DIALECT` | String | Loại cơ sở dữ liệu. Giá trị có thể là `pg` (PostgreSQL) hoặc `sqlite`. | `pg` |

## Cấu hình lưu trữ S3

CSGHub Portal dùng hai bucket S3: một cho tệp công khai và một cho tệp riêng tư.

### Bucket S3 công khai

| Biến môi trường | Kiểu | Mô tả | Giá trị mặc định |
|---|---|---|---|
| `CSGHUB_PORTAL_S3_ENDPOINT` | String | Endpoint của dịch vụ S3. | `localhost:9000` |
| `CSGHUB_PORTAL_S3_ENABLE_SSL` | Boolean | Có dùng SSL cho endpoint S3 hay không. | `false` |
| `CSGHUB_PORTAL_S3_REGION` | String | Khu vực (region) của bucket S3. | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_ID` | String | Access key ID của S3. | `""` |
| `CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET` | String | Secret access key của S3. | `""` |
| `CSGHUB_PORTAL_S3_BUCKET` | String | Tên bucket S3 dành cho tệp công khai. | `""` |

### Bucket S3 riêng tư

| Biến môi trường | Kiểu | Mô tả | Giá trị mặc định |
|---|---|---|---|
| `CSGHUB_PORTAL_PRIVATE_S3_ENDPOINT` | String | Endpoint của dịch vụ S3 riêng tư. | `localhost:9000` |
| `CSGHUB_PORTAL_PRIVATE_S3_ENABLE_SSL` | Boolean | Có dùng SSL cho endpoint S3 riêng tư hay không. | `false` |
| `CSGHUB_PORTAL_PRIVATE_S3_REGION` | String | Khu vực (region) của bucket S3 riêng tư. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_ID` | String | Access key ID của S3 riêng tư. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_ACCESS_KEY_SECRET` | String | Secret access key của S3 riêng tư. | `""` |
| `CSGHUB_PORTAL_PRIVATE_S3_BUCKET` | String | Tên bucket S3 dành cho tệp riêng tư. | `""` |

## Cấu hình xác thực

| Biến môi trường | Kiểu | Mô tả |
|---|---|---|
| `CSGHUB_PORTAL_SIGNUP_URL` | String | URL trang đăng ký của nhà cung cấp xác thực bên ngoài. |
| `CSGHUB_PORTAL_LOGIN_URL` | String | URL trang đăng nhập của nhà cung cấp xác thực bên ngoài. |
