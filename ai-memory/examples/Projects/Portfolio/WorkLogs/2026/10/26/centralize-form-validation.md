---
project_id: "portfolio"
project_name: "Portfolio"
note_type: "worklog"
title: "Chọn quy tắc kiểm tra dùng chung"
created_at: "2026-10-26T09:30:00+07:00"
updated_at: "2026-10-26T09:30:00+07:00"
status: "in-progress"
event_id: "61f13076-4c89-42ad-b6b6-92a72fcb3302"
event_type: "decision"
task_id: "PORT-17"
---

# Chọn quy tắc kiểm tra dùng chung

## Task and outcome

PORT-17: chọn phương án tách quy tắc kiểm tra để tránh khác biệt giữa các luồng biểu mẫu.

## Changes

Chốt phạm vi module `src/validation.ts`; chưa hoàn tất triển khai.

## Verification

Đã đối chiếu các nhánh kiểm tra trong tình huống giả lập; chưa chạy test.

## Decisions

Dùng một module kiểm tra chung, giữ nguyên API biểu mẫu và thông báo lỗi.

## Risks and next step

Tiếp theo: triển khai module, thay các chỗ gọi và kiểm tra dữ liệu trống, email sai định dạng, dữ liệu hợp lệ.

## Related notes

- Tiếp nối kết quả rà soát: [[Projects/Portfolio/WorkLogs/2026/10/26/review-form-validation.md]]
