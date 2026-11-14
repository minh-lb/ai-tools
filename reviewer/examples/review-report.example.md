Ví dụ hư cấu về review patch webhook, không phải kết quả review hay chạy test thật.

## 🔍 Review lần 1 - 2026/11/14 10:23

✅ Resolved (0), ⚠️ Problems (1)

Ưu tiên: 🔴 High (0), 🟠 Medium (1), 🟡 Low (0)

---

### ✅ Resolved: 0

Không có. Đây là lần review đầu tiên.

### ⚠️ Problems: 1

- [🟠 Medium] R-001 — Lỗi enqueue vẫn được xác nhận thành công (OPEN).

### 📝 Detail

#### [🟠 Medium] R-001 — Lỗi enqueue vẫn được xác nhận thành công

- **📄 File:** `src/webhook.ts:28-29` (patch new-side)
- **🔎 Lý do:** [CORR] Patch chuyển `await queue.enqueue(event)` thành fire-and-forget, rồi trả 200. Thiết kế được chấp nhận tại `docs/design/webhook.md:12-17` (tài liệu giả định của ví dụ) yêu cầu chỉ trả 2xx sau durable enqueue và quy định provider dừng retry khi nhận 2xx. Code tại vị trí trên acknowledge trước khi có bằng chứng enqueue thành công, trái yêu cầu đó. Nếu enqueue reject trước khi lưu event, event bị mất; trước thay đổi rejection đi qua error handler để provider retry. Chưa được cung cấp tests hiện có để xác minh chúng bao phủ contract này.
- **🛠️ Đề xuất chỉnh sửa:** Chỉ acknowledge sau khi enqueue thành công, xử lý failure theo provider contract. 200 sau durable enqueue vẫn phù hợp contract này.
- **🧪 Cách kiểm tra:** Giả lập queue enqueue reject trước khi lưu event: handler không trả 2xx và provider được phép retry. Khi durable enqueue thành công, handler vẫn trả 200. Đây là regression test đề xuất, chưa chạy trong ví dụ.
