---
id: b1e4feaf-2898-4a56-9a90-83365ed9d922
title: Cancel Pending Order — Feature Specification (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, en]
---
# Cancel Pending Order — Feature Specification (Fictional Example)

> **SPEC-ORDER-001 · Fictional system · Example only**  
> This is not a real system specification. The API, states, and error codes below are defined only for this example.

## Objective and Scope

An order owner can cancel a `PENDING` order. Refunds are not handled; `PAID`/`SHIPPED` orders cannot be cancelled.

## Actor / Input / Preconditions

- Actor: authenticated user who owns the order.
- Trigger: `POST /orders/{orderId}/cancel`; `orderId` is a valid string ID in the fictional system.
- Success preconditions: the order exists, the caller owns it, and `status=PENDING`.

## Requirements

| ID | Rule |
|---|---|
| FR-001 | The order owner can request cancellation of an order in `PENDING` status. |
| FR-002 | On successful cancellation, the API returns `200` with `id`, `status=CANCELLED`, and `cancelledAt`. |
| BR-001 | Success transitions `PENDING → CANCELLED` and sets `cancelledAt` using the server clock. |
| BR-002 | If the status is not `PENDING`, return `409 ORDER_NOT_CANCELLABLE` and do not mutate data. |
| BR-003 | A caller who is not the owner receives `403 FORBIDDEN`; do not mutate data. |
| BR-004 | An unauthenticated caller receives `401 UNAUTHORIZED`; a missing order returns `404 ORDER_NOT_FOUND`; do not mutate data. |
| NFR-001 | When two authorized cancellation requests race for one `PENDING` order, at most one transition succeeds; any request that loses the transition returns `409 ORDER_NOT_CANCELLABLE` without mutation. |

## Success Flow

1. Authenticate the caller; if unauthenticated, return `401 UNAUTHORIZED`.
2. Find the order; if it does not exist, return `404 ORDER_NOT_FOUND`.
3. Verify ownership; if the caller is not the owner, return `403 FORBIDDEN`.
4. Check the `PENDING` condition; otherwise return `409 ORDER_NOT_CANCELLABLE`.
5. Atomically transition `PENDING → CANCELLED` and set `cancelledAt`; if a concurrent request already transitioned the order, return `409 ORDER_NOT_CANCELLABLE` without another mutation.
6. Return `200` with the final state.

## Error Behavior

| Condition | HTTP / Code | Data change |
|---|---|---|
| unauthenticated | 401 `UNAUTHORIZED` | No |
| order not found | 404 `ORDER_NOT_FOUND` | No |
| not the owner | 403 `FORBIDDEN` | No |
| not PENDING | 409 `ORDER_NOT_CANCELLABLE` | No |

Evaluate the error rows in the order shown; the first matching condition determines the response.

## Acceptance Criteria

| ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | FR-001, FR-002, BR-001 | Given the user's own `PENDING` order, when cancelled, then status is `CANCELLED`, `cancelledAt` is set, and HTTP 200 is returned. |
| AC-002 | BR-002 | Given the user's own `SHIPPED` order, when cancelled, then HTTP 409 is returned and data remains unchanged. |
| AC-003 | BR-003, BR-004 | Given an unauthenticated/non-owner/missing-order case, when cancellation is attempted, then return 401/403/404 respectively with no mutation. |
| AC-004 | NFR-001 | Given the user's own `PENDING` order and two authorized concurrent requests, when both complete without an unrelated infrastructure failure, then exactly one returns HTTP 200 and transitions the order to `CANCELLED`; the other returns `409 ORDER_NOT_CANCELLABLE` without another mutation, and only one cancellation timestamp is stored. |

## Open Questions

This fictional example chooses 403 for a non-owner. A real project might choose 404 to avoid revealing that an order exists; do not apply this choice automatically.
