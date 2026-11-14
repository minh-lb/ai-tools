# reviewer

Review tài liệu thiết kế/kỹ thuật và code, báo cáo bằng tiếng Việt. Chỉ kích hoạt khi gọi rõ `$reviewer`, `@reviewer`, `/reviewer`, tên skill hoặc handoff chỉ định; giữ policy explicit-only. Copy nguyên thư mục này vào nơi host đọc skills; local review không bắt buộc MCP, network hay subagent.

## Dùng nhanh

```text
/reviewer documents docs/design/checkout.md
/reviewer codebase src/checkout/
/reviewer git-diff main...feature/orders
/reviewer git-diff staged
/reviewer git-diff https://github.com/OWNER/REPO/pull/42
```

Review nhánh/PR xét **toàn bộ merge-base → HEAD**, kể cả khi review lại. Base lấy từ PR target hoặc yêu cầu/quy ước project; không đoán từ tracking branch. Code phải đối chiếu **thiết kế → implementation → tests**. Thiếu tài liệu hoặc bằng chứng thì ghi giới hạn, không tạo lỗi giả hay tự suy ra an toàn.

## Kết quả

- **Local:** `docs/reviewer/YYYY-MM-DD_description.md` tại gốc project, không ghi đè. Ví dụ `2026-11-14_checkout-design.md`.
- **PR:** tổng hợp gồm lần review/thời gian, Resolved/Problems và ưu tiên; không có Detail. Mỗi vấn đề có inline comment với Lý do, Đề xuất chỉnh sửa, Cách kiểm tra; Problems liên kết tới comment. Cần connector/CLI đã xác thực. Ghi rõ `draft`/`không đăng` nếu chỉ muốn xem trước.
- **Review lại:** giữ ID theo nguyên nhân dù đổi file/dòng. Xác minh fix → reply thread cũ → resolve và kiểm tra trạng thái; lỗi chưa sửa/chưa xác minh giữ mở. Recheck cả base/HEAD trước ghi.
- **Approve:** chỉ khi review thực tế không còn Problems và đủ bằng chứng; giả định/mô phỏng không đủ điều kiện. Không tự merge. GitHub không cho tác giả tự approve PR của mình.

[Template](templates/review-report.template.md) · [Ví dụ local](examples/review-report.example.md) · [Ví dụ PR](examples/document-review.example.md)

## Hướng dẫn theo tình huống

[Quy trình](references/review-process.md) · [Severity](references/severity-model.md) · [Đối chiếu thiết kế](references/design-alignment.md) · [Tài liệu kỹ thuật](references/technical-documents.md) · [Xuất report](references/output-delivery.md) · [Finding và review lại](references/review-history.md) · [Đăng PR](references/pull-request.md) · [Snapshot](references/review-snapshot.md)
