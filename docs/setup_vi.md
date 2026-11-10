# Hướng dẫn cài đặt và khởi chạy

> [!WARNING]
`CSGHub` Portal đã chuyển web framework từ Rails sang Gin. Nếu trước đây bạn dùng phiên bản Rails, vui lòng tham khảo tài liệu mới nhất về cách [chuyển sang Gin](./migrate_to_gin_version_portal_vi.md).

## Lời cảm ơn

Dự án này được xây dựng dựa trên Rails, Vue3, Tailwind CSS, Administrate, Postgresql, Apache Arrow, DuckDB và GoGin. Chúng tôi xin cảm ơn sự hỗ trợ và đóng góp của các dự án mã nguồn mở này!

## Hướng dẫn cài đặt

### Cài đặt Go

1. Truy cập [trang tải xuống chính thức của Go](https://golang.org/dl/).

2. Tải gói cài đặt Go phù hợp với hệ điều hành của bạn.

3. Làm theo [hướng dẫn cài đặt Go](https://golang.org/doc/install) để cài đặt.

4. Kiểm tra Go đã được cài đặt bằng cách mở cửa sổ dòng lệnh và gõ lệnh sau:

   ```shell
   go version
   ```

   Đảm bảo lệnh in ra phiên bản Go đã cài đặt.

### Cài đặt Node.js và Yarn

1. Truy cập [trang web chính thức của Node.js](https://nodejs.org/).

2. Tải và cài đặt phiên bản LTS (Long Term Support - Hỗ trợ dài hạn) phù hợp với hệ điều hành của bạn.

3. Kiểm tra Node.js đã được cài đặt bằng cách mở cửa sổ dòng lệnh và gõ các lệnh sau:

   ```shell
   node --version
   npm --version
   ```

4. Cài đặt Yarn:

   ```shell
   npm install -g yarn
   ```

5. Kiểm tra Yarn đã được cài đặt:

   ```shell
   yarn --version
   ```

### Thiết lập Go Path

1. Chọn một thư mục làm workspace cho Go (ví dụ: `~/go`).

2. Thêm nội dung sau vào tệp cấu hình shell (ví dụ: `.bashrc` hoặc `.zshrc`) để thiết lập `GOPATH`.

   ```bash
   export GOPATH=$HOME/go
   export PATH=$PATH:$GOPATH/bin
   ```

3. Chạy một trong các lệnh sau để áp dụng thay đổi trong tệp cấu hình.

   ```shell
   source ~/.bashrc
   # hoặc
   source ~/.zshrc
   ```

4. Chạy lệnh sau để kiểm tra `GOPATH` đã được thiết lập đúng.

   ```shell
   go env GOPATH
   ```

   Đảm bảo lệnh in ra thư mục workspace của bạn, ví dụ: `/home/username/go`.

### Thiết lập biến môi trường (Khuyến nghị dùng direnv)

Để biết thêm về các biến môi trường, vui lòng tham khảo [tài liệu biến môi trường](./env_variables_vi.md). Ở đây, chúng tôi khuyến nghị dùng `direnv` để quản lý biến môi trường. Các bước sử dụng `direnv` như sau:

1. Làm theo [tài liệu chính thức của direnv](https://direnv.net/) để cài đặt.

2. Thêm nội dung sau vào tệp cấu hình shell (ví dụ: `.bashrc`, `.zshrc`, v.v.) để cấu hình direnv.

   ```shell
   eval "$(direnv hook bash)"  # nếu dùng bash
   # hoặc
   eval "$(direnv hook zsh)"   # nếu dùng zsh
   ```

   Tải lại tệp cấu hình shell hoặc khởi động lại terminal.

3. Tại thư mục gốc của dự án, chạy lệnh sau để tạo tệp `.envrc`.

   ```shell
   cp .envrc.example .envrc
   ```

4. Chỉnh sửa tệp `.envrc` theo nhu cầu và thiết lập các biến môi trường cần thiết. Ví dụ:

   ```shell
   export CSGHUB_PORTAL_S3_ACCESS_KEY_ID=xxx
   export CSGHUB_PORTAL_S3_ACCESS_KEY_SECRET=yyy
   # Thêm các biến môi trường cần thiết khác
   ```

5. Tại thư mục gốc của dự án, chạy lệnh sau để cho phép direnv tải tệp `.envrc`.

   ```shell
   direnv allow .
   ```

### Cài đặt các phụ thuộc Go

Cài đặt các module Go cần thiết bằng lệnh:

```shell
go mod tidy
```

### Cài đặt Air để tự động tải lại (Live Reloading)

Air là công cụ cho phép tự động tải lại ứng dụng Go khi mã thay đổi. Cài đặt bằng lệnh:

```shell
go install github.com/air-verse/air@latest
```

### Cài đặt các phụ thuộc frontend

Chuyển vào thư mục `frontend` và cài đặt các phụ thuộc bằng Yarn:

```shell
cd frontend
yarn install
```

### Thiết lập cơ sở dữ liệu

1. Tạo một cơ sở dữ liệu mới trong hệ quản trị cơ sở dữ liệu của bạn (khuyến nghị PostgreSQL):

   ```sql
   CREATE DATABASE your_database_name;
   ```

   Thay `your_database_name` bằng tên cơ sở dữ liệu bạn muốn dùng.

2. Cập nhật tệp `.envrc` với thông tin kết nối cơ sở dữ liệu chính xác.

3. Chạy lệnh sau để khởi tạo cơ sở dữ liệu:

   ```shell
   go run cmd/csghub-portal/main.go migration init
   ```

4. Chạy lệnh sau để thực hiện migration cơ sở dữ liệu:

   ```shell
   go run cmd/csghub-portal/main.go migration migrate
   ```

## Hướng dẫn khởi chạy

### Khởi chạy cả frontend và backend

Để khởi chạy đồng thời cả dịch vụ frontend và backend, chạy lệnh sau:

```shell
make
```

### Chỉ khởi chạy frontend

Để chỉ khởi chạy dịch vụ frontend, chạy lệnh sau:

```shell
make run-frontend
```

### Chỉ khởi chạy dịch vụ Go

Để chỉ khởi chạy dịch vụ Go, chạy lệnh sau:

```shell
make run-backend
```

### Khởi chạy bằng VS Code

1. Tạo tệp `.env`:
   - Tại thư mục gốc của dự án, tìm tệp `.env.example`.
   - Sao chép `.env.example` và đổi tên bản sao thành `.env`.
   - Mở tệp `.env` và cấu hình các biến môi trường cần thiết cho môi trường của bạn.

   ```shell
   cp .env.example .env
   ```

2. Chỉnh sửa tệp .env:
   - Mở tệp `.env` bằng trình soạn thảo văn bản.
   - Sửa từng mục cấu hình theo môi trường phát triển và yêu cầu của bạn.
   - Đảm bảo mọi biến môi trường cần thiết đều được thiết lập đúng.

3. Trong VS Code, mở giao diện "Run and Debug" (thường là biểu tượng nút play ở thanh bên).

4. Trong menu thả xuống phía trên, bạn có thể chọn một trong các cấu hình sau:
   - "portal": Khởi chạy máy chủ chính
   - "init": Khởi tạo cơ sở dữ liệu
   - "migrate": Chạy migration cơ sở dữ liệu
   - "rollback": Hoàn tác migration cơ sở dữ liệu

### Build dự án bằng dòng lệnh

1. Build dự án:

   ```shell
   make build
   ```

2. Chạy tệp thực thi:

   ```shell
   ./csghub-portal start server
   ```

### Truy cập ứng dụng

Khi cả hai dịch vụ đã chạy, mở trình duyệt web và truy cập:

[http://localhost:8090](http://localhost:8090)

Tại đây bạn có thể xem và tương tác với ứng dụng.
