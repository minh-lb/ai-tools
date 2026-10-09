---
title: "Tạo công việc — E2E Test Case (ví dụ)"
type: testcase
feature_id: EX-TASK-CREATE
display_language: vi
status: draft
updated: 2026-10-09
sources: [EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01]
---

> **Chỉ mang tính minh họa.** Toàn bộ nguồn và quy tắc `EX-*` dưới đây đều giả định. Host `https://tasks.example.test` là tên miền ví dụ được dành riêng; khi viết testcase thật, thay bằng URL môi trường test đã được duyệt.

# Tạo công việc — E2E Test Case

## Phạm vi và nguồn
- **Mục tiêu / ranh giới E2E:** Thành viên workspace đăng nhập, tạo công việc qua form và thấy công việc đã lưu sau khi tải lại danh sách.
- **Nguồn giả định:** `EX-AC-01` quy định validation của form, nội dung UI và giới hạn title 1–80 code point Unicode; `EX-API-01` quy định `POST /api/tasks`, response, lưu trữ và helper test-harness `resetTasks(workspaceId)` đã được duyệt chỉ dùng cho test; `EX-SEC-01` quy định tài khoản thành viên giả lập và luồng đăng nhập thành công; `EX-UI-01` quy định URL, nhãn điều hướng, trường form và nút trong ví dụ.
- **Tác nhân / môi trường:** Thành viên giả lập `U-TEST` trong workspace cô lập `W-TEST`; browser test harness có thể quan sát UI có gửi request tạo hay không. Helper `resetTasks("W-TEST")` của `EX-API-01` chỉ xóa công việc test trong `W-TEST` mà không kết thúc session browser. Base URL test: `https://tasks.example.test` (giả định).
- **Trạng thái đầu:** `U-TEST` bắt đầu đã đăng xuất; workspace không có công việc trước biến thể đầu tiên và được reset về 0 giữa các biến thể.
- **Cleanup / an toàn:** Xóa công việc được tạo sau mỗi lần chạy; không dùng dữ liệu production.
- **Ngoài phạm vi:** Kiểm tra authorization bằng cách gọi API trực tiếp và các test chỉ kiểm tra endpoint thuộc API suite riêng. Suite này bao phủ đăng nhập thành công và tạo công việc, không bao gồm đăng nhập thất bại, vai trò khác, sửa/xóa, retry, concurrency hay NFR.

## Các kịch bản E2E

### TC-001 — Tạo công việc tại các biên độ dài title hợp lệ
- **Điều kiện trước:** Tài khoản `U-TEST` tồn tại, có quyền thành viên workspace và bắt đầu đã đăng xuất. `W-TEST` không có công việc; helper test-only `resetTasks("W-TEST")` trong `EX-API-01` đã được duyệt và giữ nguyên session browser.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential); các title `A` (1 code point), `AB` (2), 79 × `A` (79), và 79 × `A` + `😀` (80).
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://tasks.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận trang chính `/workspaces/W-TEST` và tài khoản đang đăng nhập là `U-TEST`.
  2. Trong điều hướng workspace, chọn **Công việc** rồi **Công việc mới**; xác nhận URL là `/workspaces/W-TEST/tasks/new` và thấy trường **Tiêu đề công việc**.
  3. Tại `/workspaces/W-TEST/tasks/new`, focus **Tiêu đề công việc**, nhập giá trị đầu tiên chính xác rồi chọn **Tạo công việc** một lần.
  4. Chọn **Công việc** để mở `/workspaces/W-TEST/tasks`; tải lại URL và xác nhận có đúng một dòng với title vừa gửi, trạng thái `Open`. Chỉ sau mỗi một trong ba biến thể đầu, gọi helper test-harness test-only `resetTasks("W-TEST")` trong `EX-API-01` để xóa công việc ở `W-TEST`, tải lại `/workspaces/W-TEST/tasks` và xác nhận danh sách trống; sau đó chọn **Công việc** → **Công việc mới**, xác nhận `/workspaces/W-TEST/tasks/new` rồi mới tiếp tục.
  5. Lặp lại bước 3–4 với title kế tiếp trong Dữ liệu kiểm thử; sau title thứ tư/cuối cùng thì không reset để công việc cuối còn lại cho hậu điều kiện.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công vào `W-TEST`. Với mỗi biến thể, trước khi reset (nếu có), danh sách sau khi tải lại có đúng một công việc với title chính xác và trạng thái `Open`; không tạo bản trùng. Sau biến thể cuối, chỉ còn công việc của title cuối trong danh sách.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Rủi ro / lý do ưu tiên:** Medium — luồng chính và các biên hợp lệ dưới/trên.

### TC-002 — Từ chối title trống hoặc chỉ có khoảng trắng
- **Điều kiện trước:** Tài khoản `U-TEST` tồn tại, có quyền thành viên workspace, bắt đầu đã đăng xuất; `W-TEST` không có công việc.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential); các biến thể: để trống title, sau đó nhập đúng ba dấu cách.
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://tasks.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận trang chính `/workspaces/W-TEST` và tài khoản đã đăng nhập.
  2. Chọn **Công việc** → **Công việc mới**; xác nhận URL `/workspaces/W-TEST/tasks/new` và trường **Tiêu đề công việc**.
  3. Với mỗi biến thể, để trống **Tiêu đề công việc** hoặc nhập đúng ba dấu cách, sau đó chọn **Tạo công việc**.
  4. Dùng **Công việc** để mở `/workspaces/W-TEST/tasks`, tải lại trang và kiểm tra danh sách.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công. Với cả hai biến thể, form hiển thị `Vui lòng nhập tiêu đề.`; sau khi tải lại danh sách không có công việc mới và UI không gửi request tạo.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Rủi ro / lý do ưu tiên:** Medium — ngăn tạo công việc không hợp lệ qua luồng người dùng.

### TC-003 — Từ chối title dài hơn giới hạn 1 đơn vị
- **Điều kiện trước:** Tài khoản `U-TEST` tồn tại, có quyền thành viên workspace, bắt đầu đã đăng xuất; `W-TEST` không có công việc.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential); title gồm 80 × `A` + `😀` (81 code point Unicode).
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://tasks.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận trang chính `/workspaces/W-TEST` và tài khoản đã đăng nhập.
  2. Chọn **Công việc** → **Công việc mới**; xác nhận URL `/workspaces/W-TEST/tasks/new` và trường **Tiêu đề công việc**.
  3. Nhập giá trị 81 code point vào **Tiêu đề công việc** rồi chọn **Tạo công việc**.
  4. Dùng **Công việc** để mở `/workspaces/W-TEST/tasks`, tải lại trang và kiểm tra danh sách.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công. Form hiển thị `Tiêu đề không được vượt quá 80 ký tự.`; sau khi tải lại danh sách không có công việc mới và UI không gửi request tạo.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Rủi ro / lý do ưu tiên:** Medium — xác nhận biên không hợp lệ phía trên.
