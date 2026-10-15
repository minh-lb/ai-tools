---
id: e2ffc32c-e801-499e-9ecb-0fac1b399631
title: Ví dụ Output — Chỉ in section Acceptance Criteria
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, vi]
---
# Ví dụ Output — Chỉ in đúng một section

**User:** "Chỉ in Acceptance Criteria của Specification hủy order. Không giải thích."

**ĐÚNG — câu trả lời chỉ có nội dung sau (không có preamble):**

```markdown
## Acceptance Criteria

- **AC-001:** Given order PENDING của user, when user cancel, then trả HTTP 200 và status CANCELLED.
- **AC-002:** Given order SHIPPED của user, when user cancel, then trả HTTP 409 và giữ nguyên order.
- **AC-003:** Given caller chưa auth, không phải owner, hoặc không có order, when cancel, then trả lần lượt 401/403/404 và không mutation.
- **AC-004:** Given order `PENDING` của user và hai requests đã được authorization chạy đồng thời, when cả hai hoàn tất không có infrastructure failure khác, then đúng một request trả HTTP 200 và chuyển order sang `CANCELLED`; request còn lại trả `409 ORDER_NOT_CANCELLABLE`, không mutation thêm và chỉ lưu một cancellation timestamp.
```

Code fence chỉ dùng để hiển thị example trong file này. Câu trả lời thực tế chỉ in heading và bullets, không có fence.

**SAI:** "Dưới đây là AC" + toàn bộ Specification + khuyến nghị implementation.

**Nguyên tắc:** Khi dùng thật, phần Acceptance Criteria phải được in chính xác theo source document; nội dung trên là ví dụ giả định, tự chứa.
