Đóng góp cho CSGHub
=======================

[English Version](./CONTRIBUTING_en.md)

Chào mừng bạn đến với CSGHub và cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án!

CSGHub là nền tảng quản lý tài sản mô hình lớn mã nguồn mở và đáng tin cậy. Dự án hướng tới việc hỗ trợ người dùng quản trị các tài sản như tập dữ liệu, tệp mô hình và mã nguồn trong suốt vòng đời của LLM (Mô hình Ngôn ngữ Lớn) và ứng dụng LLM. CSGHub cung cấp chức năng tương tự một phiên bản Huggingface riêng tư, và quản lý tài sản LLM theo cách tương tự như OpenStack Glance quản lý ảnh máy ảo, Harbor quản lý container image và Sonatype Nexus quản lý artifact.

Quy trình đóng góp
----------------------

Để đóng góp cho dự án, vui lòng làm theo quy trình "fork và pull request". Vui lòng không push trực tiếp lên repository chính trừ khi bạn là maintainer.

1. Fork repository từ GitHub (https://github.com/OpenCSGs/csghub) về tài khoản GitHub của bạn.
2. Thực hiện các thay đổi và cải tiến mong muốn trong repository đã fork.
3. Tạo một branch mới trong repository đã fork để chứa các thay đổi của bạn. Nên tạo branch dựa trên branch `main`.
4. Thực hiện các chỉnh sửa và cải tiến cần thiết trên branch mới.
5. Khi đã hoàn tất, gửi một Pull Request (PR) vào branch `main` của repository gốc.
6. Maintainer sẽ review PR của bạn, đưa ra phản hồi và trao đổi với bạn.
7. Sau khi đã chỉnh sửa và thảo luận cần thiết, PR của bạn sẽ được merge vào branch `main`.

Hãy đảm bảo đóng góp của bạn tuân thủ các nguyên tắc sau:

- Giữ phong cách code nhất quán với dự án.
- Tính năng mới hoặc cải tiến nên có kiểm thử (test) phù hợp.
- Tài liệu được thêm hoặc chỉnh sửa cần rõ ràng, dễ hiểu để các nhà phát triển khác dễ sử dụng.

Báo cáo lỗi và đề xuất
----------------------

Nếu bạn gặp lỗi, có đề xuất cải tiến hoặc muốn yêu cầu tính năng mới, vui lòng báo cáo trên trang [Issues](https://github.com/OpenCSGs/csghub/issues). Chúng tôi thường xuyên xem xét và phản hồi ý kiến của bạn.

Khi báo cáo lỗi hoặc đưa ra đề xuất, vui lòng tuân theo các nguyên tắc sau:

- Cung cấp càng nhiều chi tiết càng tốt. Mô tả rõ điều gì đang sai, sai như thế nào và có thông báo lỗi nào không. Một mô tả kiểu "XY không chạy" không giúp ích cho việc khắc phục sự cố. Luôn đính kèm đoạn code bạn đã chạy và, nếu có thể, trích ra phần liên quan thay vì đưa toàn bộ script. Điều này giúp chúng tôi tái hiện lỗi.
- Nếu cần đính kèm khối code dài, log hoặc traceback, hãy bọc chúng trong thẻ `<details>` và `</details>`. Cách này giúp thu gọn nội dung, khiến issue dễ đọc và dễ theo dõi hơn. Xem [liên kết này](https://developer.mozilla.org/en/docs/Web/HTML/Element/details) để biết thêm về cách thu gọn nội dung.

Nhãn của Issue
----------------------

Để xem tổng quan hệ thống nhãn chúng tôi dùng để gắn cho issue và pull request, vui lòng tham khảo [trang này](https://github.com/OpenCSGs/csghub/labels).


Phát triển cục bộ
----------------------

Bạn có thể phát triển CSGHub bằng [Docker Compose](all_in_one_readme_vi.md) hoặc [môi trường cục bộ](setup_vi.md) của mình.

Cảm ơn bạn đã đóng góp cho dự án CSGHub! Chúng tôi rất mong nhận được sự tham gia và góp ý của bạn.
