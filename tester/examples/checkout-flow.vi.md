---
title: "Thanh toán nhiều màn hình — E2E Test Cases (ví dụ)"
type: testcase
feature_id: EX-CHECKOUT
display_language: vi
status: draft
updated: 2026-10-09
sources: [EX-CO-AC-01, EX-CO-AC-02, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01]
---

> **Chỉ mang tính minh họa.** Mọi nguồn, màn hình, số tiền, route và quy tắc `EX-CO-*` dưới đây đều giả định. `https://shop.example.test` là host ví dụ được dành riêng; khi viết testcase thật, thay bằng URL môi trường test đã được duyệt.

# Thanh toán nhiều màn hình — E2E Test Cases

## Phạm vi và nguồn
- **Mục tiêu / ranh giới E2E:** Người mua đăng nhập, chọn sản phẩm, tạo giỏ hàng, chọn thông tin giao hàng, thanh toán, xem xác nhận, rồi tìm lại đúng đơn trong lịch sử sau khi tải lại.
- **Nguồn giả định:** `EX-CO-AC-01` quy định luồng thành công và cách tính tiền; `EX-CO-AC-02` quy định khôi phục sau khi payment bị từ chối; `EX-CO-UI-01` quy định URL/route, nhãn điều hướng và control, thứ tự màn hình, phần tổng kết và thông báo lỗi đã bản địa hóa; `EX-CO-API-01` quy định đơn hàng xuất hiện trong lịch sử; `EX-CO-INT-01` quy định hành vi payment sandbox; `EX-CO-SEC-01` quy định người mua giả lập và luồng đăng nhập thành công.
- **Tác nhân / môi trường:** Người mua giả lập `U-TEST` trong shop cô lập `SHOP-TEST`; chỉ dùng sandbox của provider. Base URL ví dụ: `https://shop.example.test`.
- **Trạng thái đầu:** `U-TEST` bắt đầu đã đăng xuất; giỏ hàng và lịch sử đơn trống; còn 5 `MUG-RED`. Reset trước mỗi testcase.
- **Dữ liệu kiểm thử dùng chung:** Giá mỗi món $24.00; `SAVE10` giảm 10% subtotal sản phẩm; địa chỉ đã lưu `ADDR-TEST-01`; giao hàng Standard giá $5.00; tenant test được miễn thuế ($0); token sandbox `CARD-OK` và `CARD-DECLINE`.
- **Cleanup / an toàn:** Không dùng thẻ hay địa chỉ thật. Sau mỗi testcase, lưu bằng chứng, void/refund khoản capture sandbox nếu cần, xóa đơn/giỏ test và khôi phục tồn kho qua fixture đã duyệt. Tuyệt đối không chạy trên hệ thống thương mại hoặc thanh toán thật.
- **Ngoài phạm vi:** Tiền tệ, địa chỉ, phương thức giao khác; coupon hết hạn/không hợp lệ; hết hàng; hủy/hoàn tiền; checkout đồng thời và provider live. Khi cần, liên kết đến suite chuyên biệt.

## Các kịch bản E2E

### TC-001 — Hoàn tất checkout qua danh mục, giỏ hàng, giao hàng, payment, review, xác nhận và lịch sử đơn
- **Điều kiện trước:** `U-TEST` tồn tại, có quyền người mua, bắt đầu đã đăng xuất và fixture checkout trong Phạm vi đã được reset.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential); `MUG-RED` số lượng 2, `SAVE10`, `ADDR-TEST-01`, giao hàng Standard và `CARD-OK`.
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://shop.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận URL `/shops/SHOP-TEST/home` và tài khoản đang đăng nhập là `U-TEST`.
  2. Trong điều hướng shop, chọn **Danh mục**; xác nhận `/catalog`. Focus **Tìm sản phẩm**, nhập `MUG-RED`, chọn kết quả phù hợp và xác nhận `/catalog/MUG-RED` cùng trang chi tiết sản phẩm.
  3. Nhập `2` vào **Số lượng**, chọn **Thêm vào giỏ** và xác nhận chuyển tới `/cart` với hai `MUG-RED`.
  4. Trong **Mã khuyến mãi**, nhập `SAVE10`, chọn **Áp dụng**, xác nhận giảm $4.80, rồi chọn **Tiếp tục thanh toán** và xác nhận `/checkout/address`.
  5. Trong **Địa chỉ giao hàng**, chọn radio `ADDR-TEST-01`, chọn **Tiếp tục** và xác nhận `/checkout/delivery`.
  6. Trong **Phương thức giao hàng**, chọn **Standard — $5.00**, chọn **Tiếp tục** và xác nhận `/checkout/payment`.
  7. Trong **Phương thức thanh toán**, chọn token sandbox `CARD-OK`, chọn **Tiếp tục** và xác nhận `/checkout/review`.
  8. Trong **Xem lại**, xác nhận 2 sản phẩm ($48.00 subtotal − giảm $4.80 + giao hàng $5.00 + thuế $0 = $48.20); chọn **Đặt hàng** một lần.
  9. Trong **Xác nhận**, ghi lại mã đơn; chọn **Xem đơn hàng**, xác nhận `/orders/<order-id>`, sau đó chọn **Lịch sử đơn hàng** và xác nhận `/orders`.
  10. Mở lại chi tiết đơn từ **Lịch sử đơn hàng**, tải lại `/orders/<order-id>` và xác nhận dữ liệu lần nữa.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công vào `SHOP-TEST`. Màn hình xác nhận và chi tiết đơn sau khi tải lại hiển thị cùng một mã đơn, hai `MUG-RED`, coupon, tổng $48.20 và trạng thái `paid`; lịch sử có đúng một đơn tương ứng. Tra cứu chỉ đọc trong payment sandbox đã duyệt tìm thấy đúng một capture $48.20 gắn với mã đơn đó.
- **Trace:** EX-CO-AC-01, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01.
- **Rủi ro / lý do ưu tiên:** High — giao dịch tài chính và tính nhất quán xuyên màn hình giữa giỏ/đơn hàng.

### TC-002 — Khôi phục sau khi payment bị từ chối mà không tạo đơn trùng
- **Điều kiện trước:** `U-TEST` tồn tại, có quyền người mua, bắt đầu đã đăng xuất và fixture checkout trong Phạm vi được reset về giỏ/lịch sử đơn trống.
- **Dữ liệu kiểm thử:** Alias trong kho credential QA được duyệt cho `U-TEST` (không sao chép credential); `MUG-RED` số lượng 2, `SAVE10`, `ADDR-TEST-01`, giao hàng Standard, tổng $48.20; dùng `CARD-DECLINE` trước, sau đó `CARD-OK`.
- **Thao tác của người dùng:**
  1. Mở browser test và truy cập `https://shop.example.test/sign-in`; nhập `U-TEST` vào **Mã tài khoản**, lấy mật khẩu qua alias credential được duyệt và nhập vào **Mật khẩu**, sau đó chọn **Đăng nhập**. Xác nhận `/shops/SHOP-TEST/home` và tài khoản đang đăng nhập là `U-TEST`.
  2. Trong điều hướng shop, chọn **Danh mục**; xác nhận `/catalog`. Tìm `MUG-RED`, chọn kết quả phù hợp và xác nhận `/catalog/MUG-RED`.
  3. Nhập `2` vào **Số lượng**, chọn **Thêm vào giỏ** và xác nhận `/cart` có hai sản phẩm.
  4. Nhập `SAVE10` trong **Mã khuyến mãi**, chọn **Áp dụng**, xác nhận giảm $4.80, rồi chọn **Tiếp tục thanh toán** và xác nhận `/checkout/address`.
  5. Chọn `ADDR-TEST-01` trong **Địa chỉ giao hàng**, chọn **Tiếp tục**; sau đó chọn **Standard — $5.00** trong **Phương thức giao hàng**, tiếp tục đến `/checkout/payment`.
  6. Chọn `CARD-DECLINE` trong **Phương thức thanh toán**, chọn **Tiếp tục** và xác nhận `/checkout/review`.
  7. Trong **Xem lại**, xác nhận tổng $48.20 và chọn **Đặt hàng** một lần.
  8. Sau khi bị từ chối và quay lại `/checkout/payment`, xác nhận lỗi. Trong tab thứ hai, truy cập `https://shop.example.test/orders`, tải lại và xác nhận chưa có đơn; quay lại tab checkout.
  9. Chọn `CARD-OK`, chọn **Tiếp tục** tới `/checkout/review` và xác nhận lại tổng tiền.
  10. Chọn **Đặt hàng** một lần; trong **Xác nhận**, ghi lại mã đơn.
  11. Chọn **Lịch sử đơn hàng**, mở chi tiết `/orders/<order-id>` và tải lại URL đó.
- **Kết quả / hậu điều kiện mong đợi (oracle):** Đăng nhập thành công vào `SHOP-TEST`. Sau lần bị từ chối, UI hiển thị `Không thể xác thực thanh toán. Hãy chọn phương thức khác.`; không có đơn trong lịch sử và payment sandbox không có capture. Sau khi thử lại bằng `CARD-OK`, sau khi tải lại chỉ có đúng một đơn với hai món, tổng $48.20 và trạng thái `paid`; sandbox có đúng một capture gắn với mã đơn đó.
- **Trace:** EX-CO-AC-02, EX-CO-UI-01, EX-CO-API-01, EX-CO-INT-01, EX-CO-SEC-01.
- **Rủi ro / lý do ưu tiên:** High — đường khôi phục phải giữ trạng thái giỏ hàng và tránh đơn/charge trùng.
