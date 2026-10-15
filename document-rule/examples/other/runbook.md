# Disable a misbehaving feature flag — Runbook (ví dụ giả định)

> Không phải lệnh thao tác production. Tên flag, hệ thống config và CLI thực tế phải xác minh trước dùng.

## Trigger & Preconditions

- Trigger: một tính năng mới gây tăng error rate vượt ngưỡng đã được đội vận hành phê duyệt.
- Preconditions: xác nhận flag có thể tắt mà không gây mất dữ liệu; có quyền và kênh audit hợp lệ.
- **WARNING:** tắt cờ không khôi phục dữ liệu đã ghi; nếu tính năng có migration, dùng recovery plan riêng.

## Procedure

1. **Action:** xác nhận flag tương ứng tính năng và scope ảnh hưởng.  
   **Expected:** mapping flag ↔ behavior được xác minh.  
   **Verify:** kiểm tra cấu hình và tài liệu đã được duyệt.
2. **Action:** theo runbook/config tool của dự án, tắt flag cho phạm vi được chấp thuận.  
   **Expected:** người dùng mục tiêu đi qua code path cũ.  
   **Verify:** xem trạng thái flag và kiểm thử một request mẫu an toàn.
3. **Action:** theo dõi error rate / latency theo dashboard có thật.  
   **Expected:** chỉ số trở lại ngưỡng được phê duyệt.  
   **Verify:** đối chiếu baseline và log/audit.

## Stop / Recovery

Nếu không xác minh được flag hoặc chỉ số xấu hơn, dừng thao tác tiếp theo, escalated theo quy trình đội vận hành. Không tự đoán tên flag/lệnh CLI.
