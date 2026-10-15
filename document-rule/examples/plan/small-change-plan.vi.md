---
id: c5dd674b-3b05-44a6-8a92-9588d91d2960
title: Sửa validation message sai — Small Change Plan (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, vi]
---
# Sửa validation message sai — Small Change Plan (ví dụ giả định)

> **Document status: `draft`.** Chưa verify codebase hoặc bug. **Chỉ dùng template này khi user yêu cầu Plan cho thay đổi nhỏ hoặc project policy bắt buộc.** Nếu chỉ yêu cầu fix bug đơn giản, xem [No Plan Required](no-plan-required.vi.md).
>
> **Execution gate:** trước khi sửa code, verify code path bị ảnh hưởng, wording chính xác đã được duyệt (hoặc lấy approval) và test command của repository. Cập nhật Plan nếu inspection phát hiện ảnh hưởng shared/contract; không tiếp tục khi wording còn chưa chốt.

## Goal

**Goal (sau khi xác nhận wording đã duyệt):** Khi email sai format trên màn hình login, hiển thị `Email không hợp lệ` thay cho message chung, đồng thời giữ nguyên các validation behavior khác. Có thể xác nhận thành công khi targeted UI test kiểm tra đúng message này và regression tests hiện có xác nhận behavior của validation error khác không đổi.

## Steps

1. **Inspect:** xác minh input validation, error mapping, tests và source authoritative của message chính xác.  
   **Expected:** xác định code path, regression test, wording đã duyệt và repository test command; nếu wording chưa được duyệt thì dừng để xử lý.  
   **Verify:** dẫn source/code path; chưa thực hiện.
2. **Change:** cập nhật mapping theo wording đã được duyệt; giữ nguyên các status/error contract khác.  
   **Expected:** email sai format hiển thị đúng message, error khác không đổi.  
   **Verify:** unit test/error-presentation test (planned).
3. **Validate:** chạy regression test bằng command từ repository.  
   **Expected:** targeted tests pass và không lệch contract.  
   **Verify:** xem test output sau khi chạy.

## Done

- [ ] Product đã approve wording.
- [ ] Targeted/regression test thực tế đã Passed.
