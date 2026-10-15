# Output example — Bản đầy đủ và bản tóm tắt

## Case A: User yêu cầu "In toàn bộ Specification"

- ĐÚNG: in đúng toàn bộ section, bảng, acceptance và open questions của Spec (không thiếu nhánh lỗi).
- SAI: in mục lục rồi viết "các mục còn lại tương tự" hoặc chỉ trả summary được gọi là full document.
- Nếu giới hạn kênh chat không phù hợp, cung cấp file **đã thực sự tạo** chứa toàn văn và nói rõ phần chat là preview, không khẳng định preview là full text.

## Case B: User yêu cầu "Tóm tắt Specification trong 5 dòng"

- ĐÚNG: chỉ 5 dòng trọng tâm; nêu giới hạn các thông tin chưa quyết nếu quan trọng.
- SAI: cố gắng in thêm full Spec/Plan.

## Case C: User yêu cầu "Xuất `spec.md` và đưa link"

- ĐÚNG: ghi `spec.md`, kiểm tra non-empty/nội dung, rồi đưa đúng link do runtime hỗ trợ.
- SAI: báo "đã tạo file" dù chưa có file; hoặc tự tạo PDF thay cho Markdown.
