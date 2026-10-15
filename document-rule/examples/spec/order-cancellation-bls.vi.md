---
id: 8cb8ef83-cb25-4299-a757-f176a255050b
title: Hủy order — BLS (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, bls, vi]
---
# Hủy order — BLS (ví dụ giả định)

> Liên quan [SPEC-ORDER-001](order-cancellation-spec.vi.md); chỉ minh họa business rules.

## Entity, Trigger và Invariants

- `Order.status`: `PENDING`, `PAID`, `SHIPPED`, `CANCELLED`.
- User khởi tạo cancellation; caller phải authenticated và là owner của order.
- Một order chỉ được cancellation thành công tối đa một lần.

## Decision Table (priority từ trên xuống)

| Priority | Authenticated | Order exists | Is owner | Is PENDING | Decision |
|---|---|---|---|---|---|
| 1 | No | Any | Any | Any | 401 `UNAUTHORIZED`, no mutation |
| 2 | Yes | No | N/A | N/A | 404 `ORDER_NOT_FOUND`, no mutation |
| 3 | Yes | Yes | No | Any | 403 `FORBIDDEN`, no mutation |
| 4 | Yes | Yes | Yes | No | 409 `ORDER_NOT_CANCELLABLE`, no mutation |
| 5 | Yes | Yes | Yes | Yes | 200; `PENDING → CANCELLED`, set `cancelledAt` |

## Business Rules

- `BR-001`: chỉ owner được cancel order `PENDING`; khi thành công, cập nhật `status` và `cancelledAt` nhất quán.
- `BR-002`: từ chối mọi status khác `PENDING` và không thay đổi data.
- `BR-003`, `BR-004`: áp dụng kiểm tra authentication/existence/ownership theo priority trong table.
- `NFR-001`: hai cancellation requests đã authorization chạy đồng thời trên cùng order `PENDING` chỉ cho phép tối đa một state transition; request không thắng trả `409 ORDER_NOT_CANCELLABLE` và không mutation.

## Acceptance

`AC-001` success, `AC-002` status không hợp lệ, `AC-003` auth/ownership/order không tồn tại, `AC-004` concurrency — xem [Feature Specification](order-cancellation-spec.vi.md).
