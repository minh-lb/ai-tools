# Nguồn sự thật, căn cứ và giả định

## Thứ tự thu thập

1. Yêu cầu, phạm vi và các điều chỉnh mới nhất của người dùng.
2. File/ticket/schema/API spec/code/test đã trực tiếp kiểm tra.
3. Quy ước, ADR và chuẩn dự án đã cung cấp.
4. Giả định có nhãn, chỉ khi thiếu dữ kiện không ngăn cản việc viết hữu ích.

## Phân loại từng claim

| Nhãn | Khi nào dùng | Cách viết |
|---|---|---|
| `Đã xác minh` | Có căn cứ quan sát được từ nguồn | Gắn source/path/section khi có thể |
| `Được yêu cầu` | Người dùng đặt mục tiêu trong tương lai | Viết như yêu cầu, không như behavior hiện có |
| `Giả định` | Điều kiện giả định để soạn thảo | Nêu giả định, hậu quả nếu sai |
| `Chưa xác định` | Thiếu quyết định quan trọng | Nêu câu hỏi cụ thể và tác động |

**As-is** (mô tả hiện trạng): chỉ khẳng định từ code/nguồn đã đọc. **To-be** (đặc tả mong muốn): viết như kỳ vọng, không nói đã triển khai.

## Quy tắc không bịa

- Không chế path/file/module, migration name, command, endpoint, status, SLA hoặc tính năng hiện có.
- Các tình huống minh họa phải có nhãn **Ví dụ giả định**, không dùng làm contract thực tế.
- Nếu thiếu nhiều thông tin: viết phần có cơ sở, gom open questions; chỉ hỏi lại khi không thể tạo đầu ra có ích mà không đoán sai phần cốt lõi.
- Khi ghi `Verified` hoặc `Passed`, phải có bằng chứng; `Proposed`, `Not inspected`, `Not run` không phải thất bại.
