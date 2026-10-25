---
project_id: "portfolio"
project_name: "Portfolio"
note_type: "decisions"
title: "Quyết định kỹ thuật của Portfolio"
created_at: "2026-10-26T09:31:00+07:00"
updated_at: "2026-10-26T09:31:00+07:00"
status: "active"
---

# Quyết định kỹ thuật của Portfolio

## Dùng chung quy tắc kiểm tra biểu mẫu

- Event ID: 61f13076-4c89-42ad-b6b6-92a72fcb3302
- Date: 2026-10-26T09:30:00+07:00
- WorkLog: [[Projects/Portfolio/WorkLogs/2026/10/26/centralize-form-validation.md]]

### Decision and rationale

Đặt quy tắc kiểm tra tại `src/validation.ts`, thay cho các đoạn kiểm tra trùng lặp trong biểu mẫu. Cách này giúp các luồng hiển thị cùng thông báo lỗi mà vẫn giữ API hiện tại.

### Consequences

Các thay đổi quy tắc sau này cần cập nhật tại module dùng chung và bổ sung trường hợp kiểm tra tương ứng.

## Related notes

- Phạm vi dự án áp dụng quyết định: [[Projects/Portfolio/CONTEXT.md]]
