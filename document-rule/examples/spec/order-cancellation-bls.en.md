---
id: f79de2fc-b0ce-48c6-9daa-bcb1c74fb65d
title: Cancel Order — BLS (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, bls, en]
---
# Cancel Order — BLS (Fictional Example)

> Related to [SPEC-ORDER-001](order-cancellation-spec.en.md); illustrates business rules only.

## Entity, Trigger, and Invariants

- `Order.status`: `PENDING`, `PAID`, `SHIPPED`, `CANCELLED`.
- The user initiates cancellation; caller must be authenticated and own the order.
- An order can be successfully cancelled at most once.

## Decision Table (top-down priority)

| Priority | Authenticated | Order exists | Is owner | Is PENDING | Decision |
|---|---|---|---|---|---|
| 1 | No | Any | Any | Any | 401 `UNAUTHORIZED`, no mutation |
| 2 | Yes | No | N/A | N/A | 404 `ORDER_NOT_FOUND`, no mutation |
| 3 | Yes | Yes | No | Any | 403 `FORBIDDEN`, no mutation |
| 4 | Yes | Yes | Yes | No | 409 `ORDER_NOT_CANCELLABLE`, no mutation |
| 5 | Yes | Yes | Yes | Yes | 200; `PENDING → CANCELLED`, set `cancelledAt` |

## Business Rules

- `BR-001`: only the owner may cancel a `PENDING` order; success updates `status` and `cancelledAt` consistently.
- `BR-002`: reject every status other than `PENDING` without changing data.
- `BR-003`, `BR-004`: apply authentication/existence/ownership checks in the table's priority order.
- `NFR-001`: concurrent authorized cancellation requests for one `PENDING` order allow at most one transition; the losing request returns `409 ORDER_NOT_CANCELLABLE` without mutation.

## Acceptance

`AC-001` success, `AC-002` invalid status, `AC-003` auth/ownership/missing order, `AC-004` concurrency — see the [Feature Specification](order-cancellation-spec.en.md).
