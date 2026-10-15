# Quality Gates cho mọi tài liệu

## P0 — phải xử lý trước khi bàn giao

- Sai deliverable/scope/format hoặc thiếu section người dùng yêu cầu; bao gồm **tự tạo file Plan ngoài yêu cầu** cho fix bug đơn giản.
- Claim không có căn cứ, code paths hoặc test/deploy status bịa.
- Mâu thuẫn giữa yêu cầu, states, API schema, error handling, acceptance.
- Bước thay đổi production/data có rủi ro mà không có điều kiện an toàn/checkpoint cần thiết.
- JSON/YAML/command ví dụ sai cú pháp làm người đọc thất bại.
- Yêu cầu bản đầy đủ nhưng chỉ trả summary/placeholder.

## P1 — cải thiện độ dùng được

- Thuật ngữ/ID không nhất quán; thiếu traceability.
- Câu dài, một requirement chứa nhiều behavior khó test.
- Plan task quá to, phụ thuộc ẩn, verification chung chung.
- Trùng lặp, heading/template rỗng, "đề xuất" bị viết thành "thực tế".

## Trình tự review

1. Đối chiếu output contract và source.
2. Kiểm tra semantics và internal consistency.
3. Kiểm tra testability và executable steps.
4. Kiểm tra rủi ro và recovery theo mức độ.
5. Cuối cùng chỉnh văn phong/bố cục.

Review chỉ được kết luận `Đạt` khi đã có cơ sở; nếu thiếu dữ kiện đáng kể, mô tả đúng mức độ chưa thể xác minh. Dùng [review template](../../templates/other/review-report.md) khi yêu cầu report.
