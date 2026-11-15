Ví dụ hư cấu: comment tổng hợp và inline comment được minh họa riêng, chưa đăng PR thật.

## 🔍 Review lần 2 - 2026/11/14 10:23

✅ Resolved (1), ⚠️ Problems (1)

Ưu tiên: 🔴 High (1), 🟠 Medium (0), 🟡 Low (0)

### 🔎 Scope & Verification

- **Nguồn/snapshot:** Ví dụ hư cấu; không có commit hay PR/MR thật.
- **Đã kiểm tra:** Chỉ minh họa lập luận tĩnh; chưa chạy test/runtime.
- **Giới hạn:** Chưa xác minh repo/PR thực tế.
- **Kết luận:** Needs verification

---

### ✅ Resolved: 1

- [🟠 Medium] R-001 — Retry chưa có giới hạn. Xác minh: `docs/design/payment.md:12-16` (head-side) nay giới hạn 3 lần và chuyển sang đối soát thủ công khi hết lượt; khắc phục thiếu sót của vòng 1. Khi đăng thật, mục này liên kết tới reply xác nhận bên dưới và chỉ ghi thread đã resolved sau khi kiểm tra trạng thái thành công.

### ⚠️ Problems: 1

- [🔴 High] R-002 — Retry tạo lần thu tiền mới, trái cam kết chỉ thu một lần (OPEN). Inline comment R-002 tại `docs/design/payment.md:35-39`; khi đăng thật, entry này chứa link comment do provider trả về.

---

## 💬 Ví dụ inline comment R-002 (tách khỏi comment tổng hợp)

Anchor giả định hợp lệ trong PR diff: head `2222222222222222222222222222222222222222`, file `docs/design/payment.md`, side `RIGHT`, dòng 35–39. Đây là metadata minh họa, phải xác minh diff/API thực trước khi đăng.

#### [🔴 High] R-002 — Retry tạo lần thu tiền mới, trái cam kết chỉ thu một lần

- **🔎 Lý do:** [CONC] Mục Retry cam kết “mỗi đơn chỉ bị thu tiền một lần”, cho phép retry khi timeout. Payment flow yêu cầu tạo request ID mới và gọi charge ở mỗi lần giao lại. Nếu provider đã charge nhưng response bị mất, retry theo flow này có thể thu lần hai. Tài liệu không có bước khôi phục kết quả hay deduplication giữa các lần giao; hai chỉ dẫn dẫn đến thiết kế không giữ được cam kết. Đây là lỗi của thiết kế được mô tả, chưa phải bằng chứng production đang thu trùng.
- **🔁 Tái hiện:** Theo flow tại dòng 35–39, provider charge thành công nhưng response bị mất; client timeout và giao lại. Request ID mới khiến lần charge tiếp theo không được nhận diện là retry của lần đầu. Đây là kịch bản phân tích thiết kế, chưa chạy thực tế.
- **🛠️ Đề xuất chỉnh sửa:** Định nghĩa idempotency key ổn định theo payment attempt, contract deduplication của provider và cách truy vấn kết quả sau timeout; cập nhật cả Retry lẫn Payment flow.
- **🧪 Cách kiểm tra:** Đối chiếu cả hai mục để bảo đảm retry giữ cùng idempotency key và có contract deduplication. Khi có implementation, mô phỏng charge thành công, mất response và giao lại cùng attempt; kỳ vọng chỉ có một charge và retry trả đúng kết quả attempt gốc. Đây là acceptance scenario đề xuất, chưa chạy.

---

## 💬 Ví dụ reply xác nhận R-001 (trong thread cũ)

✅ **R-001 — Đã xác minh giải quyết** ở head giả định `2222222222222222222222222222222222222222`.

Mục Retry tại `docs/design/payment.md:12-16` đã quy định tối đa 3 lần và chuyển sang đối soát thủ công khi hết lượt, khắc phục thiếu giới hạn của vòng 1. Đã đối chiếu tĩnh tài liệu giữa hai vòng trong tình huống minh họa; chưa chạy implementation/test runtime.

Chỉ sau khi người dùng xem preview và xác nhận riêng REPLY/RESOLVE mới reply, resolve đúng thread R-001, rồi đọc lại trạng thái trước khi ghi nhận thành công. Đây là ví dụ hư cấu; chưa reply hay resolve PR thật. R-002 vẫn OPEN và không được resolve.
