---
id: b90c3723-e1ab-41f4-b940-6fc5e43d7633
title: Cancel Order Endpoint — API Specification (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, api, en]
---
# Cancel Order Endpoint — API Specification (Fictional Example)

> Aligned with [SPEC-ORDER-001](order-cancellation-spec.en.md); this is not a real API.

## Endpoint

- `POST /orders/{orderId}/cancel`
- Caller must be authenticated and own the order.
- Request body: none.
- Path field `orderId`: required string; valid ID format is fictional.

## Success Response — HTTP 200

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

## Error Behavior

| HTTP | Code | Condition | Side effect |
|---|---|---|---|
| 401 | `UNAUTHORIZED` | caller unauthenticated | none |
| 404 | `ORDER_NOT_FOUND` | order does not exist | none |
| 403 | `FORBIDDEN` | caller is not the owner | none |
| 409 | `ORDER_NOT_CANCELLABLE` | status is not PENDING | none |

*The error payload schema is not defined in this example; do not infer a JSON body.* Apply the error precedence defined by the linked Feature Specification; the rows above follow that order.

## Acceptance

`AC-001` response fields; `AC-002` conflict; `AC-003` auth/permission/missing order; `AC-004` concurrent cancellation. See the [Specification](order-cancellation-spec.en.md).
