# Ghi chú phát hành

- **[2025.01.15] v1.3.0**
  Thêm quản lý tag trong trang quản trị, chuyển hướng sau khi đăng nhập, và hỗ trợ lọc theo nhiều tag trên trang mô hình, tập dữ liệu và mã nguồn. Giới thiệu cấu hình nhiều proxy đồng bộ qua tệp cấu hình máy chủ, hỗ trợ SGLang để cải thiện hiệu năng engine suy luận, cập nhật image Swift cho tinh chỉnh, và cho phép tạo tập dữ liệu công khai qua API. Tái cấu trúc mã để nâng cao chất lượng và bổ sung thêm kiểm thử để tăng độ ổn định.
- **[2024.12.15] v1.2.0**
  Khắc phục một lỗ hổng bảo mật; tất cả người dùng được khuyến nghị cập nhật. Thêm tính năng đánh giá mô hình để so sánh các mô hình AI, hỗ trợ opencompass và LLM evaluation harness. Với người dùng tự triển khai Kubernetes, cần cài đặt Argo Workflow thủ công để dùng tính năng đánh giá mô hình. Thiết kế lại bố cục giao diện quản trị cho dễ dùng hơn, chuẩn hóa style của các thành phần cho nhất quán, và cải thiện khả năng hiển thị trên thiết bị di động và máy tính. Giới thiệu Thư viện Prompt (Prompt Library) để tạo và quản lý các prompt có thể tái sử dụng trong OpenCSG.
- **[2024.11.15] v1.1.0**
  Cải thiện tính năng đồng bộ đa nguồn với cơ chế xử lý branch mới và callback cho việc gắn tag, cập nhật thông tin và quét. Cải tiến bảng điều khiển quản trị gồm xóa tài khoản người dùng (trừ người sở hữu tổ chức hoặc tài nguyên) và theo dõi tiến độ mirror. Thêm hỗ trợ tinh chỉnh bằng ms-swift và loại repo mới dạng prompt để quản lý prompt và tối ưu tập dữ liệu. Chuyển việc lấy thông tin người dùng sang dịch vụ backend. Sửa lỗi về quyền truy cập tổ chức, cài đặt repo, bộ lọc tag repo và thêm vào bộ sưu tập. Repo nay hỗ trợ các branch không phải mặc định. Thêm thời gian bình luận cho các chủ đề cộng đồng. Hỗ trợ đăng xuất qua /logout.
- **[2024.10.15] v1.0.0**
  Bản phát hành lớn: đưa đồng bộ đa nguồn thành chức năng ổn định, hỗ trợ build docker image cho nền tảng ARM, hỗ trợ chọn khu vực khi tạo Space, tự động xác định loại tài nguyên của mô hình như GPU Nvidia, Huawei Ascend, tự động xây dựng quan hệ giữa repo và runtime framework, hỗ trợ suy luận mô hình bằng NIM, cho phép lọc theo subset và split trong trình xem tập dữ liệu, tự động khởi tạo git access token cho người dùng.
- **[2024.09.15] v0.9.0**
  `CSGHub` portal đã được chuyển sang phiên bản Go, Git server bật hỗ trợ Gitaly theo mặc định. Các tính năng mới gồm 'Collections' (Bộ sưu tập) và trang Resource Console (Bảng điều khiển tài nguyên). Chạy Space, suy luận mô hình và endpoint tinh chỉnh không còn yêu cầu tên miền. Ngoài ra còn có nhiều cải thiện trải nghiệm người dùng và sửa lỗi.
- **[2024.08.15] v0.8.0**
  Bản phát hành lớn: giới thiệu dịch vụ độc lập `user_server` và chuyển việc quản lý người dùng, tổ chức, token từ `CSGHub` sang máy chủ backend `CSGHub-server`; giới thiệu dịch vụ độc lập `starhub_server_runner service` để triển khai thống nhất Application Space, suy luận mô hình và tinh chỉnh. Tăng cường quản lý tài nguyên, đã hỗ trợ nhiều cụm k8s ở các khu vực khác nhau.
- **[2024.07.15] v0.7.0**
  Bản phát hành lớn: hỗ trợ `Đồng bộ đa nguồn` (Multiple Resource Sync) cho mô hình và tập dữ liệu, tinh chỉnh một chạm, đo lường mức sử dụng tài nguyên.
- **[2024.06.21] v0.6.1**
  Sửa lỗi và cải thiện trải nghiệm người dùng.
- **[2024.06.18] v0.6.0**
  Bản phát hành lớn: hỗ trợ endpoint suy luận mô hình `chuyên dụng` (dedicated), hỗ trợ Space `streamlit`, cho phép `thích` (like) repo, cho phép đặt `nhãn ngành` (industry tag) cho repo, cải thiện chi tiết lịch sử git và so sánh khác biệt của commit.
- **[2024.05.14] v0.5.0**
  Cải thiện trải nghiệm Space, tự động xây dựng `quan hệ` giữa các repo (mô hình, tập dữ liệu, mã nguồn và Space), hỗ trợ tải lên nhiều tệp cùng lúc.
- **[2024.04.18] v0.4.0**
  Cho phép chạy `Application Space` (ứng dụng gradio), thêm widget để thử suy luận mô hình, hỗ trợ loại repo mới `Code`, hỗ trợ quản lý thành viên tổ chức, hỗ trợ đăng nhập bằng WeChat.
- **[2024.03.15] v0.3.0**
  Kế hoạch: chỉnh sửa tệp trực tuyến, chỉnh sửa tổ chức, xem trước tập dữ liệu.
- **[2024.02.15] v0.2.0**
  Cải thiện chức năng lưu trữ mô hình và tập dữ liệu, thêm tính năng mời thành viên mới vào tổ chức.
- **[2024.01.15] v0.1.0**
  Phát hành phiên bản Alpha của `CSGHub`, hỗ trợ chức năng quản lý mô hình và tập dữ liệu.
