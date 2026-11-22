# Tester

Dùng `$tester` để viết tài liệu test case E2E, chạy kiểm thử trên luồng thực tế hoặc chẩn đoán test lỗi và flaky. Nếu cần viết test tự động, nêu rõ yêu cầu để agent áp dụng quy trình triển khai của dự án.

| Việc cần làm | Ví dụ yêu cầu |
|---|---|
| Viết test case E2E | “Dùng $tester viết test case thanh toán từ các tiêu chí nghiệm thu đã duyệt. Lưu trong `docs/testcases/`.” |
| Chạy smoke hoặc regression | “Dùng $tester chạy smoke luồng tạo bản nháp trên local bằng runner có sẵn. Kiểm tra dữ liệu sau khi tải lại trang.” |
| Kiểm tra UI hoặc chẩn đoán lỗi | “Dùng $tester xác minh form giữ dữ liệu khi server trả lỗi và tìm nguyên nhân nếu test retry không ổn định.” |
| Viết unit, integration hoặc E2E test | “Dùng $tester viết test cho luồng gửi form. Bao phủ dữ liệu hợp lệ, dữ liệu lỗi, gửi trùng, lỗi khi lưu và retry. Dùng framework hiện có rồi đối chiếu với các ca đã chạy.” |

Agent dùng tiêu chí được duyệt để xác định kết quả mong đợi. Nếu thiếu tiêu chí cho một hành vi, test case tương ứng được đánh dấu `pending-spec`. Khi chạy, báo cáo cần nêu môi trường, lệnh hoặc thao tác, bằng chứng, phần giả lập, kết quả retry và phần chưa kiểm tra. Dùng dữ liệu kiểm thử được phép và giữ thông tin đăng nhập ngoài tài liệu, log và ảnh chụp.

Quy trình nằm trong [SKILL.md](SKILL.md). Hướng dẫn chi tiết mở theo nhu cầu. [Viết test case](references/case-design.md) · [Chạy và chẩn đoán](references/execution/guide.md)
