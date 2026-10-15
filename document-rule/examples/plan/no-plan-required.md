# Simple Bug Fix — Không tạo file Implementation Plan (ví dụ giả định)

## Yêu cầu

> "Sửa lỗi validation message ở trang đăng nhập: khi email sai định dạng thì hiển thị `Email không hợp lệ`."

## Điều kiện minh họa sau khi kiểm tra source

- Chỉ cần sửa một nhánh mapping thông báo và test hiện có.
- Không đổi API contract, schema, authorization hoặc hành vi nghiệp vụ khác.
- Đã xác định được cách tái hiện và test kiểm chứng.

## Quyết định

**Không tạo** `implementation-plan.md`, `plan.md` hay file Spec/Plan. Không yêu cầu phê duyệt Plan trước khi sửa. Thực hiện trực tiếp phần thay đổi đã được yêu cầu và chạy targeted test.

## Phản hồi sau thực thi (mẫu, không phải kết quả thực tế)

- Đã chỉnh validation message để email sai định dạng hiển thị `Email không hợp lệ`.
- Kiểm chứng: báo **lệnh và kết quả thật sự đã chạy**; nếu chưa chạy, ghi rõ `Chưa chạy`.
- Nếu phát hiện tác động đến contract hoặc nhiều nơi dùng chung, đánh giá lại phạm vi trước khi tiếp tục.

> Đây là **ví dụ giả định về cách quyết định**. Không khẳng định đã đọc/sửa repo hay chạy test nào.

## So sánh

- User chỉ yêu cầu **fix bug nhỏ** → không có file Plan.
- User yêu cầu **"Viết Plan để fix bug này"** → có Plan ngắn, ví dụ [Small Change Plan](small-change-plan.md).
