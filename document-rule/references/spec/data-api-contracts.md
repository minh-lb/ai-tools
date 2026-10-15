# Data Contract và API Specification

## Khi nào cần

Chỉ thêm API/schema nếu tài liệu đang đặc tả interface hoặc thay đổi đó phụ thuộc rõ vào contract. Nếu user chỉ yêu cầu quy tắc nghiệp vụ, tránh đưa chi tiết DTO không cần thiết.

## Checklist API

1. Method, path, caller, authentication/authorization.
2. Request: field, type, required, nullable, validation, format, default (nếu có).
3. Success: HTTP status, schema/fields, side effects.
4. Error: HTTP status, domain code, schema, side effects.
5. Retry/idempotency, pagination/filter/sort/rate-limit **chỉ khi liên quan**.
6. Backward compatibility/deprecation nếu sửa contract đã dùng.

## Checklist dữ liệu

- Entity ID, field/type, nullability, trạng thái và invariant.
- Với mutation: field nào **đổi**, field nào **không đổi**, khi nào commit; field/event derivation nếu có.
- Với read: source và consistency/visibility nếu yêu cầu phụ thuộc.
- Tên trường, mã lỗi, enum phải nhất quán trong Spec, examples và AC.

**Không** tự chọn `401/403/404/409`, UUID, timestamp format, DB index hoặc JSON schema nếu hệ thống hiện có chưa được xác minh. Ví dụ giả định phải dán nhãn; khi thiếu quyết định quan trọng, ghi `Open Question`.

Dùng [API Spec template](../../templates/spec/api-spec.md).
