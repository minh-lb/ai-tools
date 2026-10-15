# Cancel Order Endpoint — API Specification (ví dụ giả định)

> Đồng bộ với [SPEC-ORDER-001](order-cancellation-spec.md); không phải API thực tế.

## Endpoint

- `POST /orders/{orderId}/cancel`
- Caller cần authentication và ownership.
- Request body: không có.
- Path field `orderId`: required string, ID hợp lệ theo quy ước **giả định**.

## Success response — HTTP 200

```json
{
  "id": "ord_123",
  "status": "CANCELLED",
  "cancelledAt": "2026-10-15T09:00:00Z"
}
```

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Order ID |
| `status` | string enum | Always `CANCELLED` on success |
| `cancelledAt` | string (RFC 3339) | Server timestamp in this fictional contract |

## Error behavior

| HTTP | Code | Condition | Side effect |
|---|---|---|---|
| 401 | `UNAUTHORIZED` | caller unauthenticated | none |
| 404 | `ORDER_NOT_FOUND` | order not found | none |
| 403 | `FORBIDDEN` | caller not owner | none |
| 409 | `ORDER_NOT_CANCELLABLE` | status not PENDING | none |

*Error payload schema chưa được định nghĩa trong ví dụ này; không tự suy ra body JSON.*

## Acceptance

`AC-001` response fields; `AC-002` conflict; `AC-003` auth/permission/missing; `AC-004` concurrent cancels. Xem [Spec](order-cancellation-spec.md).
