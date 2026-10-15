# Output example — JSON-only

**User:** "Chỉ xuất JSON với keys `id`, `status`, `rules`, không Markdown."

**ĐÚNG — raw payload được xuất trong câu trả lời thực tế:**

```json
{"id":"SPEC-ORDER-001","status":"draft","rules":["BR-001","BR-002"]}
```

**Lưu ý về tài liệu ví dụ:** Code fence ở trên chỉ dùng để trình bày ví dụ trong file Markdown này; **khi người dùng thực sự yêu cầu JSON-only thì bỏ code fence, heading và mọi diễn giải**.

**SAI:** thêm `notes` key, preamble, hoặc đặt JSON vào Markdown fence trong câu trả lời.
