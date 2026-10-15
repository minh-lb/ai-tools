---
id: 64e2a129-68d7-4126-8478-e93f0c565904
title: Hủy order PENDING — Feature Specification (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, spec, vi]
---
# Hủy order PENDING — Feature Specification (ví dụ giả định)

> **SPEC-ORDER-001 · Fictional system · Example only**  
> Đây không phải Specification của system thực tế. API, states và error codes dưới đây chỉ được định nghĩa trong ví dụ này.

## Objective và Scope

Owner của order có thể cancel order `PENDING`. Không xử lý refund và không cho cancel order `PAID`/`SHIPPED`.

## Actor / Input / Preconditions

- Actor: user đã authentication và là owner của order.
- Trigger: `POST /orders/{orderId}/cancel`; `orderId` là string ID hợp lệ trong fictional system.
- Preconditions để thành công: order tồn tại, caller là owner và `status=PENDING`.

## Requirements

| ID | Rule |
|---|---|
| FR-001 | Owner có thể gửi request cancel order ở status `PENDING`. |
| FR-002 | Khi cancel thành công, API trả `200` cùng `id`, `status=CANCELLED`, `cancelledAt`. |
| BR-001 | Thành công chuyển `PENDING → CANCELLED` và set `cancelledAt` theo server clock. |
| BR-002 | Nếu status không phải `PENDING`, trả `409 ORDER_NOT_CANCELLABLE` và không mutation data. |
| BR-003 | Caller không phải owner nhận `403 FORBIDDEN`; không mutation data. |
| BR-004 | Caller chưa authentication nhận `401 UNAUTHORIZED`; order không tồn tại trả `404 ORDER_NOT_FOUND`; không mutation data. |
| NFR-001 | Khi hai cancellation requests đã được authorization chạy đồng thời trên một order `PENDING`, tối đa một state transition thành công; request không thắng transition trả `409 ORDER_NOT_CANCELLABLE` và không mutation. |

## Success Flow

1. Authenticate caller; nếu chưa authenticated thì trả `401 UNAUTHORIZED`.
2. Tìm order; nếu không tồn tại thì trả `404 ORDER_NOT_FOUND`.
3. Kiểm tra ownership; nếu caller không phải owner thì trả `403 FORBIDDEN`.
4. Kiểm tra điều kiện `PENDING`; nếu không thỏa thì trả `409 ORDER_NOT_CANCELLABLE`.
5. Atomically chuyển `PENDING → CANCELLED` và set `cancelledAt`; nếu request đồng thời khác đã chuyển order trước thì trả `409 ORDER_NOT_CANCELLABLE`, không mutation thêm.
6. Trả `200` cùng final state.

## Error Behavior

| Condition | HTTP / Code | Data change |
|---|---|---|
| chưa authentication | 401 `UNAUTHORIZED` | No |
| không tìm thấy order | 404 `ORDER_NOT_FOUND` | No |
| không phải owner | 403 `FORBIDDEN` | No |
| không phải PENDING | 409 `ORDER_NOT_CANCELLABLE` | No |

Xét các condition theo đúng thứ tự trong table; condition đầu tiên khớp sẽ quyết định response.

## Acceptance Criteria

| ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | FR-001, FR-002, BR-001 | Given order `PENDING` của user, when cancel, then status là `CANCELLED`, `cancelledAt` được set và trả HTTP 200. |
| AC-002 | BR-002 | Given order `SHIPPED` của user, when cancel, then trả HTTP 409 và data giữ nguyên. |
| AC-003 | BR-003, BR-004 | Given trường hợp chưa authentication/không phải owner/không có order, when thử cancel, then lần lượt trả 401/403/404 và không mutation. |
| AC-004 | NFR-001 | Given order `PENDING` của user và hai requests đã được authorization chạy đồng thời, when cả hai hoàn tất không có infrastructure failure khác, then đúng một request trả HTTP 200 và chuyển order sang `CANCELLED`; request còn lại trả `409 ORDER_NOT_CANCELLABLE`, không mutation thêm và chỉ lưu một cancellation timestamp. |

## Open Questions

Ví dụ giả định chọn 403 cho non-owner. Project thực tế có thể chọn 404 để tránh lộ order có tồn tại; không áp dụng lựa chọn này máy móc.
