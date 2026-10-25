---
project_id: "portfolio"
project_name: "Portfolio"
note_type: "context"
title: "Portfolio — ngữ cảnh dự án"
created_at: "2026-10-26T08:55:00+07:00"
updated_at: "2026-10-26T10:05:00+07:00"
status: "active"
---

# Portfolio — ngữ cảnh dự án

## Purpose and scope

Website giới thiệu dự án cá nhân, có biểu mẫu liên hệ. Công việc hiện tại tập trung vào kiểm tra dữ liệu biểu mẫu.

## Architecture and key files

`src/contact-form.ts` xử lý biểu mẫu; `src/validation.ts` chứa quy tắc kiểm tra dùng chung.

## Development and verification

Trong dự án giả lập, chạy `npm test` để kiểm tra các trường hợp dữ liệu hợp lệ và không hợp lệ.

## Constraints and conventions

Giữ nguyên API của biểu mẫu và không lưu dữ liệu liên hệ cá nhân vào memory.

## Related notes

- Tiến độ mới nhất: [[Projects/Portfolio/CURRENT.md]]
- Các lựa chọn kỹ thuật đã ghi nhận: [[Projects/Portfolio/DECISIONS.md]]
