# Review findings — Spec hủy đơn (ví dụ giả định)

> Chỉ minh họa cách review. Trích dẫn dưới đây là nội dung giả định cố ý có lỗi, không phải [Spec chuẩn của ví dụ](../spec/order-cancellation-spec.md).

## Findings

### FIND-001 — Missing no-mutation condition

- **Severity:** P0
- **Location:** BR-002
- **Evidence (fictional draft):** "If status is SHIPPED, return error."
- **Impact:** không rõ đơn đã bị thay đổi một phần trước khi trả lỗi hay chưa.
- **Fix:** xác định code lỗi theo contract và yêu cầu "state/data unchanged".

### FIND-002 — Non-testable acceptance

- **Severity:** P1
- **Location:** AC-004
- **Evidence (fictional draft):** "Concurrent requests are handled correctly."
- **Impact:** không có expected result để xác nhận pass/fail.
- **Fix:** Given two simultaneous cancels of one PENDING order, Then at most one transition succeeds.

## Review status

`Findings only`. Chưa thay thế/rewrite văn bản nguồn; chưa chạy test hay đọc code.
