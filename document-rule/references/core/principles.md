# Nguyên tắc nền tảng

## Ưu tiên theo thứ tự

1. **Fidelity:** đáp ứng đúng yêu cầu người dùng và các nguồn có thẩm quyền; không thay đổi logic khi chỉ được biên tập.
2. **Correctness:** không biến suy đoán thành sự thật; không tạo API, schema, số liệu hay trạng thái giả.
3. **Testability:** mọi hành vi quan trọng có điều kiện và kết quả kiểm tra được.
4. **Usability:** người đọc mục tiêu có thể tìm thông tin và thực hiện đúng công việc.
5. **Conciseness:** chỉ giữ nội dung phục vụ quyết định/thực hiện/kiểm chứng; không lan man.

## Tách mục đích

- **Specification:** `WHAT`, `WHEN`, input/output, constraints, errors, acceptance.
- **Implementation Plan:** `HOW`, order, dependencies, risk, verification, done.
- **Design/ADR:** alternatives, rationale, trade-offs.
- **Runbook:** trigger, prerequisites, procedure, signals, recovery.
- **README:** setup và vận hành thường ngày đã xác minh.

Nếu người dùng chỉ đòi một tài liệu, không tự tạo tài liệu liên quan. Nếu yêu cầu Spec + Plan, hoàn thiện Spec và ID trước khi map Plan. Với task sửa code/bug đơn giản, **không tự tạo Spec/Plan file**; xem [quyết định có cần Plan](../plan/plan-decision.md).

## Quy phạm

- `MUST`: bắt buộc; `MUST NOT`: cấm; `SHOULD`: nên, trừ khi có lý do cụ thể; `MAY`: tùy chọn.
- ID ổn định: `FR-`, `BR-`, `NFR-`, `AC-`, `IMP-`; không đổi ID giữa phiên bản khi ý nghĩa còn nguyên.
- Không thêm chương mục không áp dụng hoặc placeholder vô nghĩa.
- Sử dụng level chi tiết tương ứng rủi ro và sự phức tạp; không yêu cầu mọi tài liệu đều có rollback, API, database.
