---
id: 02ca0a2a-7fce-43e6-b046-8a8039e10dc1
title: Bug fix nhỏ — Không tạo Implementation Plan file (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, vi]
---
# Bug fix nhỏ — Không tạo Implementation Plan file (ví dụ giả định)

## Request

> "Sửa validation message ở trang login: khi email sai format thì hiển thị `Email không hợp lệ`."

## Điều kiện minh họa sau khi inspect source

- Chỉ cần sửa một nhánh mapping message và một test hiện có.
- Không đổi API contract, schema, authorization hay business behavior nào khác.
- Đã xác định được cách reproduce và verify.

## Decision

**Không tạo** `implementation-plan.md`, `plan.md` hay file Specification/Plan. Không yêu cầu user approve Plan trước. Thực hiện trực tiếp thay đổi đã yêu cầu và chạy targeted test.

## Báo cáo sau khi thực hiện (chỉ điền từ evidence thực tế)

- **Change:** `<chỉ mô tả thay đổi đã thực sự thực hiện; ghi rõ nếu chưa thay đổi>`.
- **Verification:** `<command chính xác và result quan sát được>`; nếu chưa chạy test, ghi `Not run`.
- **Scope changes/blockers:** `<nêu contract impact, shared usage hoặc blocker đã phát hiện; nếu không có, ghi none>`.

> Đây là **ví dụ giả định về decision**, không phải claim đã hoàn thành. Chỉ điền các trường sau khi thực sự inspect và thực thi.

## So sánh

- User chỉ yêu cầu **fix bug nhỏ** → không tạo Plan file.
- User yêu cầu **"Viết Plan để fix bug này"** → tạo Plan ngắn, ví dụ [Small Change Plan](small-change-plan.vi.md).
