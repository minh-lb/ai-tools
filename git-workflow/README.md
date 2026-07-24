# Git Workflow

Skill dành cho các repository theo mô hình GitFlow (`main`/`master` là nhánh production, `develop` là nhánh tích hợp, có `release/*` và `hotfix/*`). Dùng skill này cho **mọi** tác vụ Git: commit, branch, merge, PR, resolve conflict, release, hotfix, worktree.

Skill tự động kích hoạt khi phát hiện tác vụ Git — không cần gọi tường minh (ví dụ chỉ cần gõ "commit" là đủ).

---

## Skill này làm được gì

### 1. Commit đúng chuẩn
- Validate và tự soạn commit message theo format `<type>(<scope>): <summary>` (feat/fix/refactor/test/docs/ci/build/perf/style/revert/chore).
- Từ chối message mơ hồ (`fix: bug fix`, `chore: update`, `wip`).
- Tự phát hiện khi staged diff gộp nhiều thay đổi không liên quan và đề xuất tách thành nhiều commit.
- Kiểm tra trước khi commit: không debug code sót lại (`console.log`, `dd()`, `var_dump()`...), không secret/`.env`, không co-author attribution (kể cả AI).

### 2. Branch đúng quy ước
- Tạo/đặt tên branch theo `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`, `chore/*`, `docs/*`, `ci/*`.
- Đồng bộ branch với base đúng (`develop` cho task branch, `main` cho hotfix) — luôn bằng merge, không bao giờ rebase.

### 3. PR và merge
- Soạn PR title/squash message đúng convention.
- Chọn đúng merge mode: squash cho task branch, merge thường (giữ nguyên lịch sử) cho `release/*` và `hotfix/*`.
- Checklist review trước khi mở PR (test pass, không còn conflict, migration an toàn...).
- **Tạo PR/MR trực tiếp từ local** bằng CLI — tự nhận diện GitHub (`gh pr create`) hay GitLab (`glab mr create`) dựa trên remote URL, push branch trước, chọn đúng base branch (`develop` hoặc `main` cho release/hotfix). Nếu chưa cài/đăng nhập CLI, skill sẽ không tự bịa API mà đưa lại title/body hợp lệ để dán thủ công vào web UI.

### 4. Resolve conflict — có kèm quy trình đảm bảo không mất code
Đây là phần được đầu tư kỹ nhất trong skill:
- Xác định đúng loại thao tác đang diễn ra (merge / rebase / cherry-pick) trước khi resolve — nếu phát hiện rebase từ ngoài quy trình (bị cấm), skill sẽ dừng lại hỏi người dùng thay vì tự ý chạy lệnh.
- Trước khi quyết định giữ bên nào, phải xem `git log`/`git show` của cả hai bên để hiểu **tại sao** mỗi bên thay đổi — không đoán từ mỗi đoạn diff.
- Mặc định **hợp nhất ý định cả hai bên** thay vì chọn 1 bên (phần lớn conflict thực tế là hai thay đổi hợp lệ, độc lập trên cùng một chỗ) — chỉ chọn hẳn 1 bên khi hai thay đổi thực sự loại trừ lẫn nhau.
- Sau khi resolve, verify bằng `git diff HEAD` và `git diff MERGE_HEAD` để đảm bảo không âm thầm làm mất phần đóng góp của bên nào.
- Xử lý riêng conflict xóa/đổi tên file (`deleted by us/them`, `both added`) và lockfile (`package-lock.json`...) — không dùng `--ours`/`--theirs` cho lockfile mà regenerate lại.
- Ghi lại danh sách file bị conflict và cách resolve vào **body của merge commit**.
- Có tiêu chí rõ ràng để dừng lại hỏi người dùng: conflict đụng vào business logic, auth, tính toán tài chính, hoặc lan rộng bất thường (15+ file).

### 5. Release và hotfix
- Cắt, ổn định hoá, finalize, rollback nhánh `release/*` theo đúng thứ tự (merge vào `main` → tag → merge lại vào `develop`, không được bỏ bước nào).
- Xử lý hotfix production đúng thứ tự merge (`main` → `release/*` nếu đang mở → `develop`), có lệnh verify (`git branch --all --contains <sha>`) để xác nhận hotfix đã tới đủ mọi nhánh cần thiết trước khi coi là xong.

### 6. Worktree
- Tạo/liệt kê/dọn dẹp worktree cho việc làm nhiều task song song.
- Luôn kiểm tra worktree sạch (`git status`) trước khi remove; không dùng `--force` để bỏ qua cảnh báo an toàn của Git.

### 7. Nguyên tắc an toàn — không làm mất code
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
Dùng git-workflow để cập nhật feature/user-authentication theo develop mới nhất.
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
Dùng git-workflow để xác nhận hotfix đã được merge vào cả main và develop sau khi deploy.
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
Dùng git-workflow để revert một squash-merge commit đã push lên develop.
```

---

## Khi nào KHÔNG dùng skill này

- Repository release trực tiếp từ `main`, không có `develop`
- Repository dùng trunk-based development, không có nhánh release
- Repository không có nhánh tích hợp (integration branch)

Nếu repo dùng vai trò nhánh khác hoặc mô hình release không phải GitFlow, cần điều chỉnh lại quy tắc trước khi áp dụng nguyên văn.
