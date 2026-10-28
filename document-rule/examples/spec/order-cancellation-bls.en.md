---
id: f79de2fc-b0ce-48c6-9daa-bcb1c74fb65d
title: Cancel Order — BLS (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-28
tags: [document-rule, spec, bls, en]
---
# Cancel Order — Business Logic Specification (BLS, Fictional Example)

> Related to [SPEC-ORDER-001](order-cancellation-spec.en.md); illustrates business rules only.

## Purpose and Terms

Customers may cancel only their own orders that are waiting to be processed. These rules let business readers check who can cancel and what changes; the exact status and error names let developers implement the same behavior.

- `Order.status` is the order's processing state: waiting (`PENDING`), paid (`PAID`), shipped (`SHIPPED`), or cancelled (`CANCELLED`).
- Authenticated means the system has confirmed who the caller is; owner means the customer the order belongs to.
- `cancelledAt` records when cancellation occurred. “No mutation” means no stored data is changed by that request.
- The numeric response codes below tell the caller whether the request succeeded or why it was rejected.

## Trigger and Invariants

- The user initiates cancellation; caller must be authenticated and own the order.
- An order can be successfully cancelled at most once.

## Decision Table (check from top to bottom; first matching row applies)

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
