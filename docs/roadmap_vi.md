# Lộ trình phát triển

[English Version](./roadmap_en.md)

- **Quản lý tài sản**
  - [x] Quản lý mô hình: Hỗ trợ cả giao thức Git và giao diện web, cho phép quản lý phiên bản theo branch và kiểm soát truy cập.
  - [x] Quản lý tập dữ liệu: Hỗ trợ cả giao thức Git và giao diện web, cho phép quản lý phiên bản theo branch và kiểm soát truy cập.
  - [x] Hỗ trợ tệp lớn: Hỗ trợ giao thức Git Large File Storage (LFS) và lưu trữ trên Dịch vụ Lưu trữ Đối tượng (OSS).
  - [x] Repo mã nguồn: Chức năng quản lý repo mã nguồn tích hợp sẵn, cho phép liên kết mã nguồn với mô hình, tập dữ liệu và ứng dụng Space.
  - [x] Đồng bộ đa nguồn: Hỗ trợ cấu hình và bật repository từ xa để tự động đồng bộ dữ liệu, hỗ trợ các nguồn từ xa như Cộng đồng OpenCSG ChuanShen và Huggingface.
  - [x] Chỉnh sửa trực tuyến: Mô hình, tập dữ liệu và repo mã nguồn có thể được tải lên, tải xuống, chỉnh sửa hoặc xóa qua giao diện web, có hỗ trợ commit thay đổi.
  - [x] Trình xem tập dữ liệu trực tuyến: Công cụ xem tập dữ liệu trên web, hỗ trợ xem metadata và TopN dữ liệu của tập dữ liệu ở nhiều định dạng.
- **Tăng cường năng lực LLM**
  - [x] Xem trước tập dữ liệu: Hỗ trợ xem trước dữ liệu trong tập dữ liệu.
  - [x] Tinh chỉnh một chạm: Hỗ trợ tích hợp với OpenCSG llm-finetune, cho phép bắt đầu huấn luyện tinh chỉnh mô hình chỉ với một thao tác.
  - [x] Suy luận một chạm: Hỗ trợ tích hợp với OpenCSG llm-inference, cho phép khởi chạy dịch vụ suy luận mô hình chỉ với một thao tác.
  - [ ] Chuyển đổi định dạng dữ liệu: Chuyển đổi các định dạng mô hình và tập dữ liệu phổ biến, hỗ trợ cấu hình quy tắc chuyển đổi định dạng tự động.
  - [ ] Asset Copilot: Xây dựng Copilot quản lý tài sản, hỗ trợ truy vấn và quản lý tài sản bằng ngôn ngữ tự nhiên qua Chatbot hoặc API.
- **Ứng dụng và tính năng doanh nghiệp**
  - [x] Kiểm soát truy cập: Hỗ trợ thiết lập quyền cho dự án riêng tư và công khai, áp dụng cho cả tài khoản tổ chức và cá nhân.
  - [x] App Space: Hỗ trợ lưu trữ ứng dụng Gradio/Streamlit và xuất bản chúng lên khu vực ứng dụng Space.
  - [x] Kiểm soát truy cập chi tiết: Thiết lập phân quyền và kiểm soát truy cập chi tiết, phù hợp với kiến trúc doanh nghiệp.
- **Bảo mật và tuân thủ**
  - [x] Tương thích Git: Hỗ trợ tích hợp với Gitea Server.
  - [x] Thiết kế bảo mật: Có cơ chế xác thực giao diện và hỗ trợ triển khai riêng tư.
  - [x] Bộ chuyển đổi GitServer tổng quát: Bộ chuyển đổi GitServer đa năng, hỗ trợ nhiều backend Git repository phổ biến thông qua mẫu adaptor.
  - [x] Siêu dữ liệu tài sản: Cơ chế quản lý siêu dữ liệu (metadata) tài sản, hỗ trợ loại metadata tùy chỉnh và quy tắc AutoTag tương ứng.
  - [ ] Truy vết tuân thủ: Truy vết và xác minh tính tuân thủ của mô hình và giấy phép.
  - [ ] Xác minh toàn vẹn dữ liệu: Xác minh tính toàn vẹn của dữ liệu.
