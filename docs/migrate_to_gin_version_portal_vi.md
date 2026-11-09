# Chuyển sang phiên bản Gin

Trước tiên, giả sử bạn đã triển khai sẵn CSGHub Portal phiên bản Rails.

## Lấy mã mới nhất của phiên bản Gin

```bash
git fetch origin
git reset --hard origin/main
```

Lệnh này đặt lại branch `main` cục bộ của bạn cho khớp với branch `main` trên remote (mã mới nhất trên remote sẽ ghi đè lên branch `main` cục bộ). Ngoài ra, nó cũng tải về branch `rails-main`, nơi bạn có thể xem mã của phiên bản Rails cũ.

## Triển khai máy chủ Gin

Tham khảo [tài liệu này](./setup_vi.md) để triển khai máy chủ Gin. Mặc định, Gin chạy trên cổng `8090`.

### Cấu hình cơ sở dữ liệu

Bạn có thể thiết lập URL cơ sở dữ liệu qua biến môi trường `CSGHUB_PORTAL_DATABASE_DSN`. Có thể dùng chung cơ sở dữ liệu với phiên bản Rails vì vấn đề tương thích đã được xử lý.

Lưu ý URL cơ sở dữ liệu mặc định là:  
`postgresql://postgres:postgres@localhost:5432/starhub_portal?sslmode=disable`  
URL này có thể khác với tên cơ sở dữ liệu mà máy chủ Rails của bạn đang dùng, nên bạn có thể cần cập nhật lại URL cho phù hợp.
