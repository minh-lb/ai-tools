# reviewer

Review code và tài liệu kỹ thuật bằng tiếng Việt; chỉ kích hoạt khi gọi rõ `$reviewer`, `@reviewer`, `/reviewer`, tên skill hoặc handoff chỉ định.

## Dùng nhanh

```text
/reviewer documents docs/design/checkout.md
/reviewer codebase src/checkout/
/reviewer git-diff main...feature/orders
/reviewer git-diff staged
/reviewer git-diff https://github.com/OWNER/REPO/pull/42
/reviewer git-diff https://gitlab.com/GROUP/REPO/-/merge_requests/42
```

PR/MR review xét **toàn bộ merge-base → HEAD** kể cả khi review lại. Base lấy từ target thực, không đoán theo tracking branch. Đối chiếu **design → implementation → tests**. Thiếu bằng chứng là verification gap, không phải defect tự suy diễn.

## Quy tắc kết quả

- **Local:** lưu báo cáo mới tại `docs/reviewer/YYYY-MM-DD_description.md` và tránh ghi đè. Nếu người dùng yêu cầu chỉ trả lời trong chat, gửi báo cáo tại đó.
- **PR GitHub / MR GitLab:** mặc định **read-only**. Trước mọi thao tác comment/reply/resolve/approve, phải preview target, snapshot, verdict, nguyên văn comment/reply, file/line/discussion và xin xác nhận tường minh **theo loại hành động**. Yêu cầu “review PR/MR” không phải quyền đăng comment.
- **Fallback:** không anchor được inline finding thì chỉ đăng general comment/discussion đầy đủ chi tiết nếu người dùng xác nhận riêng fallback đó.
- **Review lại:** giữ ID theo root cause; reply/resolve thread cũ sau khi chứng minh fix và được xác nhận từng hành động.
- **Approve:** Ready có thể còn Low nonblocking findings; không tự APPROVE. Cần quyền approve riêng.
- **Embedded:** kết luận review không cấp quyền xuất bản cho orchestrator.

[Template](templates/review-report.template.md) · [Ví dụ local](examples/review-report.example.md) · [Ví dụ PR/MR](examples/document-review.example.md)

[Quy trình](references/review-process.md) · [Severity](references/severity-model.md) · [Đối chiếu thiết kế](references/design-alignment.md) · [Báo cáo](references/output-delivery.md) · [Review rounds](references/review-history.md) · [Preview/xác nhận](references/publication-consent.md) · [PR/MR](references/pull-request.md) · [Snapshot](references/review-snapshot.md)

## Kiểm thử contract

```bash
node --test reviewer/tests/*.test.mjs
```

Các test này kiểm tra hợp đồng hướng dẫn tĩnh, không thay thế benchmark hành vi agent hoặc đo token.
