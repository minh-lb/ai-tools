# Flow: checkout

- **Feature:** checkout
- **Entry point:** `src/api/orders/checkout.controller.ts` → `CheckoutController.create`

---

## Lịch sử chỉnh sửa

| Ngày | Thay đổi | Bởi |
| --- | --- | --- |
| 2026-07-12 | Tạo mới | generate-flow |

---

## Flow Summary

Client gửi POST request với thông tin giỏ hàng và phương thức thanh toán. Service kiểm tra trạng thái giỏ hàng, áp dụng mã giảm giá nếu có, thực hiện thanh toán qua Stripe, lưu đơn hàng, và publish event `order.created`.

```mermaid
flowchart LR
    A([Client]) --> B[CheckoutController]
    B --> C[CheckoutService]
    C --> D[CartRepository]
    C --> E[PaymentGateway]
    C --> F[OrderRepository]
    C --> G([EventBus])
```

| # | Bước | Mô tả |
| --- | --- | --- |
| 1 | Nhận request | Controller validate body, lấy userId từ JWT |
| 2 | Load giỏ hàng | Service truy vấn giỏ hàng, kiểm tra trạng thái open |
| 3 | Tính tổng tiền | Áp dụng discount code, tính finalTotal |
| 4 | Thanh toán | Gọi Stripe qua PaymentGateway |
| 5 | Lưu đơn hàng | Insert orders + order_items, cập nhật trạng thái giỏ hàng |
| 6 | Phát sự kiện | Publish `order.created` lên EventBus |
| 7 | Trả phản hồi | Controller trả về 201 với orderId và total |

---

## Full Flow

### Path: POST /orders/checkout

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as CheckoutController
    participant Service as CheckoutService
    participant CartRepo as CartRepository
    participant Payment as PaymentGateway
    participant OrderRepo as OrderRepository
    participant Events as EventBus

    Client->>Controller: [A1] cartId=string, paymentMethod=PaymentMethodDto, discountCode?
    activate Controller
    Note over Controller: validate body via CheckoutRequestDto, extract userId from JWT
    Controller->>Service: [A2] cartId=string, paymentMethod=PaymentMethodDto, discountCode?, userId=string
    activate Service

    Service->>CartRepo: cartId=string
    activate CartRepo
    CartRepo-->>Service: [A3] cartPayload
    deactivate CartRepo

    Note over Service: assert status = open, applyDiscount → finalTotal + discountAmount
    Service->>Payment: [A4] amount=number, currency=string, method=PaymentMethodDto
    activate Payment
    Note over Payment: (external boundary - stop tracing here) charge via Stripe
    Payment-->>Service: transactionId=string, status=success
    deactivate Payment

    Note over Service: build CreateOrderDto
    Service->>OrderRepo: [A5] createOrderPayload
    activate OrderRepo
    Note over OrderRepo: DB transaction - insert orders, bulk-insert order_items, update carts.status
    OrderRepo-->>Service: [A6] orderRecord
    deactivate OrderRepo

    Service->>Events: [A7] orderCreatedEvent
    Events-->>Service: ack

    Service-->>Controller: [A6] orderRecord
    deactivate Service
    Controller-->>Client: status=201, orderId=string, total=number, currency=string
    deactivate Controller
```

#### Chú thích dữ liệu

**[A1]** `Client` → `CheckoutController` — raw HTTP body:
```
cartId: string              // required; format: uuid
paymentMethod: PaymentMethodDto  // required; { type: "credit_card" | "paypal", token: string }
discountCode?: string       // optional; maxLength: 20
```

**[A2]** `CheckoutController` → `CheckoutService` — sau khi thêm userId từ JWT:
```
cartId: string              // giữ nguyên từ [A1]
paymentMethod: PaymentMethodDto  // giữ nguyên từ [A1]
discountCode?: string       // giữ nguyên từ [A1]
userId: string              // tạo mới; extract từ JWT bởi @CurrentUser(); format: uuid
```

**[A3]** `CartRepository` → `CheckoutService` — giỏ hàng từ DB:
```
id: string                  // required; format: uuid
userId: string              // required; format: uuid
status: "open" | "checked_out"  // required; phải là "open" để tiếp tục
currency: string            // required; ISO 4217
items: CartItem[]           // required; min length: 1
createdAt: Date             // required
```

**[A4]** `CheckoutService` → `PaymentGateway` — payload thanh toán:
```
amount: number              // derive từ Cart.items + applyDiscount(); đơn vị: cents; > 0
currency: string            // giữ nguyên từ [A3] Cart.currency
method: PaymentMethodDto    // giữ nguyên từ [A2] paymentMethod
```

**[A5]** `CheckoutService` → `OrderRepository` — CreateOrderDto:
```
userId: string              // giữ nguyên từ [A2]
cartId: string              // giữ nguyên từ [A2]
total: number               // derive: finalTotal sau discount
currency: string            // giữ nguyên từ [A3]
transactionId: string       // tạo mới; từ PaymentGateway response
items: CartItem[]           // giữ nguyên từ [A3] Cart.items
discountCode?: string       // bị loại bỏ tại bước này; đã được áp dụng vào total
discountAmount: number      // bị loại bỏ tại bước này; không lưu vào Order
```

**[A6]** `OrderRepository` → `CheckoutService` — Order đã lưu:
```
id: string                  // tạo mới; uuid do DB generate
userId: string              // giữ nguyên từ [A5]
total: number               // giữ nguyên từ [A5]
currency: string            // giữ nguyên từ [A5]
status: "pending"           // tạo mới; DB default; enum: "pending" | "paid" | "failed" | "cancelled"
transactionId: string       // giữ nguyên từ [A5]
createdAt: Date             // tạo mới; DB default now()
```

**[A7]** `CheckoutService` → `EventBus` — payload event order.created:
```
orderId: string             // từ [A6] Order.id
userId: string              // giữ nguyên từ [A2]
total: number               // giữ nguyên từ [A6] Order.total
```

#### Sơ đồ quyết định

```mermaid
flowchart TD
    Start([POST /orders/checkout])
    V1{Cart exists?}
    V2{status = open?}
    V3{discountCode valid?}
    V4{Payment succeeded?}
    E1[404 - Cart not found]
    E2[409 - Cart already checked out]
    E3[400 - Invalid discount code]
    E4[402 - Payment failed]
    OK[Persist order + emit order.created]
    Done([201 Created])

    Start --> V1
    V1 --no--> E1
    V1 --yes--> V2
    V2 --no--> E2
    V2 --yes--> V3
    V3 --invalid--> E3
    V3 --valid or absent--> V4
    V4 --failed--> E4
    V4 --success--> OK
    OK --> Done
```

---

## Điểm kết thúc

| Loại | Mô tả | File | Function |
| --- | --- | --- | --- |
| External API | Charge via Stripe qua PaymentGateway | `src/payments/payment.gateway.ts` | `PaymentGateway.charge` |
| DB Write | Insert dòng vào bảng `orders` | `src/orders/order.repository.ts` | `OrderRepository.create` |
| DB Write | Bulk-insert vào bảng `order_items` | `src/orders/order.repository.ts` | `OrderRepository.create` |
| DB Write | Cập nhật `carts.status = "checked_out"` | `src/orders/order.repository.ts` | `OrderRepository.create` |
| Event | `order.created` publish lên exchange `orders` | `src/orders/checkout.service.ts` | `CheckoutService.checkout` |
| Response | `201` với `{ orderId, total, currency, status: "pending" }` | `src/api/orders/checkout.controller.ts` | `CheckoutController.create` |

---

## Câu hỏi còn mở

- [ ] `applyDiscount` có kiểm tra ngày hết hạn của mã giảm giá không, hay chỉ kiểm tra chuỗi mã?
- [ ] Event `order.created` được publish bên trong DB transaction hay sau khi commit?
