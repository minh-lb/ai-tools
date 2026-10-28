---
id: 8cb8ef83-cb25-4299-a757-f176a255050b
title: Hủy đơn hàng — Đặc tả quy tắc nghiệp vụ (ví dụ giả định)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-28
tags: [document-rule, spec, bls, vi]
---
# Hủy đơn hàng — Đặc tả quy tắc nghiệp vụ (BLS, ví dụ giả định)

> Liên quan [SPEC-ORDER-001](order-cancellation-spec.vi.md); chỉ minh họa quy tắc nghiệp vụ.

## Mục đích và thuật ngữ

Khách hàng chỉ được hủy đơn của chính mình khi đơn đang chờ xử lý. Các quy tắc này giúp người làm nghiệp vụ kiểm tra ai được hủy và dữ liệu nào thay đổi; tên trạng thái và mã lỗi chính xác giúp lập trình viên thực hiện cùng một hành vi.

- `Order.status` là trạng thái xử lý đơn: chờ xử lý (`PENDING`), đã thanh toán (`PAID`), đã gửi hàng (`SHIPPED`) hoặc đã hủy (`CANCELLED`).
- Đã xác thực nghĩa là hệ thống đã xác nhận danh tính người gửi yêu cầu; chủ đơn là khách hàng sở hữu đơn đó.
- `cancelledAt` lưu thời điểm hủy. “Không thay đổi dữ liệu” nghĩa là yêu cầu đó không ghi thay đổi vào dữ liệu đã lưu.
- Các mã phản hồi dạng số dưới đây cho biết yêu cầu thành công hay vì sao bị từ chối.

## Sự kiện khởi đầu và điều kiện luôn phải giữ

- Người dùng yêu cầu hủy; người gửi phải được xác thực và sở hữu đơn hàng.
- Một đơn hàng chỉ được hủy thành công tối đa một lần.

## Bảng quyết định (xét từ trên xuống; áp dụng dòng khớp đầu tiên)

| Ưu tiên | Đã xác thực | Đơn tồn tại | Là chủ đơn | Đang PENDING | Kết quả |
|---|---|---|---|---|---|
| 1 | Không | Bất kỳ | Bất kỳ | Bất kỳ | 401 `UNAUTHORIZED`: chưa xác thực; không thay đổi dữ liệu |
| 2 | Có | Không | Không áp dụng | Không áp dụng | 404 `ORDER_NOT_FOUND`: không tìm thấy đơn; không thay đổi dữ liệu |
| 3 | Có | Có | Không | Bất kỳ | 403 `FORBIDDEN`: không có quyền; không thay đổi dữ liệu |
| 4 | Có | Có | Có | Không | 409 `ORDER_NOT_CANCELLABLE`: đơn không thể hủy; không thay đổi dữ liệu |
| 5 | Có | Có | Có | Có | 200: thành công; chuyển `PENDING → CANCELLED`, ghi `cancelledAt` |

## Quy tắc nghiệp vụ

- `BR-001`: chỉ chủ đơn được hủy đơn `PENDING`; khi thành công, cập nhật `status` và `cancelledAt` nhất quán.
- `BR-002`: từ chối mọi trạng thái khác `PENDING` và không thay đổi dữ liệu.
- `BR-003`, `BR-004`: kiểm tra danh tính, sự tồn tại của đơn và quyền sở hữu theo thứ tự trong bảng.
- `NFR-001`: hai yêu cầu hủy đã được phép chạy đồng thời trên cùng đơn `PENDING` chỉ cho phép tối đa một lần chuyển trạng thái; yêu cầu không thắng trả `409 ORDER_NOT_CANCELLABLE` và không thay đổi dữ liệu.

## Tiêu chí chấp nhận

`AC-001` thành công, `AC-002` trạng thái không hợp lệ, `AC-003` danh tính/quyền sở hữu/đơn không tồn tại, `AC-004` yêu cầu đồng thời — xem [Đặc tả tính năng](order-cancellation-spec.vi.md).
