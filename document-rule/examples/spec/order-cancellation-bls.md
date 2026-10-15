# Cancel Order — BLS (ví dụ giả định)

> Liên quan [SPEC-ORDER-001](order-cancellation-spec.md); chỉ minh họa quy tắc nghiệp vụ.

## Entity, Trigger & Invariants

- `Order.status`: `PENDING`, `PAID`, `SHIPPED`, `CANCELLED`.
- Cancel trigger do người dùng đưa ra; caller phải authenticated và là owner.
- Một order không được hủy thành công hơn một lần.

## Decision Table (ưu tiên từ trên xuống)

| Priority | Authenticated | Order exists | Is owner | Is PENDING | Decision |
|---|---|---|---|---|---|
| 1 | No | Any | Any | Any | 401 `UNAUTHORIZED`, no mutation |
| 2 | Yes | No | N/A | N/A | 404 `ORDER_NOT_FOUND`, no mutation |
| 3 | Yes | Yes | No | Any | 403 `FORBIDDEN`, no mutation |
| 4 | Yes | Yes | Yes | No | 409 `ORDER_NOT_CANCELLABLE`, no mutation |
| 5 | Yes | Yes | Yes | Yes | 200; `PENDING → CANCELLED`, set `cancelledAt` |

## Business Rules

- `BR-001`: chỉ owner có đơn `PENDING` được hủy; khi thành công cập nhật `status` và `cancelledAt` nhất quán.
- `BR-002`: mọi trạng thái khác `PENDING` bị từ chối và không thay đổi dữ liệu.
- `BR-003`, `BR-004`: authentication/existence/ownership theo bảng ưu tiên.
- `NFR-001`: concurrent cancels cùng đơn cho phép tối đa một state transition thành công.

## Acceptance

`AC-001` thành công, `AC-002` trạng thái sai, `AC-003` auth/ownership/missing, `AC-004` concurrency — xem [Feature Spec](order-cancellation-spec.md).
