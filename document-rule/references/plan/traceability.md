# Traceability và Dependencies trong Plan

## Mapping ngược từ Spec

| Spec ID | Plan task | Verification |
|---|---|---|
| FR-001 | IMP-03 | IT-01 / AC-001 |
| BR-002 | IMP-02 | UT-02 / AC-002 |
| NFR-001 | IMP-02, IMP-04 | IT-04 / AC-004 |

Đây là mapping ví dụ, không phải test đã tồn tại. Nếu chưa biết test IDs, mô tả scenario hoặc gắn `Planned`.

## Hai phép kiểm tra

- **Coverage:** mỗi requirement trong scope có task hoặc explicit exclusion với lý do.
- **Verifiability:** mỗi task quan trọng có cách chứng minh outcome; mỗi AC quan trọng có test/check dự kiến.

## Dependencies

Đánh số task sao cho thứ tự thi công hợp lý; chỉ ra blocker, precondition và nơi có quyết định chưa chốt. Phân biệt phụ thuộc **bắt buộc** với thứ tự **khuyến nghị**. Không bịa approval, owner hay lịch phát hành.

## Khi Spec thay đổi

Kiểm tra ảnh hưởng tới task/verification liên quan; giữ các ID ổn định hoặc ghi rõ mapping thay đổi. Không để Plan tham chiếu đến requirement không còn tồn tại.
