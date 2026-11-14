# reviewer

Skill review **tài liệu kỹ thuật** (design, spec, ADR, API docs, runbook, README) và **code**. Báo cáo bằng tiếng Việt, tập trung lỗi có bằng chứng và cách sửa. Chỉ kích hoạt khi gọi rõ `$reviewer`, `@reviewer`, `/reviewer`, tên skill hoặc handoff chỉ định skill từ workflow đang hoạt động. Giữ policy explicit-only hiện có.

## Dùng nhanh

```text
/reviewer documents docs/design/checkout.md
/reviewer codebase src/checkout/
/reviewer git-diff main...feature/orders
/reviewer git-diff staged
/reviewer git-diff https://github.com/OWNER/REPO/pull/42
```

`documents` đánh giá tính nhất quán, contract, failure paths, tính khả thi và khả năng xác minh của tài liệu. Phân biệt đề xuất với hành vi đã triển khai. `codebase` đánh giá hành vi hiện tại; mặc định code/tests/config của repo. `git-diff` review code và tài liệu trong source được chỉ định; chỉ báo lỗi mới hoặc bị làm nặng hơn.

Review nhánh/PR mặc định xét **toàn bộ thay đổi của nhánh hiện tại so với nhánh gốc**, tương đương `git diff <base>...HEAD` (merge-base → HEAD), bao gồm thay đổi từ mọi commit trước đó. Review lại cũng dùng toàn bộ diff này và đối chiếu findings cũ. SHA HEAD chỉ xác định snapshot/gắn inline comment, không giới hạn vào commit mới nhất. Base lấy từ target branch của PR, yêu cầu rõ hoặc quy ước project; không tự coi tracking branch hay `main` là base. Chỉ review riêng commit/patch/staged/working tree khi được yêu cầu rõ. Pin SHAs, không checkout hoặc trộn dirty changes. Thiếu source/ref thì hỏi phần còn thiếu. Review chỉ đọc source, không tự sửa code/tài liệu.

## Kết quả review

- **Local:** tạo `docs/reviewer/<YYYY-MM-DD_description>.md` tại project root (Git root nếu có); không có repo thì dùng thư mục gọi ban đầu. Ví dụ: `docs/reviewer/2026-11-14_checkout-design.md`. Dùng ngày local, description ASCII kebab-case; mặc định `code-review` hoặc `document-review`. Nếu trùng, thêm `-2`, `-3` vào description, không ghi đè. Kiểm tra boundary/symlink và đọc lại file trước khi trả link.
- **Pull request:** đăng comment tổng hợp trên đúng PR, kèm reviewed head SHA; phần Detail của từng vấn đề là inline comment tại dòng code/tài liệu tương ứng. Danh sách Problems liên kết tới các inline comments; trả link tổng hợp sau khi xác minh. Comment tổng hợp không có mục Detail; nếu không thể gắn dòng trong diff, ghi ngắn gọn tình trạng chưa đăng ở Problems và trả chi tiết chưa đăng trong chat. Gọi skill review PR bao gồm yêu cầu đăng comment; nếu muốn chỉ xem trước, ghi rõ “draft” hoặc “không đăng comment”. Review lại phải kiểm tra từng finding cũ trên source hiện tại: nếu đã sửa, reply xác nhận với bằng chứng rồi resolve đúng thread và kiểm tra trạng thái. Resolved liên kết tới reply xác nhận; OPEN/UNVERIFIED giữ mở. Không resolve chỉ vì tác giả nói đã sửa hoặc dòng diff đã outdated. Nếu chưa sửa thì phản hồi ngắn lý do vẫn mở, giữ ID/link cũ. Khi review thực tế có Problems = 0, không còn thiếu bằng chứng quan trọng và đã kiểm tra HEAD không đổi, tự gửi review APPROVE kèm nội dung tổng hợp. Không approve dựa trên giả định/mô phỏng đã sửa. Nếu còn vấn đề hoặc chưa đủ bằng chứng thì gửi COMMENT. Tôn trọng yêu cầu draft/không approve; nếu GitHub không cho approve (ví dụ PR của chính tài khoản reviewer), ghi rõ hạn chế. Không tự request changes bằng platform action, merge hay resolve thảo luận không liên quan. Không tạo file local trừ khi yêu cầu thêm.
- **Bị chặn ghi/đăng:** trả đầy đủ report inline và nói rõ chưa lưu/chưa đăng cùng nguyên nhân. Không coi file local là đã hoàn thành yêu cầu comment PR.

Dùng chung [template](templates/review-report.template.md) cho file và PR comment. Có [ví dụ review code local](examples/review-report.example.md) và [ví dụ review tài liệu trên PR](examples/document-review.example.md); cả hai đều là tình huống hư cấu.

Report mở đầu bằng `Review lần N - YYYY/MM/DD HH:mm`, tổng `Resolved`, `Problems` và ưu tiên `High`, `Medium`, `Low` (thêm `Critical` khi có). Sau đó là danh sách Resolved, Problems và Detail với `📄 File`, `🔎 Lý do`, `🛠️ Đề xuất chỉnh sửa`, `🧪 Cách kiểm tra`. Cách kiểm tra nêu thao tác/test và kết quả mong đợi, tách khỏi hướng sửa; không coi test đề xuất là đã chạy. Có thể bỏ File trên PR khi inline anchor đã đủ rõ. Thêm `🔁 Tái hiện` trước Đề xuất chỉnh sửa khi cần các bước tối thiểu để hiểu lỗi. Local giữ Detail trong file; PR chuyển Detail thành inline comments. Gộp cùng root cause, giữ finding ID qua các vòng và xếp severity giảm dần. Resolved chỉ gồm lỗi từ vòng trước đã xác minh sửa; Problems gồm lỗi mở và lỗi cũ `UNVERIFIED` được ghi rõ. Thống kê ưu tiên chỉ tính Problems. Xem [quy tắc đối chiếu](references/review-history.md). Đánh giá 14 dimensions trong quá trình review, không xuất bảng checklist hay phần Phạm vi và xác minh riêng. Bằng chứng hoặc giới hạn cần thiết nằm trong Detail của vấn đề liên quan; không suy ra deployment readiness. Không có findings cũng phải ghi rõ. Embedded handoff dùng cùng cách xuất report, đồng thời trả finding IDs/verdict cho orchestrator.

## Độc lập và tiết kiệm token

Copy nguyên thư mục `reviewer/` vào nơi host đọc skills. Local review không bắt buộc MCP, browser, network, subagent hay package ngoài. Git cần cho diff repository; PR comment cần connector hoặc CLI đã xác thực có quyền ghi comment. Thiếu runtime chỉ review tĩnh và ghi rõ giới hạn.

Nạp entrypoint + process + severity; tài liệu chuyên đề theo rủi ro, hướng dẫn document/PR theo chế độ, template khi xuất kết quả, examples khi cần. Đánh giá applicability của đủ 14 dimensions; `N/A` không có nghĩa là chưa đọc.

## Xác minh skill

```sh
python3 -B -m unittest discover -s reviewer/tests -v
```

Checks offline kiểm tra metadata, links và ngân sách từ. [Scenarios](tests/scenarios.md) dùng để thử hành vi; static checks không chứng minh đã thử agent hay đăng comment thật.

[Instructions](SKILL.md) · [Process](references/review-process.md) · [Severity](references/severity-model.md) · [Document review](references/technical-documents.md) · [PR delivery](references/pull-request.md)
