# Ví dụ minh họa — không phải kết quả review thật

<!-- Tên file đầu ra minh họa: docs/review-code/2026-10-10-checkout-retry-safety.md -->

> Ví dụ dưới đây hoàn toàn hư cấu. Paths, findings, revision và test results chỉ minh họa cách điền report; không được sao chép thành bằng chứng cho một review thực tế.

# Báo cáo Code Review — checkout-retry-safety

- **Ngày:** 2026-10-10
- **Chế độ:** git-diff
- **Phạm vi:** Retry xử lý checkout và migration thêm checkout reference
- **Revision / diff:** `main...feature/orders` (base `1111111`, merge-base `2222222`, head `3333333`; minh họa)
- **Ngoại lệ:** Frontend và deployment/IaC không nằm trong diff minh họa

## Checklist

| Code | Hạng mục | Trạng thái |
|---|---|---|
| CORR | Correctness | ✅ Đạt |
| SEC | Security | ✅ Đạt |
| PERF | Performance | ✅ Đạt |
| ARCH | Architecture | ✅ Đạt |
| DB | Database | 🟡 Medium |
| API | API | ✅ Đạt |
| UI | Frontend UI | — N/A |
| A11Y | Accessibility | — N/A |
| TEST | Testing | 🟡 Medium |
| MAINT | Maintainability | 🟡 Medium |
| OBS | Observability | ✅ Đạt |
| CONC | Concurrency | 🟠 High |
| INFRA | Infrastructure | — N/A |
| COMPAT | Backward Compatibility | ✅ Đạt |

## Findings

- [CONC] High — Retry sau timeout có thể thu tiền khách hàng hai lần.

  Path: `src/orders/checkout.service.ts:42-50`

  Why: Nếu payment provider đã xử lý charge nhưng response bị timeout, retry gọi lại thao tác mà không gửi stable idempotency key. Cùng một checkout có thể tạo hai khoản thu.

  Fix: Dùng idempotency key ổn định theo checkout/order ID, lưu hoặc đối soát kết quả provider trước khi retry, và thêm regression test cho kết quả không xác định sau timeout.

- [DB] Medium — Backfill trong migration có thể giữ lock lâu trên bảng orders.

  Path: `db/migrations/2026_10_10_add_checkout_reference.sql:18-22`

  Why: Ví dụ migration cập nhật toàn bộ rows trong một transaction. Trên bảng lớn, thao tác có thể giữ row locks lâu và chặn writes trong rollout.

  Fix: Dùng expand-and-contract; chạy backfill theo batch có checkpoint/throttle và đo query/lock impact trên quy mô gần production.

- [MAINT] Medium — `submitCheckout` trộn nhiều trách nhiệm khiến thay đổi và kiểm thử dễ gây hồi quy.

  Path: `src/orders/checkout.service.ts:12-31`

  Why: Method vừa chuẩn hóa request, chọn pricing policy, ghi order, vừa gửi confirmation. Những phần này có lý do thay đổi và failure modes khác nhau; sửa pricing có thể vô tình ảnh hưởng persistence/notification, còn unit test phải mock nhiều ranh giới. Finding này dựa trên rủi ro thay đổi/test cụ thể, không chỉ vì method dài.

  Fix: Tách normalization/pricing thuần khỏi use-case orchestration; làm transaction và notification boundary rõ ràng (ví dụ transactional outbox nếu cần bảo đảm delivery). Giữ orchestration tập trung nếu các bước thực sự là một use case.

- [TEST] Medium — Chưa có regression test cho timeout mơ hồ rồi retry.

  Path: `src/orders/checkout.service.ts:42-50`

  Why: Test happy path không kiểm tra trường hợp provider đã xử lý charge nhưng caller nhận timeout; duplicate charge có thể lọt qua.

  Fix: Thêm integration test với provider stub mô phỏng “đã xử lý nhưng response timeout”, rồi xác nhận retry không tạo charge thứ hai.

## Summary

1. **Phạm vi/revision:** Diff minh họa `main...feature/orders`, từ merge-base đến head `3333333`, tập trung vào checkout retry và migration. Không xem frontend hoặc deployment/IaC; vì vậy UI, Accessibility và Infrastructure là N/A.
2. **Rủi ro/giả định:** Rủi ro chính là duplicate charge trong retry path; mức độ phụ thuộc vào provider có xử lý request trước timeout hay không. Migration có rủi ro lock khi dữ liệu lớn. `submitCheckout` cũng trộn các bước có failure modes khác nhau, làm tăng rủi ro khi sửa và kiểm thử. Giả định minh họa: column mới là additive, old/new app cùng đọc/ghi an toàn và public API shape không đổi.
3. **Checks:** Ví dụ giả định: `pnpm test --filter checkout` — PASS. Chưa chạy migration/lock test; đây không phải kết quả thực thi thật.
