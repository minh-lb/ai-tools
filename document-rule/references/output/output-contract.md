# Output Contract — đúng nội dung user yêu cầu

## Thuộc tính cần chốt (nội bộ trước khi viết)

- **Deliverables:** Spec? Plan? report? một section? file? bao nhiêu file?
- **Scope:** nội dung bắt buộc/phải loại trừ; giới hạn nguồn và thời điểm.
- **Mode:** viết mới, revise, review, summarize, print/display, export.
- **Format:** Markdown, JSON-only, YAML, Mermaid, plain text, DOCX/PDF/file.
- **Language & depth:** theo user; giữ case chính xác cho code/schema/IDs.

## Quy tắc bắt buộc

1. Yêu cầu "viết/in/hiển thị" → xuất **nội dung thực tế**, không chỉ thông báo đã viết.
2. Yêu cầu "chỉ in X" → **chỉ X**, không preamble, summary, conclusion hoặc phần khác.
3. Yêu cầu "toàn bộ" → không tự cắt/ẩn bằng `...`, `[truncated]`, `[TODO]`; khi kênh không phù hợp, cung cấp file thực sự đầy đủ và **nói rõ** phần chat là excerpt.
4. Yêu cầu đúng schema/heading/order → theo đúng, không thêm key/section ngoài contract.
5. Yêu cầu Spec + Plan → Spec trước, Plan link requirement IDs; yêu cầu Plan đơn lẻ → chỉ Plan. Yêu cầu **fix bug/sửa code nhỏ** mà không yêu cầu tài liệu → **không tự xuất Spec/Plan file**; xem [plan-decision](../plan/plan-decision.md).
6. Yêu cầu review → report findings, không tự rewrite; yêu cầu rewrite → trả bản rewrite, không tự review dài.
7. Không in evidence giả, test result giả hoặc claim file đã tạo khi chưa có.
8. Nếu yêu cầu cả nội dung và file → đáp ứng cả hai.

## Priorities

Yêu cầu người dùng cụ thể và mới nhất quyết định phạm vi output, miễn không xung đột ràng buộc bắt buộc của nền tảng và thực tế công cụ. Template chỉ là trợ giúp — không áp đặt form khi format đã được user chọn.

Xem [inline output](inline-and-scoped-output.md) và [file export](file-export.md).
