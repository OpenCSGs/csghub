# Chuyển sang Gitaly

## Tổng quan

Kể từ bản phát hành v0.9.0, Git server đã được chuyển từ `Gitea` sang `Gitaly`. Là một thành phần cốt lõi của GitLab, `Gitaly` tách các thao tác Git ra khỏi ứng dụng `GitLab` và chạy chúng trên một máy chủ chuyên dụng. Dịch vụ dựa trên gRPC này chuyển các thao tác Git tới đúng repository và hỗ trợ triển khai nhiều máy chủ để đảm bảo tính sẵn sàng cao và khả năng mở rộng. Hướng dẫn này sẽ đưa bạn qua các bước chuyển dịch vụ từ `Gitea` sang `Gitaly`.

## Hướng dẫn chuyển đổi

### 1. Chuẩn bị

Trước khi chuyển đổi, hãy đảm bảo:

1. Thư mục lưu trữ repository của Gitea đã được mount và có thể truy cập.
2. Dịch vụ CSGHub đã được tạm dừng để tránh mất dữ liệu trong quá trình chuyển đổi.

### 2. Các bước chuyển đổi

1. Xác định thư mục lưu trữ repository của phiên bản Gitea, ví dụ: `/data/gitdata/git/repositories`.
2. Cập nhật tệp cấu hình Gitaly: tìm mục `[[storage]]` và đặt giá trị `path` là thư mục đã xác định ở Bước 1.
3. Khởi động tất cả dịch vụ CSGHub, sau đó vào container `csghub-server` và chạy lệnh `./starhub git generate-lfs-meta-objects`.

### 3. Xác nhận chuyển đổi thành công

Đăng nhập vào dịch vụ đã cập nhật để kiểm tra các repository đã được chuyển thành công và mọi tệp bên trong vẫn nguyên vẹn.
