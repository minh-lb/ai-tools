# review-code

Skill review backend và browser frontend; báo cáo bằng tiếng Việt. Chỉ kích hoạt khi gọi rõ `$review-code`, `@review-code`, `/review-code` hoặc yêu cầu dùng skill theo tên. Native mobile/desktop UI ngoài phạm vi.

## Dùng nhanh

```text
/review-code codebase
/review-code codebase src/checkout/
/review-code git-diff main...feature/orders
/review-code git-diff staged
```

`codebase` mặc định xem application code, tests/config liên quan của repository trong workspace. `git-diff` chấp nhận PR, patch, commit/range hoặc layer working tree được chỉ định; chỉ báo lỗi mới hoặc bị làm nặng hơn. Thiếu mode/source hoặc refs không có thì hỏi đúng phần còn thiếu.

Với `base...head`, skill pin SHAs và review merge-base → head; đọc source từ head, không checkout hoặc trộn dirty changes. Hai-dot/tip-to-tip chỉ dùng khi yêu cầu rõ. Patch thiếu context vẫn review được phần có bằng chứng, kèm giới hạn xác minh.

## Độc lập và tiết kiệm token

Copy nguyên thư mục `review-code/` vào nơi host đọc skills. Không cần skill khác, MCP, browser, network, subagent hay cài package. Cần quyền đọc source; Git cần cho diff trong repository. Host phải hỗ trợ đọc skill và file; nếu thiếu runtime/test/browser thì skill review tĩnh và ghi rõ giới hạn. `agents/openai.yaml` giữ chế độ explicit-only trên host hỗ trợ policy này; host khác tuân theo mô tả trong SKILL.md.

Chỉ nạp entrypoint + process + severity lúc đầu; tài liệu chuyên đề nạp theo rủi ro thực tế, template khi viết report, example khi cần. Vẫn kiểm tra applicability của đủ 14 dimensions; UI/A11Y bắt buộc đánh giá khi có browser UI. Một reviewer là mặc định; delegation chỉ khi đã được cho phép. Không bắt buộc chạy toàn bộ checklist công cụ cho một diff nhỏ.

## Kết quả

Mỗi finding có `Path`, `Why`, `Fix`, bằng chứng/trigger/tác động cụ thể. Gộp cùng root cause; không đếm thiếu regression test của cùng bug thành finding thứ hai. Tối giản/reuse phải giữ validation, recovery, security và accessibility cần thiết.

Checklist phân biệt severity, `✅ Đạt` (đã đánh giá, chưa có finding), `⚪ Chưa xác minh` (thiếu bằng chứng) và `— N/A` (không áp dụng). Disposition: `Changes requested` khi có defect đáng kể, `Needs verification` khi còn giới hạn quan trọng, `Ready` khi đủ bằng chứng cho scope. Static review không chứng minh release readiness hay WCAG conformance.

Report application code được lưu tại **thư mục gọi ban đầu**: `docs/review-code/YYYY-MM-DD-<slug>.md`, không phải thư mục cài skill; không ghi đè và không đi qua symlink ra ngoài boundary. Gọi từ `src/` thì report nằm trong `src/docs/review-code/`. Nếu không ghi được, trả đầy đủ inline và nói rõ chưa lưu file. Chỉ sửa tài liệu skill thì không tạo application report.

Review không tự sửa application code. Kiểm tra side effects trước khi chạy lệnh, không tự chạy production/destructive checks, không tiết lộ secrets và không nhận kết quả test của revision khác làm bằng chứng.

## Xác minh skill

```sh
python3 -B -m unittest discover -s review-code/tests -v
```

Checks offline kiểm tra metadata cơ bản, links nội bộ, đủ dimensions trong template và ngân sách từ của phần bắt buộc. Không cần dependency ngoài Python standard library. [Scenario suite](tests/scenarios.md) dùng để thử hành vi trong ngữ cảnh riêng; static checks không thay thế thử agent.

[Instructions](SKILL.md) · [Process](references/review-process.md) · [Severity](references/severity-model.md) · [Template](templates/review-report.template.md) · [Example](examples/review-report.example.md)
