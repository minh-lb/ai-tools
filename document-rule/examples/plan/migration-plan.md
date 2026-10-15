# Add `cancelledAt` — Migration Plan (ví dụ giả định)

> Proposed. Giả định hệ thống chưa có `cancelledAt`; schema/version/data volume chưa được xác minh.

## Goal & Safety Contract

Bổ sung thuộc tính có thể lưu thời gian hủy đơn mà không làm phiên bản ứng dụng cũ không thể hoạt động trong rollout.

## Preconditions

- Inspect database migration conventions và enum/status hiện tại.
- Xác minh nullability, backward compatibility và kế hoạch phục hồi dữ liệu.
- **CAUTION:** không được assume down migration khôi phục timestamps đã bị xóa.

## Phases

### MIG-01 — Inspect

1. Xem schema, migration tooling, code đọc/ghi order.  
   **Verify:** lập danh sách nơi phụ thuộc schema. **Planned**.

### MIG-02 — Expand

1. Thêm cột nullable tương thích với ứng dụng cũ nếu contract cho phép.  
   **Verify:** schema check ở staging và read/write từ old/new readers. **Planned**.

### MIG-03 — Rollout code

1. Triển khai writer sử dụng `cancelledAt` theo Spec hủy đơn.  
   **Verify:** integration tests và kiểm tra lỗi runtime. **Planned**.

### MIG-04 — Cleanup (optional)

1. Chỉ siết constraint/xóa đường cũ nếu đã xác minh dữ liệu và khả năng tương thích.  
   **Verify:** backfill/completeness checks nếu yêu cầu.

## Stop & Recovery

Dừng rollout nếu old-version reads hoặc state updates lỗi; giữ schema dạng additive và đưa ứng dụng về phiên bản tương thích nếu đã kiểm chứng. Không xóa cột mới để "rollback" dữ liệu.

## Done

- [ ] Schema compatibility được kiểm tra thực tế.
- [ ] Data validation có evidence.
- [ ] Quy trình stop/recovery được xác nhận trước production.
