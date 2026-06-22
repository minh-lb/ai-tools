# Debugger

Skill debug toàn vòng: điều tra root cause → apply targeted fix → verify → ghi báo cáo. Dùng khi cần giải quyết một defect từ đầu đến cuối trong một lượt.

---

## Khác gì `bugfix`?

| | `debugger` | `bugfix` |
|---|---|---|
| Phạm vi | Investigate → Fix → Verify + báo cáo có cấu trúc | Fix trực tiếp với hậu kiểm nhiều vòng |
| Output | Report viết vào `docs/debugger/reports/` | Không ghi report file |
| Khi nào dùng | Cần traceability, data flow analysis, mapping ledger | Cần fix nhanh với review cycle ketat |

---

## Cách invoke

```text
Use $debugger to ...
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

Nếu không có thông tin nào, mô tả triệu chứng — skill sẽ tự tìm entry point.

---

## Các trường hợp sử dụng

### Bug có stack trace

```text
Use $debugger to fix this error in the order checkout flow:
TypeError: Cannot read properties of undefined (reading 'total')
  at CartService.calculateTotal (cart.service.ts:142)
  at CheckoutController.submit (checkout.controller.ts:67)
Input: cart with 0 items.
```

```text
Use $debugger to fix this PHP exception that only happens when the user has no address saved:
ErrorException: Trying to get property 'city' of non-object in OrderController.php:89
```

---

### Bug không có stack trace — chỉ có triệu chứng

```text
Use $debugger. The invoice PDF shows the wrong subtotal when a discount code is applied.
Expected: subtotal after discount. Actual: subtotal before discount. Tax is calculated correctly.
```

```text
Use $debugger. Users report that after updating their profile photo, the old photo still appears
until they hard-refresh. Reproduced on Chrome and Safari.
```

---

### Regression — trước đây chạy tốt, giờ bị hỏng

```text
Use $debugger. Email notifications for new orders stopped sending after last Thursday's deployment.
No error in logs, emails just don't arrive. Check git blame on the notification path.
```

```text
Use $debugger. Pagination on the product listing page broke sometime in the last 2 weeks —
page 2 and beyond return the same results as page 1.
```

---

### Bug chỉ xuất hiện trên production

```text
Use $debugger. The payment webhook fails only in production with a 500 error.
Local and staging work fine. POST /api/webhooks/stripe.
Error in prod logs: "Invalid signature" but the secret is confirmed correct.
```

---

### Bug có data mapping phức tạp qua nhiều layer / service

```text
Use $debugger. The shipping address sent to our logistics provider is missing the apartment number
even though the user saved it correctly. Trace the mapping from the order form through
OrderService -> ShippingDTO -> LogisticsApiClient.
```

```text
Use $debugger. The currency field is USD in our database but the third-party billing API receives "us".
Somewhere in the integration layer the value is being transformed incorrectly.
```

---

### Race condition / concurrency

```text
Use $debugger. When two users submit the same order form simultaneously, we sometimes get duplicate
orders. No unique constraint violation at DB level. Stack: PHP/Laravel.
```

```text
Use $debugger. Inventory goes negative during flash sales. Deduction logic is in StockService::deduct().
```

---

### Performance regression với cần báo cáo

```text
Use $debugger. The /api/orders endpoint jumped from ~80ms to 2–3s after last week's deploy.
Trace the query path and generate a report with the root cause and fix applied.
```

---

### Logic / conditional bug

```text
Use $debugger. The discount tier is wrong for orders exactly at the boundary.
Orders of $100 should get 10% but get 5%. Orders of $101 get 10% correctly.
File: PricingService.php, method: applyVolumeDiscount().
```

---

## Workflow của skill

Skill chạy theo 3 phase liên tiếp:

```
Phase 1 — Investigate
  Frame defect → Pick evidence level → Trace full path → git blame nếu là regression
  → Verify contract boundaries → Build data mapping ledger
  → Produce Data Flow + Mermaid Logic Flow → Rank hypotheses → State root cause → Check impact radius

Phase 2 — Fix
  Plan minimal fix → Apply to root-cause path only → Add/update regression test

Phase 3 — Verify
  Run affected tests → Spot-check impact radius → Write report → Summary in conversation
```

---

## Đọc output của skill

Trước khi fix, skill trình bày:

```
Evidence Level     — độ mạnh của bằng chứng (failing test → code inspection only)
Trace Entry        — file/function/route bắt đầu trace
Data Flow          — luồng input → output qua các layer
Data Mapping Analysis — mapping ledger tại từng boundary, đánh dấu Mismatch
Logic Flow         — Mermaid flowchart với guard, branch, error path
Confirmed Facts    — facts có backing từ test/trace/log/code
Likely Root Cause  — Because <condition>, <component> produces <wrong>, which leads to <symptom>
Rejected Hypotheses — giả thuyết đã loại trừ và lý do
Impact Radius      — callers, downstream consumers, adjacent flows
Confidence         — High / Medium / Low + lý do
Fix Plan           — minimal change, giải thích tại sao không sửa rộng hơn
```

Sau khi fix và verify:

```
Fix Applied        — files đã thay đổi + change summary
Test Result        — regression test + adjacent tests PASS/FAIL
Verification Outcome — Fixed / Partial / Blocked + lý do
```

Report được ghi vào `docs/debugger/reports/<slug>.md`, index tại `docs/debugger/main.md`.

> Skill **không tự commit** sau khi fix. Bạn review output rồi quyết định có commit không.

---

## Khi nào skill dừng và hỏi lại

- Fix có blast radius rộng (schema migration, breaking API change) — skill nêu rõ rủi ro trước khi edit.
- Phát hiện second independent issue ngoài phạm vi ban đầu — skill surface ra và chờ approval mở rộng scope.
- Evidence không đủ để confirm root cause — skill ghi Confidence = Low và gợi ý gather thêm evidence.

---

## Không dùng skill này khi

- Bạn chỉ muốn refactor hoặc thêm feature mới (không phải bug).
- Lỗi do thiếu requirement, không phải code sai.
- Bạn đã biết chính xác dòng cần sửa và chỉ muốn sửa nhanh — gõ thẳng vào chat.
- Bạn chỉ muốn điều tra mà chưa sửa — dừng sau Phase 1 và thông báo cho skill.
