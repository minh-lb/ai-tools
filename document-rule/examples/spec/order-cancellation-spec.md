# Cancel Pending Order — Feature Specification (ví dụ giả định)

> **SPEC-ORDER-001 · Fictional system · Status: Illustrative**  
> Không phải đặc tả hệ thống thật. API, trạng thái và mã lỗi bên dưới do ví dụ tự định nghĩa.

## Objective & Scope

Chủ đơn có thể hủy đơn `PENDING`. Không xử lý refund và không hủy đơn `PAID/SHIPPED`.

## Actor / Input / Preconditions

- Actor: người dùng đã xác thực; owner của đơn.
- Trigger: `POST /orders/{orderId}/cancel`; `orderId` là chuỗi ID hợp lệ của hệ thống giả định.
- Preconditions cho thành công: đơn tồn tại, caller là owner, `status=PENDING`.

## Requirements

| ID | Rule |
|---|---|
| FR-001 | Chủ đơn có thể gửi yêu cầu hủy đơn đang `PENDING`. |
| FR-002 | Nếu hủy thành công, API trả `200` cùng `id`, `status=CANCELLED`, `cancelledAt`. |
| BR-001 | Thành công chuyển `PENDING → CANCELLED` và gán `cancelledAt` theo đồng hồ server. |
| BR-002 | Nếu trạng thái khác `PENDING`, trả `409 ORDER_NOT_CANCELLABLE` và không mutation. |
| BR-003 | Caller không phải owner nhận `403 FORBIDDEN`, không mutation. |
| BR-004 | Chưa xác thực nhận `401 UNAUTHORIZED`; không tìm thấy đơn nhận `404 ORDER_NOT_FOUND`; không mutation. |
| NFR-001 | Với hai request cùng hủy một đơn, tối đa một request chuyển trạng thái thành công. |

## Success flow

1. Xác thực caller; tìm đơn và kiểm tra ownership.
2. Xét điều kiện `PENDING`.
3. Thực hiện state transition bảo đảm NFR-001, đặt `cancelledAt`.
4. Trả `200` cùng trạng thái cuối.

## Error behavior

| Condition | HTTP / Code | Data change |
|---|---|---|
| unauthenticated | 401 `UNAUTHORIZED` | No |
| order not found | 404 `ORDER_NOT_FOUND` | No |
| not owner | 403 `FORBIDDEN` | No |
| not PENDING | 409 `ORDER_NOT_CANCELLABLE` | No |

## Acceptance Criteria

| ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | FR-001, FR-002, BR-001 | Given own `PENDING` order, When cancel, Then status is `CANCELLED`, `cancelledAt` set and HTTP 200. |
| AC-002 | BR-002 | Given own `SHIPPED` order, When cancel, Then HTTP 409 and data unchanged. |
| AC-003 | BR-003, BR-004 | Given unauthenticated/non-owner/missing order, When cancel, Then 401/403/404 respectively; no mutation. |
| AC-004 | NFR-001 | Given two concurrent cancels on same `PENDING` order, When both execute, Then at most one succeeds. |

## Open Questions

Ví dụ chọn 403 cho non-owner. Dự án thật có thể chọn 404 để tránh lộ tồn tại đơn; không áp dụng máy móc.
