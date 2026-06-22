# Báo Cáo Debugger

Viết nội dung bằng tiếng Việt. Giữ nguyên technical terms bằng English, gồm code identifiers, API fields, protocol names, schema names, enum values, và các section keys.

## Title

Tiêu đề ngắn gọn cho defect.

## Date

`YYYY-MM-DD`

## Environment

Môi trường và version nơi bug xảy ra: dev / staging / prod, branch, commit hash nếu có.

## Symptom

Mô tả cái gì đang hỏng, xuất hiện ở đâu, và ảnh hưởng đến ai.

## Expected Behavior

Hành vi đúng lẽ ra phải xảy ra.

## Evidence

**Evidence level** (ghi mức mạnh nhất): `Deterministic failing test` / `Reliable local reproduction` / `Stack trace or runtime exception` / `Logs with correlation` / `Concrete wrong output with known input` / `Code inspection only`

Paste raw artifacts trực tiếp — không paraphrase:

- stack trace / exception
- wrong output vs expected output
- logs with correlation ID / timestamps
- payload (request / response)
- user steps to reproduce
- git diff or blame on the critical path

## Trace Entry

File, function, request path, job, worker, command, hoặc stack frame chính xác nơi bắt đầu trace.

## Data Flow

Mỗi participant là một layer riêng biệt. Mỗi mũi tên ghi: tên method/endpoint + toàn bộ payload liên quan (field names, types, actual values). Ghi rõ return value ở từng bước. Dùng `Note` để đánh dấu transformation xảy ra bên trong một participant. Đánh dấu điểm mismatch bằng `Note over X,Y: ⚠`.

```mermaid
sequenceDiagram
    participant Browser
    participant Controller
    participant Validator
    participant Service
    participant Repository
    participant DB
    participant ExternalAPI

    Browser->>Controller: POST /orders (cart_id: 881, currency: USD, user_id: 42)

    Controller->>Validator: validate request (cart_id: required|int, currency: required|size:3, user_id: required|int)
    Validator-->>Controller: passes — CheckoutRequest (cartId: 881, currency: USD, userId: 42)

    Controller->>Service: submitOrder (cartId: 881, currency: USD, userId: 42)

    Service->>Repository: findCart (cartId: 881)
    Repository->>DB: SELECT * FROM carts WHERE id = 881
    DB-->>Repository: Cart (id: 881, user_id: 42, items: product_id 7 qty 2 price 64.50, total: 129.00)
    Repository-->>Service: Cart (id: 881, userId: 42, total: 129.00)

    Service->>Repository: save Order (id: null, userId: 42, cartId: 881, total: 129.00, currency: USD, status: pending)
    Repository->>DB: INSERT INTO orders (user_id, cart_id, total, currency, status) VALUES (42, 881, 129.00, USD, pending)
    DB-->>Repository: Order (id: 10842, user_id: 42, currency: USD, total: 129.00)
    Repository-->>Service: Order (id: 10842, currency: USD, total: 129.00)

    Service->>ExternalAPI: charge OrderPaymentDTO (orderId: 10842, amount: 129.00, currency: USD)
    Note over ExternalAPI: toArray() gọi strtolower(USD) → us
    Note over Service,ExternalAPI: ⚠ currency USD → us — strtolower() trong toArray() phá vỡ ISO 4217
    ExternalAPI->>ExternalAPI: POST /charges (order_id: 10842, amount: 129.00, currency: us)
    ExternalAPI-->>Service: 422 (error: invalid_currency, message: Expected ISO 4217 uppercase)

    Service-->>Controller: throws PaymentFailedException (invalid_currency)
    Controller-->>Browser: HTTP 500 (message: Payment failed)
```

## Data Mapping Analysis

| Boundary | Source Shape | Target Shape | Mapping / Transformation | Status | Notes |
|----------|--------------|--------------|--------------------------|--------|-------|
| controller -> service | | | | | |
| service -> repository | | | | | |
| service A -> service B | | | | | |

`OK` = mapping đúng, `Mismatch` = mapping sai. Kiểm tra: field renames, drops, type casts, enum/status translation, unit conversions, null/empty semantics, nested paths, semantic reinterpretation. Chỉ rõ boundary đầu tiên có Mismatch.

## Logic Flow

```mermaid
flowchart TD
    A[Entry: input received] --> B{Guard or validation}
    B -->|valid| C[Main path]
    B -->|invalid| D[Error path]  
    C --> E{Branch condition}
    E -->|case A| F[Success outcome]
    E -->|case B| G[Failure outcome]  
```

## Confirmed Facts

Fact có backing từ test, trace, log, hoặc direct code evidence:

- Fact 1

## Rủi ro

**Severity**: `Critical` / `High` / `Medium` / `Low`

**Trigger conditions**: điều kiện cụ thể kích hoạt bug (ví dụ: chỉ xảy ra khi concurrent requests > N, hoặc khi field X có giá trị Y, hoặc sau khi dependency được upgrade).

**Hậu quả**: mô tả tác động thực tế — data loss, service outage, financial impact, user impact, silent failure không log, v.v.
