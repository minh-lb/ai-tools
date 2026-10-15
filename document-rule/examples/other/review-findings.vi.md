---
id: 3100dbd1-d62b-495d-924d-798ed3dedbf7
title: Review findings — Spec hủy đơn (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, review, vi]
---
# Review Findings — Spec hủy đơn (ví dụ giả định)

> Ví dụ này chỉ minh họa cách review. Nội dung được trích là draft giả định, cố ý có lỗi; không phải [Spec chuẩn của ví dụ](../spec/order-cancellation-spec.vi.md).
>
> **Review scope:** nội dung Specification và khả năng kiểm chứng Acceptance. **Nguồn/conventions:** draft giả định trong ví dụ. **Limitations:** không đọc code/API thực tế và không chạy test.

## Findings

### FIND-001 — Thiếu điều kiện không mutation

- **Severity:** P0
- **Location:** BR-002
- **Evidence (draft giả định):** "If status is SHIPPED, return error."
- **Impact:** chưa rõ order có bị thay đổi một phần trước khi trả error hay không.
- **Fix:** xác định error code theo contract và yêu cầu "state/data unchanged".

### FIND-002 — Acceptance không thể kiểm thử

- **Severity:** P1
- **Location:** AC-004
- **Evidence (draft giả định):** "Concurrent requests are handled correctly."
- **Impact:** không có expected result để xác định pass/fail.
- **Fix:** Given hai yêu cầu cancel đồng thời cho một order PENDING, then tối đa một state transition thành công.

## Review Status và Disposition

`Findings only`; chưa thay thế/rewrite source text, chưa chạy test hay inspect code.

**Disposition:** `Changes requested` — hai finding minh họa vẫn còn. Kết luận này chỉ áp dụng cho Spec giả định và scope đã nêu.
