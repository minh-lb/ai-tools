---
id: bea9fc81-0e23-4fa2-8c39-0408e347092c
title: Ví dụ Output — Chỉ JSON
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, vi]
---
# Ví dụ Output — Chỉ JSON

**User:** "Chỉ xuất JSON với keys `id`, `status`, `rules`; không Markdown."

**ĐÚNG — raw payload trong câu trả lời thực tế:**

```json
{"id":"SPEC-ORDER-001","status":"draft","rules":["BR-001","BR-002"]}
```

**Lưu ý về example này:** Code fence chỉ dùng để hiển thị ví dụ trong file Markdown này. **Khi user thực sự yêu cầu JSON-only, bỏ code fence, heading và toàn bộ phần giải thích.**

**SAI:** thêm key `notes` hoặc preamble, hay bọc JSON trong Markdown fence ở câu trả lời.
