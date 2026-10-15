---
id: 0ade984b-26a1-49e8-be74-cad82634c4f0
title: Tắt feature flag hoạt động lỗi — Runbook (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, runbook, vi]
---
# Tắt Feature Flag hoạt động lỗi — Runbook (ví dụ giả định)

> **Ví dụ giả định, không thể chạy trực tiếp — không phải procedure production.** Ví dụ cố ý không cung cấp flag key, target scope, metric/threshold, dashboard hay control command thật. Chỉ điền Readiness Gate từ nguồn system đã được duyệt; nếu thiếu hoặc chưa verify bất kỳ giá trị bắt buộc nào, dừng và không thực thi.

## Trigger và Preconditions

- Trigger: error rate của feature đã xác định vượt alert threshold được verify trong evaluation window đã cấu hình.
- Preconditions: xác nhận có thể tắt flag mà không mất dữ liệu; có quyền phù hợp và audit channel hợp lệ.
- **WARNING:** tắt flag không khôi phục dữ liệu đã ghi; nếu feature có migration, dùng recovery plan riêng.

## Readiness Gate

Trước khi thực thi, ghi lại và verify các thông tin sau từ nguồn đã được duyệt:

- Feature flag key, environment và target scope chính xác: `<giá trị đã verify>`.
- Error metric, threshold, evaluation window và dashboard/query: `<giá trị đã verify>`.
- Control-plane/CLI action được duyệt và permission cần có: `<procedure đã verify>`.
- Sample request an toàn và signal quan sát được để xác nhận old code path: `<check đã verify>`.
- Recovery procedure và on-call contact phụ trách: `<source/contact đã verify>`.

Nếu bất kỳ giá trị nào còn trống, unknown hoặc chưa verify, không thực thi ví dụ này.

## Procedure

1. **Action:** xác nhận flag tương ứng với feature và affected scope.  
   **Expected:** mapping flag ↔ behavior được xác minh.  
   **Verify:** kiểm tra config và tài liệu đã được duyệt.
2. **Action:** chỉ dùng control action đã duyệt trong Readiness Gate để tắt flag đã verify cho đúng target scope.  
   **Expected:** flag chỉ bị tắt trong scope đó.  
   **Verify:** đọc lại trạng thái flag và chạy sample request an toàn đã verify; xác nhận request đi theo old code path.
3. **Action:** theo dõi metric đã nêu trên dashboard đã verify trong trọn một evaluation window đã cấu hình.  
   **Expected:** error rate thấp hơn threshold được duyệt và không có data-integrity warning mới.  
   **Verify:** lưu kết quả dashboard/query và audit entry; đối chiếu baseline đã verify.

## Completion và Stop / Recovery

Chỉ hoàn tất khi flag readback xác nhận đúng target scope đã bị tắt, sample request đi theo old path và error rate thấp hơn threshold được duyệt trong trọn một evaluation window; ghi lại evidence và audit entry. Nếu không verify được flag/scope, disable action thất bại hoặc metric không hồi phục, dừng và làm theo incident/recovery procedure đã verify cùng on-call operator phụ trách. Không đoán flag/command hoặc bật lại feature nếu chưa được operator phụ trách duyệt.
