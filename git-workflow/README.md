# Git Workflow

Nạp skill trước **mọi thao tác Git**, kể cả `status`, `diff`, `log`, kiểm tra remote và thao tác qua script, IDE, MCP, `gh`/`glab`. Trước mỗi thao tác, xác nhận `SKILL.md` cùng `references/purpose.md` và `references/principles.md` còn trong context; đọc lại nếu chưa nạp hoặc đã mất sau compaction.

Quy tắc nạp và quyền commit/push áp dụng cho mọi repository. Các hướng dẫn branch/merge/release dành cho GitFlow: production (thường là `main`/`master`), integration (thường là `develop`), `release/*`, `hotfix/*`; phải điều chỉnh theo mô hình thực tế.

Metadata không bảo đảm host tự nạp skill. Cần quy tắc trong `AGENTS.md`/hướng dẫn tương đương của host trỏ tới skill đã cài. Skill không tự cài quy tắc vào host; khi sử dụng hoặc cài sang repo/host khác, phải cấu hình tương ứng.

---

## Skill này làm được gì

### 1. Commit đúng chuẩn
- Validate và soạn commit message theo convention đã xác nhận trong repo, staged diff, và lịch sử commit.
- Không áp đặt scope, syntax, hay độ dài nếu repository không yêu cầu; message phải mô tả đúng outcome.
- Tự phát hiện khi staged diff gộp nhiều thay đổi không liên quan và đề xuất tách thành nhiều commit.
- Kiểm tra trước khi commit: không debug code sót lại (`console.log`, `dd()`, `var_dump()`...), không secret/`.env`; không thêm attribution trừ khi user/repo yêu cầu.

### 2. Branch đúng quy ước
- Tạo/đặt tên branch theo convention đã xác nhận trong repo; các prefix như `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`, `chore/*`, `docs/*`, `ci/*` là ví dụ phổ biến, không mặc định bắt buộc.
- Xác định đúng vai trò branch và remote trước khi thao tác (integration branch thực tế, thường là `develop`, cho task branch; production branch thực tế cho hotfix). Cập nhật local base/release branch bằng `fetch` + `merge --ff-only`; đồng bộ task/hotfix branch bằng `fetch` + merge thường. Workflow này không dùng rebase.

### 3. PR và merge
- Description phải đầy đủ theo toàn bộ diff và lịch sử branch so với target: bối cảnh, vấn đề/mục tiêu/lý do, thay đổi và tác động, kiểm chứng thực tế, kiểm tra chưa chạy và lý do, giới hạn đã biết, rủi ro/triển khai/rollback khi liên quan, liên kết đã xác minh. Nêu rõ breaking change, migration, cấu hình và dependency nếu có; không đoán thông tin chưa kiểm chứng.
- Viết câu tự nhiên, rõ ràng, dễ đọc; tránh chỉ liệt kê tên file, chép diff, thuật ngữ không giải thích hoặc claim chung chung. Theo template của repo, bỏ placeholder/comment và mục không áp dụng; ngắn gọn nhưng không thiếu thông tin.
- Soạn PR title/squash message đúng convention.
- Chọn merge mode theo repository settings/policy; preserve release/hotfix ancestry khi quy trình hoặc verification phụ thuộc source tip là ancestor.
- Checklist review trước khi mở PR (test pass, không còn conflict, migration an toàn...).
- **Tạo PR/MR có kiểm soát:** follow user's known language and local title convention; use the repository template when applicable, then show a complete preview including source owner/project, fetch/base remote, source push remote and approved push target, tip SHA, target project/branch, planned push, title, and full description. Trước preview, liệt kê mọi push destination hiệu lực bằng `git remote get-url --push --all <push-remote>`; nếu có nhiều hơn một destination, dừng và yêu cầu cấu hình/chọn đúng một đích được duyệt. Xác minh branch/SHA trên cùng endpoint đó và kiểm tra lại endpoint ngay trước khi push; không chia sẻ hoặc ghi log URL thô có credentials. Chỉ tạo sau khi người dùng duyệt rõ ràng; mọi thay đổi sau duyệt phải được preview và duyệt lại. Ưu tiên MCP đã xác thực phù hợp với nền tảng, chỉ rõ source và target project; nếu không có thì dùng `gh`/`glab` đã cài và đăng nhập, nhưng phải bind đúng source/target. Chỉ push source branch khi thiếu remote ref và user đã duyệt push trong preview; SHA không khớp hoặc lỗi network/auth thì dừng, không force-push. Sau khi tạo, xác minh URL, branch, title, trạng thái và nội dung. Dùng PR/MR cho protected branch theo chính sách repo; không bypass branch protection.

### 4. Resolve conflict — có kèm quy trình đảm bảo không mất code
Đây là phần được đầu tư kỹ nhất trong skill:
- Xác định thao tác đang diễn ra trước khi xử lý conflict. Chỉ resolve merge conflict theo quy trình; nếu đang rebase hoặc cherry-pick thì dừng, không sửa file hay tự chạy lệnh continue/abort, và hỏi người dùng hướng xử lý.
- Trước khi quyết định giữ bên nào, phải xem `git log`/`git show` của cả hai bên để hiểu **tại sao** mỗi bên thay đổi — không đoán từ mỗi đoạn diff.
- Mặc định **hợp nhất ý định cả hai bên** thay vì chọn 1 bên (phần lớn conflict thực tế là hai thay đổi hợp lệ, độc lập trên cùng một chỗ) — chỉ chọn hẳn 1 bên khi hai thay đổi thực sự loại trừ lẫn nhau.
- Sau khi resolve, verify bằng `git diff HEAD` và `git diff MERGE_HEAD` để đảm bảo không âm thầm làm mất phần đóng góp của bên nào.
- Xử lý riêng conflict xóa/đổi tên file (`deleted by us/them`, `both added`) và lockfile (`package-lock.json`...) — không dùng `--ours`/`--theirs` cho lockfile mà regenerate lại.
- Ghi lại danh sách file bị conflict và cách resolve vào **body của merge commit**.
- Dừng và hỏi khi conflict ảnh hưởng business logic, authorization, financial behavior, phạm vi file rộng/không rõ, hoặc buộc phải chọn giữa các ý định khác nhau.

### 5. Release và hotfix
- Cắt, ổn định hoá, finalize, rollback nhánh `release/*` theo đúng thứ tự (merge vào production branch thực tế → tag → merge lại vào integration branch thực tế, thường là `develop`; không được bỏ bước nào).
- Xử lý hotfix production theo thứ tự (production branch thực tế → `release/*` nếu đang mở → integration branch thực tế, thường là `develop`), ưu tiên PR/MR cho protected branch và giữ ancestry bằng merge commit/fast-forward (không squash hoặc rebase-and-merge). Trước code commit hoặc integration merge trực tiếp trên production/integration branch, hỏi xác nhận rõ ràng; nếu được duyệt thì không bắt buộc checkout sang nhánh mới. Trước thao tác remote, xác định `<fetch-remote>` là nguồn refs authoritative và `<push-remote>` là đích ghi được duyệt (có thể khác nhau trong fork); sau khi fetch, xác minh từng target upstream chứa **tip commit của hotfix branch** bằng `git branch -r --contains <hotfix-branch-tip-sha>`.

### 6. Worktree
- Tạo/liệt kê/dọn dẹp worktree cho việc làm nhiều task song song.
- Kiểm tra `git status` trước khi remove; nếu worktree còn thay đổi, bảo toàn chúng và chỉ remove bình thường sau khi sạch. Không dùng `--force` để discard worktree bẩn; chỉ cân nhắc `--force` với worktree sạch nếu Git vẫn yêu cầu và người dùng xác nhận.

### 7. Nguyên tắc an toàn — không làm mất code
**Không tự ý commit hoặc push trên bất kỳ nhánh nào.** Chỉ thực thi khi user cho phép rõ hành động và phạm vi. Yêu cầu review, sửa code, chuẩn bị commit message, tạo PR/MR, resolve conflict hay release không ngầm cho phép commit/push. “Commit” không cho phép push; “push” không cho phép tạo thêm commit. Nếu phạm vi thay đổi hoặc quyền chưa rõ, dừng hỏi. Quy tắc bao gồm amend, lệnh merge/revert/cherry-pick/continue tự tạo commit, push tag và tool tự push. Duyệt PR/MR chỉ bao gồm push nếu user duyệt rõ kế hoạch push cụ thể; ví dụ lệnh không phải là quyền thực thi.

Dùng task branch làm mặc định. Nếu đang ở production branch (thường là `main`/`master`) hoặc integration branch (thường là `develop`) đã xác minh của repo, hỏi xác nhận rõ ràng trước khi tạo code commit; sau khi được duyệt có thể commit ngay trên nhánh hiện tại, không bắt buộc checkout nhánh mới. Việc duyệt commit không thay thế quyền push/merge hay bỏ qua branch protection. Trước mọi push, kể cả push trực tiếp trong release/hotfix, xác minh chỉ có đúng một effective destination được duyệt bằng quy tắc trong `references/principles.md`; nếu có nhiều đích thì dừng.

Xuyên suốt mọi tác vụ trên, skill cấm tuyệt đối các lệnh có thể làm mất code không thể phục hồi:
- `git rebase`, `git rebase -i`, `git rebase --continue`, `git rebase --abort`, `git reset --hard`
- `git push --force` / `--force-with-lease`
- `git clean -f`/`-fd`/`-fx`, `git checkout -- <file>`, `git restore <file>` (không `--staged`) khi chưa xác nhận với người dùng
- `git worktree remove --force` trên worktree còn thay đổi chưa commit
- `git branch -D` (chỉ dùng `-d` trừ khi người dùng xác nhận rõ ràng)

Khi có nguy cơ mất việc (merge lỗi, push bị từ chối, commit bị đè...), skill luôn ưu tiên: dừng lại, dùng `git reflog`/backup branch để phục hồi, và tạo branch mới ngay thay vì đứng ở detached HEAD.

---

## Ví dụ sử dụng

### Tạo branch
```text
Dùng git-workflow để tạo branch cho tính năng thêm payment webhook.
```
```text
Dùng git-workflow để tạo hotfix branch cho lỗi timeout đăng nhập trên production.
```
```text
Dùng git-workflow để kiểm tra xem tên branch "feature/misc-updates" có đúng convention không.
```

### Commit
```text
commit
```
```text
commit chỉ những file đã staged
```
```text
Dùng git-workflow để review xem commit message "fix: bug fix" có đúng convention không.
```
```text
Dùng git-workflow để kiểm tra staged diff xem có debug code, secret, hay file không mong muốn trước khi commit không.
```
```text
Dùng git-workflow để tách các thay đổi đang staged thành nhiều commit theo đúng ranh giới logic.
```
```text
Dùng git-workflow để dọn lại commit "wip" trước khi push, không dùng rebase.
```

### Unstage nhầm file
```text
Dùng git-workflow để bỏ staged một file mà không mất thay đổi đã sửa trong đó.
```

### Chuẩn bị PR
```text
Dùng git-workflow để kiểm tra PR feature/payment-webhook đã sẵn sàng merge chưa: tên branch, commit message, checklist.
```
```text
Dùng git-workflow để tạo PR cho feature/payment-webhook trực tiếp từ local (repo này dùng GitHub).
```
```text
Dùng git-workflow để tạo merge request cho feature/user-authentication từ local (repo này dùng GitLab).
```

### Đồng bộ branch
```text
Dùng git-workflow để cập nhật `feature/user-authentication` theo integration branch mới nhất.
```

### Resolve conflict
```text
Dùng git-workflow để resolve conflict merge trên feature/checkout-refactor, nhớ ghi lại các file conflict vào commit.
```
```text
Dùng git-workflow để kiểm tra xem việc resolve conflict ở billing service có làm mất thay đổi của bên nào không.
```

### Chạy song song với worktree
```text
Dùng git-workflow để tạo worktree cho bugfix/order-sync trong khi feature/payment-webhook vẫn đang chạy.
```

### Cắt release
```text
Dùng git-workflow để tạo release branch cho phiên bản 2.3.0.
```
```text
Dùng git-workflow để finalize và tag release/v2.3.0.
```

### Hotfix production
```text
Dùng git-workflow để tạo hotfix cho lỗi timeout thanh toán nghiêm trọng và merge lại đúng quy trình.
```
```text
Dùng git-workflow để xác nhận hotfix đã được merge vào cả production branch và integration branch sau khi deploy.
```

### Khôi phục sau sự cố
```text
Dùng git-workflow để khôi phục một commit bị ghi đè mất, không dùng reset --hard.
```
```text
Dùng git-workflow để xử lý push bị từ chối mà không dùng force-push.
```
```text
Dùng git-workflow để quyết định nên làm gì khi merge đang lỗi và cần abort.
```

### Revert
```text
Dùng git-workflow để revert một squash-merge commit đã push lên integration branch.
```

---

## Giới hạn áp dụng

Không cần nạp khi chỉ sửa code và không thao tác Git. Với repository trunk-based hoặc release trực tiếp từ production, vẫn nạp skill và giữ các gate an toàn/quyền; không áp dụng nguyên văn recipe GitFlow. Xác minh mô hình thực tế rồi điều chỉnh hướng dẫn branch/merge/release.
