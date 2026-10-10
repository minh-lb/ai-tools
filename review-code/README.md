# `@review-code` — Hướng dẫn sử dụng

`@review-code` là skill code review cho **backend và browser-based web frontend**. Skill chỉ chạy khi bạn gọi rõ ràng; không tự kích hoạt khi bạn chỉ yêu cầu sửa lỗi hoặc viết code.

Phạm vi frontend gồm web app đa trang, SPA, SSR/SSG và các mô hình hybrid; áp dụng cho React, Vue, Angular và framework web tương tự. Bao gồm responsive web UI, forms, routing, client state, accessibility, browser security và performance. **Native mobile/desktop UI không nằm trong phạm vi hiện tại.**

## Bắt đầu nhanh

Gọi skill với một trong hai mode:

```text
/review-code codebase
```

Review code trong workspace hiện tại. Có thể giới hạn scope ngay trong yêu cầu, ví dụ `src/checkout/`, page/component cụ thể hoặc một feature end-to-end. Nếu chỉ ghi `codebase`, skill dùng application code trong repository làm phạm vi mặc định và nêu rõ các phần không kiểm tra được.

```text
/review-code git-diff main...feature/orders
```

Review thay đổi của `feature/orders` so với nhánh đích `main`. Cùng cú pháp này dùng được cho diff chỉ có frontend, backend, hoặc cả hai.

Nếu không chọn mode hoặc không cung cấp diff source cho `git-diff`, skill hỏi để làm rõ thay vì tự đoán.

## Chọn mode

| Mode | Dùng khi | Phạm vi |
|---|---|---|
| `codebase` | Muốn đánh giá một repository, module hoặc feature hiện có | Code trong scope đã nêu, cùng tests/config có liên quan |
| `git-diff` | Muốn review một thay đổi cụ thể | Lỗi do thay đổi gây ra hoặc làm trầm trọng hơn |

### So sánh nhánh trong `git-diff`

Dùng cú pháp `<base>...<head>`: nhánh đích trước, nhánh thay đổi sau.

```text
/review-code git-diff main...feature/orders
```

Mặc định skill review kiểu PR: từ **merge base** của hai nhánh đến `head`. `main..feature/orders` hoặc so sánh hai tip không được dùng thay thế mặc định vì có thể đưa thay đổi riêng của nhánh base vào kết quả. Chỉ dùng so sánh tip-to-tip khi bạn yêu cầu rõ.

Skill xác minh refs và ghi lại SHA của base, merge base và head. Diff nhánh mặc định không bao gồm thay đổi staged, unstaged hoặc untracked trong working tree. Skill đọc code theo cây source của `head`, không tự checkout/chuyển nhánh. Nếu base/head không rõ, ref không tồn tại hoặc hai nhánh không có common ancestor, skill sẽ hỏi phần cần làm rõ.

`git-diff` cũng chấp nhận PR diff, commit range hoặc patch cụ thể.

## Frontend được review những gì?

Khi scope có browser UI, skill đánh giá cả hành vi người dùng lẫn rủi ro hệ thống liên quan:

- **UI correctness:** route/deep link, refresh/back-forward, forms, loading/empty/success/error/permission states, retry, async race, stale response, duplicate action, optimistic update và rollback.
- **Rendering/architecture:** component/state ownership, client/server boundary, SSR/CSR, hydration, error/loading boundaries, data flow và browser-only APIs.
- **Accessibility:** semantic HTML, accessible name/role/state, keyboard/focus, form labels/errors, contrast, reflow/zoom, dialogs, motion và screen-reader updates. Dùng WCAG 2.2 AA làm baseline thực tế khi project chưa quy định target khác; **không tuyên bố đạt WCAG chỉ từ static review hoặc automated scan**.
- **Security:** XSS/unsafe DOM sinks, URL/redirect handling, client-side auth assumptions, client bundle/source maps, token/PII storage, `postMessage`, third-party scripts, CSP và CSRF theo auth model.
- **Performance:** bundle/route splitting, images/fonts, render/hydration work, long tasks, list rendering, layout shift và Core Web Vitals khi phù hợp.
- **Responsive/browser compatibility:** layout trên viewport được hỗ trợ, zoom/reflow, long/localized content, browser support matrix và fallback.
- **Tests:** component/browser tests cho hành vi người dùng, route/state transitions, keyboard và error paths; kết quả chỉ được ghi nếu thực sự chạy.

Finding frontend phải chỉ ra trigger có thể tái hiện và ảnh hưởng cụ thể tới người dùng, accessibility, security, performance hoặc compatibility. Không báo cáo sở thích về màu sắc, spacing hay component style nếu không có rủi ro hoặc yêu cầu sản phẩm rõ ràng. Source review không thay thế kiểm tra trên browser/screen reader; report sẽ nêu rõ giới hạn xác minh.

## Cổng cần thiết và tối giản an toàn

Với mỗi feature, component, helper, dependency, abstraction hoặc configuration mới/thay đổi đáng kể, skill sẽ hỏi:

1. Thứ này có cần cho requirement/defect đã nêu không?
2. Codebase hoặc dependency hiện có đã làm được chưa? Đã tìm trong target revision chưa?
3. Standard library của ngôn ngữ/runtime có giải quyết được không?
4. API/tính năng native của platform, browser hoặc framework có đáp ứng không?
5. Dependency phù hợp đã có trong manifest/lockfile chưa? Nếu thêm dependency mới, lợi ích có đủ để biện minh cho chi phí security, maintenance, license, compatibility và runtime/bundle không?
6. Một lời gọi/biểu thức rõ ràng—thậm chí một dòng—đã đủ chưa, hay nó sẽ che giấu logic quan trọng?
7. Cách triển khai tối thiểu nhưng chạy đúng và đầy đủ là gì?

Chỉ nêu finding khi có bằng chứng về duplication, dependency/abstraction không cần thiết hoặc complexity gây chi phí/rủi ro cụ thể; không suy đoán product feature là thừa khi thiếu requirement.

**Lười nhưng không ẩu:** tối giản không được dùng làm lý do cắt validation cần thiết ở trust boundary, error handling/recovery phù hợp, security controls, hoặc Accessibility áp dụng cho web UI. Nếu gộp/bỏ một control, phải xác minh control tương đương vẫn hoạt động ở đúng boundary. Một dòng code không phải mục tiêu nếu nó làm mờ các đảm bảo đó.

## Quy trình chung

1. Xác định scope, intent/acceptance criteria và entry points.
2. Liệt kê các scenario khác biệt đáng kể trước khi trace luồng.
3. Trace success, failure, retry, partial failure và side effects. Với UI, trace user action → state → request/response → rendered result.
4. Áp dụng cổng cần thiết/tái sử dụng/tối giản an toàn, rồi kiểm tra 14 dimensions phù hợp; UI và Accessibility phải được đánh giá khi có browser UI.
5. Chạy tests/static checks/browser checks chỉ khi an toàn và khả thi; ghi đúng lệnh/kết quả hoặc lý do không chạy.
6. Viết findings có bằng chứng, vị trí code, tác động và hướng khắc phục.

## Reviewer đơn lẻ hay review song song?

Mặc định dùng một reviewer. Với thay đổi có ý nghĩa ở cả frontend và backend—đặc biệt khi cùng một feature/API contract đi xuyên hai phía hoặc diff lớn/rủi ro cao—skill có thể chạy hai lượt chuyên biệt song song nếu subagent được hỗ trợ và việc delegation được cho phép. Bạn cũng có thể yêu cầu rõ `review riêng frontend và backend` hoặc `chỉ dùng một reviewer`.

Hai reviewer phải dùng cùng snapshot/ref và phạm vi; lượt frontend tập trung UI/A11Y và hành vi browser, lượt backend tập trung API/auth/dữ liệu/side effects. Reviewer chính xác minh và hòa giải findings ở ranh giới contract, hoàn tất cả 14 dimensions và tạo **một report duy nhất**. Diff nhỏ, thay đổi chỉ một phía hoặc docs-only thường không cần tách.

## Kết quả và report

Mỗi report có đủ 14 dòng checklist, findings theo severity và summary về scope/revision, assumptions, checks đã chạy và residual risks:

`CORR`, `SEC`, `PERF`, `ARCH`, `DB`, `API`, `UI`, `A11Y`, `TEST`, `MAINT`, `OBS`, `CONC`, `INFRA`, `COMPAT`.

- Viết report bằng tiếng Việt; giữ technical terms và field `Path`, `Why`, `Fix`.
- Khi review application code ở `codebase` hoặc `git-diff`, lưu report dưới `docs/review-code/` trong workspace theo tên `YYYY-MM-DD-<short-description>.md`; không ghi đè report đã tồn tại.
- Dùng [report template](templates/review-report.template.md); [example](examples/review-report.example.md) chỉ minh họa, paths/findings/test results trong đó là hư cấu.
- Nếu không tìm thấy finding, nêu rõ điều đó và phạm vi đã review. Dùng N/A chỉ khi dimension không áp dụng; ví dụ, UI và A11Y là N/A với backend-only scope.
- Nếu chỉ review/chỉnh sửa skill hoặc tài liệu, không tạo code-review report trong `docs/review-code/`.

## An toàn và giới hạn

- Review là read-only với application code; không tự sửa implementation, tests hoặc config. Report là output được tạo trong một code review.
- Xem xét test scripts trước khi chạy. Không chạy lệnh có thể truy cập production, gửi message bên ngoài hoặc thay đổi dữ liệu/hệ thống nếu chưa được cho phép; nếu không xác định được side effects thì không chạy.
- Code review bổ sung, không thay thế build, lint, CI, automated tests, integration tests, browser QA hay manual accessibility testing.
- Không khẳng định test/check đã chạy nếu chưa có bằng chứng; không chép secrets, tokens hoặc dữ liệu cá nhân không cần thiết vào report.
- Nêu rõ các browser, viewport, screen reader, test suites hoặc subsystem chưa được kiểm tra; không trình bày review một phần như review toàn bộ.

## Tài liệu liên quan

- [Skill instructions](SKILL.md)
- [Review process and diff semantics](references/review-process.md)
- [Frontend UI review checklist](references/frontend.md)
- [Accessibility review checklist](references/accessibility.md)
- [Severity model](references/severity-model.md)
- [Report template](templates/review-report.template.md)
- [Illustrative report example](examples/review-report.example.md)
