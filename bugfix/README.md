# Bugfix

Skill điều tra và sửa bug end-to-end. Dùng khi cần agent trace root cause, không nhảy thẳng vào sửa code.

---

## Cách invoke

```text
Use $bugfix to ...
```

---

## Cung cấp context càng cụ thể càng tốt

Skill hoạt động tốt hơn khi bạn cung cấp:

| Tốt | Không tốt |
|---|---|
| Stack trace hoặc error message đầy đủ | "bị lỗi" |
| File/function/route liên quan | "trong code" |
| Input gây lỗi hoặc bước tái hiện | "thỉnh thoảng xảy ra" |
| Behavior mong đợi vs thực tế | "không đúng" |
| Môi trường (local/staging/prod) | không đề cập |

Nếu không có thông tin nào, chỉ cần mô tả triệu chứng — skill sẽ tự tìm entry point.

---

## Các trường hợp sử dụng

### Bug có stack trace

```text
Use $bugfix to investigate this error in the order checkout flow:
TypeError: Cannot read properties of undefined (reading 'total')
  at CartService.calculateTotal (cart.service.ts:142)
  at CheckoutController.submit (checkout.controller.ts:67)
Input: cart with 0 items.
```

```text
Use $bugfix to fix this PHP exception that only happens when the user has no address saved:
ErrorException: Trying to get property 'city' of non-object in OrderController.php:89
```

---

### Bug không có stack trace — chỉ có triệu chứng

```text
Use $bugfix. The invoice PDF shows the wrong subtotal when a discount code is applied.
Expected: subtotal after discount. Actual: subtotal before discount. The tax is calculated correctly.
```

```text
Use $bugfix. Users report that after updating their profile photo, the old photo still appears
until they hard-refresh. Reproduced on Chrome and Safari.
```

---

### Regression — trước đây chạy tốt, giờ bị hỏng

```text
Use $bugfix. The email notification for new orders stopped sending after last Thursday's deployment.
It worked fine before. No error in logs, emails just don't arrive.
```

```text
Use $bugfix. Pagination on the product listing page broke sometime in the last 2 weeks —
page 2 and beyond return the same results as page 1.
```

---

### Bug chỉ xuất hiện trên production

```text
Use $bugfix. The payment webhook fails only in production with a 500 error.
Local and staging work fine. The webhook hits POST /api/webhooks/stripe.
Error in prod logs: "Invalid signature" but the secret is confirmed correct.
```

```text
Use $bugfix. File uploads work locally but fail silently in production — no error thrown,
file just doesn't appear in storage. Stack: PHP/Laravel, S3-compatible storage.
```

---

### Performance regression

```text
Use $bugfix. The /api/orders endpoint was responding in ~80ms last week,
now it's averaging 2–3 seconds. No code changes to that endpoint were deployed.
Database is MySQL. Check for N+1 or missing index issues.
```

```text
Use $bugfix. The dashboard page load time jumped from 1.2s to 6s after we merged
the new analytics widget. Investigate what's causing the slowdown.
```

---

### Intermittent / flaky bug

```text
Use $bugfix. Our integration test "should process refund correctly" fails about 20% of runs in CI
but always passes locally. It's been flaky for 3 days. Test uses a real DB.
```

```text
Use $bugfix. Users occasionally get logged out mid-session with no warning.
Happens maybe 1 in 50 sessions. No pattern in the logs. Stack: Node.js, JWT auth, Redis sessions.
```

---

### Race condition / concurrency

```text
Use $bugfix. When two users submit the same order form at the same time,
we sometimes end up with duplicate orders in the database. Table: orders, no unique constraint
is being violated, so it's not caught at DB level. Stack: PHP/Laravel.
```

```text
Use $bugfix. Our stock deduction logic has a race condition under high load —
inventory goes negative during flash sales. The decrement is in StockService::deduct().
```

---

### Database / query bug

```text
Use $bugfix. The query in ReportRepository::getMonthlySales() returns incorrect totals
when the date range spans across a month boundary. Stack: PostgreSQL, Eloquent ORM.
```

```text
Use $bugfix. After running migration 2024_11_add_soft_delete_to_invoices,
the invoice list API returns an empty array even though records exist in the DB.
```

---

### Memory leak

```text
Use $bugfix. Our Node.js worker process memory grows from ~150MB to ~1.5GB over 12 hours
before the container is restarted. It processes job queue messages. No obvious leak in recent commits.
```

---

### Logic / conditional bug

```text
Use $bugfix. The discount calculation applies the wrong tier for orders exactly at the boundary value.
Orders of $100 should get 10% off but are getting 5%. Orders of $101 get 10% correctly.
File: PricingService.php, method: applyVolumeDiscount().
```

---

## Đọc output của skill

Trước khi sửa, skill sẽ trình bày:

```
Evidence Level    — độ mạnh của bằng chứng (1 = failing test, 6 = code inspection only)
Confidence        — mức độ chắc chắn của hypothesis
Risk Level        — Low / Medium / High / Critical
Bug Category      — loại bug được phân loại
Root Cause Hypothesis — Because <condition>, <component> produces <wrong>, which leads to <symptom>
Data Flow         — luồng dữ liệu từ input đến output
Logic Flow        — các nhánh logic liên quan
Rejected Hypotheses — các giả thuyết đã loại trừ và lý do
Invariants to Preserve — các điều kiện không được phá vỡ sau khi sửa
Repair Options    — các hướng sửa hoặc containment đã cân nhắc
Fix vs Containment Decision — chọn Forward fix / Revert / Contain first và lý do
Chosen Safe Fix   — hướng sửa an toàn được chọn
Pre-fix Impact Preview — caller, contract, flow nào có thể bị ảnh hưởng
Validation Plan   — sẽ kiểm tra gì sau sửa
Approval Gate     — có cần dừng chờ user duyệt trước khi sửa hay không
```

Sau khi sửa:

```
What Changed      — những gì đã thay đổi
Impact Check      — các caller, consumer, contract bị ảnh hưởng
Warnings          — hành vi có thể thay đổi ngoài phạm vi bug
Validation        — những gì đã được kiểm tra và những gì chưa
Confidence        — độ chắc chắn sau khi fix
Review Verdict    — Pass hoặc Revise sau khi hậu kiểm
Review Cycle      — vòng review hiện tại (1 hoặc 2)
Review Findings   — findings phải đi trước summary, có severity và tag [new] / [unresolved]
Rework Performed  — nếu phải sửa lại sau review thì đã sửa gì và validate lại ra sao
Rollback / Containment — cách rollback hoặc containment nếu fix chưa đủ an toàn
Observability     — log/metric/debug artifact nào được thêm hoặc cố ý không thêm
Post-fix Logic Summary — logic sau khi sửa hoạt động như thế nào
Residual Risk     — rủi ro còn lại cần theo dõi
```

> Skill **không tự commit** sau khi fix. Bạn review output rồi quyết định có commit không.

Workflow mới yêu cầu hậu kiểm sau khi fix:

- Sau khi sửa và validate, skill phải tự review lại fix bằng code-review mindset.
- Review phải ghi findings trước, có severity `Critical/Major/Minor/Suggestion`; chỉ được `Pass` khi không còn `Critical/Major`.
- Nếu review thấy fix chưa chuẩn, quá rộng, hoặc validation còn yếu, skill phải quay lại sửa.
- Nếu review làm thay đổi root cause hypothesis, risk level, invariants, hoặc hướng `Forward fix / Revert / Contain first`, skill phải quay lại pre-fix planning gate và phát lại pre-fix summary trước khi sửa tiếp.
- Sau mỗi lần sửa lại, skill phải chạy lại `Impact Check` + `Validation` + review.
- Giới hạn tối đa 2 vòng review-driven rework; quá ngưỡng này thì dừng và nêu rõ unresolved findings.

---

## Không dùng skill này khi

- Bạn chỉ muốn refactor hoặc thêm feature mới (không phải bug)
- Lỗi là do thiếu requirement, không phải code sai
- Bạn đã biết chính xác dòng cần sửa và chỉ muốn sửa nhanh — gõ thẳng vào chat
