# Quy tắc xuất file / định dạng

## Kiểm tra trước khi trả link

1. Có công cụ phù hợp định dạng user yêu cầu (Markdown, PDF, DOCX, v.v.) không?
2. Đã **tạo thực tế** file đúng path, đúng extension và cấu trúc?
3. Đã kiểm tra file không rỗng, sections/nội dung đủ, encoding tiếng Việt đúng?
4. Nếu có link, đó có phải link của file đang tồn tại, không phải path suy đoán?
5. Nếu user yêu cầu cả inline và file: output không tự thay một phần bằng phần kia.

## Định dạng

- Markdown: heading hierarchy, lists, tables, fenced code, relative links hợp lệ.
- JSON: schema/keys đúng contract, parse được, không comments/trailing comma.
- YAML: indentation, types, escaping chính xác.
- DOCX/PDF: khi runtime hỗ trợ, kiểm tra cấu trúc và bản render nếu có thể.
- Multiple files: tên ổn định, mục lục/điều hướng, kiểm tra link giữa các file.

## Khi có giới hạn

Nếu không thể tạo file, nói rõ giới hạn; không khẳng định hoàn thành. Nếu nội dung quá dài để hiển thị, có thể đưa file đầy đủ **khi tạo được file**, kèm mô tả rõ phần chat là preview chứ không phải toàn văn. Không tự đổi định dạng file không được user cho phép.
