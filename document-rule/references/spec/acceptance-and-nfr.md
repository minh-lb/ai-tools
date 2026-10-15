# Acceptance Criteria, NFR và Traceability của Spec

## Acceptance Criteria phải test được

Ưu tiên `Given` bối cảnh/dữ liệu ban đầu; `When` một trigger; `Then` kết quả quan sát + dữ liệu/state/side effect.

- Đặt `AC-001` và map về `FR-*`, `BR-*`, `NFR-*`.
- Có happy path, validation, permission, invalid state; thêm race/retry khi có rủi ro.
- Không gộp nhiều biến thể khó kiểm chứng vào 1 AC nếu cần nhiều tests; 1 AC có thể map nhiều requirement khi scenario thực sự chung.
- Tránh AC: "hệ thống chạy đúng", "API hoạt động tốt", "giao diện thân thiện".

## NFR

- Ghi performance, availability, security, audit, observability, consistency, localization **nếu yêu cầu hoặc căn cứ có thật**.
- Có phương pháp đo, môi trường/tải và ngưỡng **nếu người dùng cung cấp**; thiếu ngưỡng thì `Chưa xác định`, không tự đặt số.
- Ví dụ: `NFR-001: Với hai yêu cầu hủy cùng đơn đang PENDING, tối đa một thao tác đổi trạng thái thành công.` → kiểm thử bằng concurrent requests.

## Matrix trước bàn giao

| Requirement ID | Flow / Contract | Acceptance |
|---|---|---|
| FR-001 | Success flow | AC-001 |
| BR-002 | Error path | AC-002 |
| NFR-001 | Concurrency rule | AC-004 |

Mọi requirement quan trọng cần AC hoặc giải thích ngoại lệ. Không tự tuyên bố test đã đạt: acceptance là **định nghĩa cần kiểm chứng**, không phải test report.
