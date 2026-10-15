---
id: 9604962e-e881-486a-9135-d4df65b50446
title: Endpoint hủy order — API Specification (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, api, vi]
---
# Endpoint hủy order — API Specification (ví dụ giả định)

> Đồng bộ với [SPEC-ORDER-001](order-cancellation-spec.vi.md); không phải API thực tế.

## Endpoint

- `POST /orders/{orderId}/cancel`
- Caller cần authentication và phải là owner của order.
- Request body: không có.
- Path field `orderId`: string bắt buộc; format ID trong ví dụ là giả định.

## Success Response — HTTP 200

```json
{
  "id": "ord_123",
  "status": "CANCELLED",
  "cancelledAt": "2026-10-15T09:00:00Z"
}
```

| Field | Type | Ý nghĩa |
|---|---|---|
| `id` | string | Order ID |
| `status` | string enum | Luôn là `CANCELLED` khi thành công |
| `cancelledAt` | string (RFC 3339) | Server timestamp trong contract giả định này |

## Error Behavior

| HTTP | Code | Condition | Side effect |
|---|---|---|---|
| 401 | `UNAUTHORIZED` | caller chưa authentication | không có |
| 404 | `ORDER_NOT_FOUND` | order không tồn tại | không có |
| 403 | `FORBIDDEN` | caller không phải owner | không có |
| 409 | `ORDER_NOT_CANCELLABLE` | status không phải PENDING | không có |

*Error payload schema chưa được định nghĩa trong ví dụ này; không suy ra JSON body.* Áp dụng error precedence trong Feature Specification được link; các row phía trên theo đúng thứ tự đó.

## Acceptance

`AC-001` response fields; `AC-002` conflict; `AC-003` auth/permission/order không tồn tại; `AC-004` concurrent cancellation. Xem [Specification](order-cancellation-spec.vi.md).
