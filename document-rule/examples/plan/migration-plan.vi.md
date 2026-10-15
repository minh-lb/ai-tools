---
id: 060b9e9f-98b2-4ae1-95ac-d3e9030186f8
title: Thêm `cancelledAt` — Migration Plan (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, migration, vi]
---
# Thêm `cancelledAt` — Migration Plan (ví dụ giả định)

> **Document status: `draft`.** Giả định system chưa có `cancelledAt` nhưng chưa xác minh; schema/version/data volume còn unknown.
>
> **Execution gate:** đây là outline, chưa đủ điều kiện để chạy migration. Không chạy MIG-02–MIG-04 cho đến khi MIG-01 verify schema/tooling/version thực tế và Plan được cập nhật với migration steps, compatibility checks, commands và recovery evidence cụ thể. Thực hiện mọi approval mà project workflow yêu cầu.

## Goal và Safety Contract

**Goal (có điều kiện sau inspection):** Nếu MIG-01 xác nhận `cancelledAt` chưa tồn tại, thêm field nullable và persist server-generated timestamp cho mỗi lần cancellation thành công, đồng thời giữ old/new application versions tương thích trong rollout. Có thể xác nhận thành công khi old/new readers pass các compatibility checks đã verify và một cancellation thành công lưu đúng một timestamp hợp lệ; nếu không, sửa hoặc dừng Plan.

**Safety contract:** Giữ migration ở trạng thái additive khi old application versions còn hoạt động. Không siết constraints hoặc xóa old path cho đến khi đã verify compatibility, data validation và recovery.

## Preconditions

- Inspect migration convention của database và status/enum của order hiện tại.
- Verify nullability, backwards compatibility và data recovery plan.
- **CAUTION:** không assume down migration khôi phục được timestamps đã xóa.

## Phases

### MIG-01 — Inspect

1. Kiểm tra schema, migration tooling và code đọc/ghi order.  
   **Verify:** ghi lại dependency paths, schema/version/data facts, migration tooling, compatibility constraints và recovery options đã verify; cập nhật các phase sau bằng action/check cụ thể theo repository. **Planned**.

### MIG-02 — Expand

1. Thêm column nullable tương thích application cũ, nếu contract cho phép.  
   **Verify:** schema check ở staging và đọc/ghi từ old/new readers. **Planned**.

### MIG-03 — Rollout code

1. Deploy writer dùng `cancelledAt` theo [cancel-order Specification](../spec/order-cancellation-spec.vi.md).\
   **Verify:** integration tests và runtime error checks. **Planned**.

### MIG-04 — Cleanup (optional)

1. Chỉ siết constraint/xóa old path sau khi verify data và compatibility.  
   **Verify:** backfill/completeness checks nếu cần.

## Stop và Recovery

Dừng rollout nếu old-version reads hoặc state updates lỗi; giữ schema dạng additive và chuyển application về version tương thích nếu recovery đó đã được verify. Không xóa column mới như một cách "rollback" có thể làm mất data.

## Done

- [ ] Schema compatibility đã được kiểm tra thực tế.
- [ ] Data validation có evidence.
- [ ] Stop/recovery procedure đã được xác nhận trước production.
