# Debugger

Skill điều tra defect bằng cách trace data flow và logic flow từ nguồn input vào. **Không sửa code** — chỉ phân tích, map transformations, ghi báo cáo để handoff cho fix. Dùng `bugfix` nếu muốn fix ngay.

---

## Cách invoke

```text
Use $debugger to investigate ...
```

---

## Cung cấp context càng cụ thể càng tốt

| Tốt | Không tốt |
|---|---|
| Stack trace hoặc error message đầy đủ | "bị lỗi" |
| File/function/route liên quan | "trong code" |
| Input gây lỗi hoặc bước tái hiện | "thỉnh thoảng xảy ra" |
| Behavior mong đợi vs thực tế | "không đúng" |
| Môi trường (local/staging/prod) | không đề cập |

---

## Các trường hợp sử dụng

### Data flow qua nhiều layer / service

```text
Use $debugger. The currency field is USD in our DB but the billing API receives "us".
Trace the transformation from OrderService through every layer to the outbound payload.
```

### Lỗi có stack trace

```text
Use $debugger to investigate this error — do not fix:
TypeError: Cannot read properties of undefined (reading 'total')
  at CartService.calculateTotal (cart.service.ts:142)
Input: cart with 0 items.
```

### Triệu chứng không có stack trace

```text
Use $debugger. Invoice PDF shows wrong subtotal when a discount code is applied.
Expected: subtotal after discount. Actual: subtotal before discount. Tax is correct.
```

### Regression — trước đây chạy tốt

```text
Use $debugger. Email notifications stopped sending after last Thursday's deployment.
No error in logs. Trace the notification path and check git blame + lock file diffs.
```

### Lỗi chỉ xảy ra trên production

```text
Use $debugger. Payment webhook fails only in prod with "Invalid signature".
Local and staging work fine. POST /api/webhooks/stripe. Do not modify anything.
```

### Race condition / flaky

```text
Use $debugger. Inventory goes negative during flash sales ~1 in 20 requests.
Trace the deduction flow in StockService::deduct() and identify the race window.
Note what instrumentation is needed to confirm if reproduction is not reliable.
```

### Logic / conditional

```text
Use $debugger. Orders of $100 get 5% discount but should get 10%.
Trace the logic in PricingService::applyVolumeDiscount().
```

---

## Output của skill

Report ghi vào `docs/debugger/reports/<slug>.md`, index tại `docs/debugger/main.md`.

Các section trong report: `Symptom` → `Expected Behavior` → `Evidence` → `Trace Entry` → `Data Flow` (sequenceDiagram) → `Data Mapping Analysis` → `Logic Flow` (flowchart TD) → `Confirmed Facts` → `Rủi ro`.

---

## Khi nào skill dừng và hỏi lại

- Phát hiện second independent issue ngoài phạm vi — surface và chờ approval.
- Flaky bug không thể reproduce — ghi trong `Confirmed Facts` mức độ chắc chắn, đề xuất instrumentation cụ thể cần thêm trong `Rủi ro`.

---

## Không dùng khi

- Muốn fix ngay → dùng `bugfix`.
- Refactor hoặc thêm feature mới.
- Đã biết chính xác dòng cần sửa → gõ thẳng vào chat.
