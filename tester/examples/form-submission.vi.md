---
title: "Form yêu cầu hỗ trợ — E2E Test Cases (ví dụ)"
type: testcase
feature_id: EX-SUPPORT-REQUEST
display_language: vi
status: draft
updated: 2026-10-09
sources: [EX-FORM-AC-01, EX-FORM-AC-02, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01]
---

> **Chỉ mang tính minh họa.** Mọi nguồn, trường, quy tắc, nội dung UI và route `EX-FORM-*` dưới đây đều giả định. `https://support.example.test` là tên miền ví dụ được dành riêng; khi viết testcase thật, thay bằng URL môi trường test đã được duyệt.

# Form yêu cầu hỗ trợ — E2E Test Cases

## Phạm vi và nguồn
- **Mục tiêu / ranh giới E2E:** Thành viên đăng nhập, gửi yêu cầu hỗ trợ qua form nhiều bước và tìm thấy yêu cầu đã lưu trong **Yêu cầu của tôi** sau khi tải lại.
- **Nguồn giả định:** `EX-FORM-AC-01` quy định các trường bắt buộc và trường sản phẩm bị ảnh hưởng có điều kiện; `EX-FORM-AC-02` quy định validation tại chỗ, giữ dữ liệu đã nhập và không tạo request trước khi gửi; `EX-FORM-UI-01` quy định URL/route, nhãn điều hướng/control, luồng Loại yêu cầu → Chi tiết → Xem lại → Xác nhận → Yêu cầu của tôi và nội dung UI đã bản địa hóa; `EX-FORM-API-01` quy định tạo một lần, lưu trữ và danh sách **Yêu cầu của tôi** nhất quán sau khi tải lại; `EX-FORM-SEC-01` quy định tài khoản thành viên giả lập và luồng đăng nhập thành công.
- **Tác nhân / môi trường:** Thành viên giả lập `U-TEST` trong workspace cô lập `WS-TEST`; không dùng dữ liệu cá nhân thật. Base URL ví dụ: `https://support.example.test`.
- **Trạng thái đầu:** `U-TEST` bắt đầu đã đăng xuất và chưa có yêu cầu hỗ trợ.
- **Cleanup / an toàn:** Xóa yêu cầu được tạo sau khi lưu bằng chứng; chỉ dùng dữ liệu giả lập.
- **Ngoài phạm vi:** Tệp đính kèm, loại yêu cầu khác, xử lý của admin, thông báo, validation gọi API trực tiếp và vai trò truy cập khác.

## Các kịch bản E2E

### TC-001 — Gửi yêu cầu hỗ trợ kỹ thuật hợp lệ qua wizard
- **Điều kiện trước:** `U-TEST` tồn tại, có quyền thành viên, bắt đầu đã đăng xuất và chưa có yêu cầu hỗ trợ trước đó.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential). Tiêu đề: `Không thể xuất báo cáo`. Mô tả: `Nút xuất báo cáo báo lỗi với các báo cáo theo tháng.` Loại: `Sự cố kỹ thuật`; sản phẩm bị ảnh hưởng: `Reports`.
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://support.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận `/workspaces/WS-TEST/home` và tài khoản đang đăng nhập là `U-TEST`.
  2. Trong điều hướng, chọn **Trợ giúp** rồi **Yêu cầu mới**; xác nhận `/workspaces/WS-TEST/help/requests/new/type`.
  3. Trong **Loại yêu cầu**, chọn **Sự cố kỹ thuật**, chọn **Tiếp tục** và xác nhận `/workspaces/WS-TEST/help/requests/new/details`.
  4. Trong **Chi tiết**, nhập tiêu đề vào **Tiêu đề yêu cầu**, nhập mô tả vào **Mô tả**, chọn **Reports** trong **Sản phẩm bị ảnh hưởng**, chọn **Tiếp tục** và xác nhận `/workspaces/WS-TEST/help/requests/new/review`.
  5. Trong **Xem lại**, xác nhận các giá trị đã nhập rồi chọn **Gửi yêu cầu** một lần.
  6. Trong **Xác nhận**, ghi lại mã yêu cầu; chọn **Yêu cầu của tôi**, xác nhận `/workspaces/WS-TEST/requests`, mở yêu cầu tương ứng và tải lại `/workspaces/WS-TEST/requests/<request-id>`.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công vào `WS-TEST`. Màn hình xác nhận và chi tiết sau khi tải lại hiển thị cùng một mã yêu cầu, đúng loại, tiêu đề, mô tả và sản phẩm bị ảnh hưởng. **Yêu cầu của tôi** chỉ có đúng một yêu cầu tương ứng.
- **Trace:** EX-FORM-AC-01, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01.
- **Rủi ro / lý do ưu tiên:** Medium — luồng chính từ form đến dữ liệu đã lưu.

### TC-002 — Sửa lỗi thiếu trường có điều kiện mà không mất dữ liệu form
- **Điều kiện trước:** `U-TEST` tồn tại, có quyền thành viên, bắt đầu đã đăng xuất và chưa có yêu cầu hỗ trợ trước đó.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential). Loại: `Sự cố kỹ thuật`; tiêu đề: `Không thể xuất báo cáo`; mô tả: `Nút xuất báo cáo báo lỗi với các báo cáo theo tháng.` Để trống sản phẩm bị ảnh hưởng.
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://support.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận `/workspaces/WS-TEST/home` và tài khoản đang đăng nhập là `U-TEST`.
  2. Chọn **Trợ giúp** → **Yêu cầu mới**; xác nhận `/workspaces/WS-TEST/help/requests/new/type`. Chọn **Sự cố kỹ thuật**, chọn **Tiếp tục** và xác nhận `/workspaces/WS-TEST/help/requests/new/details`.
  3. Trong **Chi tiết**, nhập tiêu đề và mô tả vào các trường có nhãn tương ứng, để trống **Sản phẩm bị ảnh hưởng** rồi chọn **Tiếp tục**.
  4. Xác nhận wizard vẫn ở `/workspaces/WS-TEST/help/requests/new/details` và có thông báo validation. Trong tab thứ hai, truy cập `https://support.example.test/workspaces/WS-TEST/requests`, tải lại và xác nhận danh sách trống; quay lại tab form.
  5. Chọn **Reports** trong **Sản phẩm bị ảnh hưởng**, chọn **Tiếp tục** và xác nhận `/workspaces/WS-TEST/help/requests/new/review`.
  6. Trong **Xem lại**, xác nhận tiêu đề và mô tả ban đầu vẫn còn, rồi chọn **Gửi yêu cầu** một lần.
  7. Trong **Xác nhận**, chọn **Yêu cầu của tôi**, mở yêu cầu mới và tải lại `/workspaces/WS-TEST/requests/<request-id>`.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công vào `WS-TEST`. Ở lần nhấn Tiếp tục đầu tiên, wizard vẫn ở **Chi tiết**, hiển thị `Hãy chọn sản phẩm bị ảnh hưởng.`, đồng thời giữ nguyên tiêu đề và mô tả đã nhập. Khi tải lại **Yêu cầu của tôi** ở tab thứ hai, danh sách vẫn trống trước khi sửa form. Sau khi chọn **Reports**, màn hình Xem lại vẫn giữ dữ liệu; sau khi gửi, **Yêu cầu của tôi** có đúng một yêu cầu sau khi tải lại.
- **Trace:** EX-FORM-AC-01, EX-FORM-AC-02, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01.
- **Rủi ro / lý do ưu tiên:** Medium — validation có điều kiện và giữ state qua các màn hình wizard.
