## Hướng dẫn triển khai CSGHub All-in-One

Script này cho phép triển khai một phiên bản CSGHub all-in-one chỉ với một thao tác, bao gồm tất cả các thành phần liên quan:

* csghub-portal
* csghub-server
* nginx
* postgresql
* git-server
* minio
* casdoor
* account server
* user server
* space builder
* registry


**Lưu ý:**
CSGHub v0.4.0 hỗ trợ chức năng Space, và v0.7.0 hỗ trợ tinh chỉnh (fine-tuning) và suy luận (inference) mô hình. Space, tinh chỉnh và suy luận mô hình đều yêu cầu Kubernetes cùng các môi trường và cấu hình liên quan. Vì Kubernetes không được bao gồm ở đây, bản triển khai All-in-one này `không bao gồm các chức năng Space, tinh chỉnh và suy luận mô hình`.

### Yêu cầu
* Phần cứng

Cấu hình tối thiểu: CPU 2 nhân / RAM 6GB / Ổ cứng 50GB

Cấu hình khuyến nghị: CPU 4 nhân / RAM 16GB / Ổ cứng 500GB

* Phần mềm

Bất kỳ hệ điều hành Linux nào chạy kiến trúc x86_64

Docker Engine (>=5:20.10.24)

### Cách sử dụng
1. Chuyển vào thư mục `all_in_one`.
2. Sửa tệp `.env` và đặt `SERVER_DOMAIN` là địa chỉ IP hoặc tên miền của máy chủ hiện tại. KHÔNG dùng `127.0.0.1` hoặc `localhost`.
3. Có thể bỏ qua các cấu hình liên quan đến space và registry trong .env nếu không có cụm Kubernetes.
4. Chạy script `startup.sh`. Khi tất cả dịch vụ đã khởi động, bạn có thể truy cập dịch vụ CSGHub tự triển khai tại `http://[SERVER_DOMAIN]`.

### Ghi chú
1. CSGHub tự triển khai dùng Docker volume loại local để lưu trữ lâu dài, ví dụ cho PostgreSQL và Minio. Hãy đảm bảo Docker local volume có đủ dung lượng ổ đĩa.
1. Đảm bảo cổng ngoài `2222` của máy chủ có thể truy cập được, vì các thao tác Git qua giao thức SSH phụ thuộc vào cổng này.
1. Đảm bảo cổng ngoài 31001 của máy chủ có thể truy cập được, cổng này được dịch vụ casdoor dùng cho việc đăng ký và đăng nhập người dùng.
1. Có thể truy cập bảng điều khiển Minio qua cổng `9001`. Nếu không cần bảng điều khiển Minio, có thể đóng cổng này.
1. Mặc định, các dịch vụ CSGHub chỉ hỗ trợ giao thức HTTP. Nếu cần HTTPS, hãy tự cấu hình thêm.
1. Không tùy ý sửa hoặc xóa các thư mục `gitdata` và `gitlog`. Đây là các thư mục runtime được mount vào các container dịch vụ liên quan, và chủ sở hữu của chúng phải là `1001`. Việc đổi chủ sở hữu tệp hoặc xóa các thư mục này sẽ gây lỗi khi khởi động.
1. Gỡ bỏ hoàn toàn phiên bản CSGHub bằng các lệnh dưới đây:
```
docker compose -f docker-compose.yml down -v
rm -rf gitdata gitlog
```
