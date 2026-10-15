---
id: 97d8cd19-4056-4912-89ae-3b0160a6a75b
title: Ví dụ Output — Tài liệu đầy đủ và bản tóm tắt
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, vi]
---
# Ví dụ Output — Tài liệu đầy đủ và bản tóm tắt

## Case A: User yêu cầu "In toàn bộ Specification"

- **ĐÚNG:** in đủ mọi section, table, Acceptance và Open Questions được yêu cầu trong Specification; không bỏ nhánh lỗi.
- **SAI:** in mục lục rồi ghi "các mục còn lại tương tự", hoặc chỉ trả summary nhưng gọi đó là tài liệu đầy đủ.
- Nếu giới hạn chat không phù hợp, tạo file **đầy đủ thực sự** và nói rõ nội dung trong chat chỉ là preview, không phải toàn văn.

## Case B: User yêu cầu "Tóm tắt Specification trong 5 dòng"

- **ĐÚNG:** chỉ viết 5 dòng trọng tâm; nêu các quyết định chưa chốt nếu có ảnh hưởng.
- **SAI:** in thêm toàn bộ Specification/Plan.

## Case C: User yêu cầu "Export `spec.md` và đưa link"

- **ĐÚNG:** tạo `spec.md`, kiểm tra file không rỗng và đầy đủ, rồi đưa link thực tế mà runtime hỗ trợ.
- **SAI:** nói đã tạo file khi file không tồn tại, hoặc tự tạo PDF thay vì Markdown được yêu cầu.
