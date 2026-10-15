# Output example — Chỉ in đúng một section

**User:** "Chỉ in Acceptance Criteria của Spec hủy đơn. Không giải thích."

**ĐÚNG — câu trả lời chỉ có nội dung sau (không kèm lời dẫn):**

```markdown
## Acceptance Criteria

- **AC-001:** Given own PENDING order, When cancel, Then HTTP 200 and status CANCELLED.
- **AC-002:** Given own SHIPPED order, When cancel, Then HTTP 409 and order unchanged.
- **AC-003:** Given unauthenticated/non-owner/missing order, When cancel, Then 401/403/404 respectively, no mutation.
- **AC-004:** Given two concurrent cancels, When executed, Then at most one transition succeeds.
```

**SAI:** "Dưới đây là AC của bạn" + toàn bộ Spec + khuyến nghị triển khai.

**Nguyên tắc:** Trong thực tế, phần AC được in phải trích chính xác theo tài liệu nguồn; ví dụ trên là bản tự chứa trong hệ thống giả định.
