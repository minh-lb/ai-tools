# Fix incorrect validation message — Small Change Plan (ví dụ giả định)

> Proposed. Không giả định codebase hoặc bug đã được xác nhận. **Chỉ dùng mẫu này nếu user yêu cầu Plan cho thay đổi nhỏ hoặc repo/project bắt buộc.** Nếu chỉ yêu cầu fix bug đơn giản, xem [No Plan Required](no-plan-required.md).

## Goal

Khi email không hợp lệ trên màn hình đăng nhập, UI hiển thị thông báo validation được yêu cầu thay vì thông báo chung (wording cụ thể cần lấy từ product spec).

## Steps

1. **Inspect:** xác minh input validation, error mapping và test hiện có.  
   **Expected:** xác định được nguồn tạo message.  
   **Verify:** dẫn chứng code path; chưa thực hiện.
2. **Change:** cập nhật mapping theo wording đã được phê duyệt; giữ nguyên status/error contract khác.  
   **Expected:** sai email ra đúng message, lỗi khác không đổi.  
   **Verify:** unit test/error presentation test (planned).
3. **Validate:** chạy regression test theo lệnh từ repo.  
   **Expected:** targeted tests pass và không phát sinh lệch contract.  
   **Verify:** test output khi đã chạy.

## Done

- [ ] Wording được product xác nhận.
- [ ] Targeted/regression test thực tế Passed.
