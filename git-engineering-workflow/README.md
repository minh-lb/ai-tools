# Git Engineering Workflow

Skill cho GitFlow-style repositories. Dùng khi cần agent thực hiện bất kỳ tác vụ Git nào liên quan đến branch, commit, merge, release, hoặc conflict.

---

## Các trường hợp sử dụng

### Tạo branch mới

```text
Use git-engineering-workflow to create a branch for adding a payment webhook feature.
```

```text
Use git-engineering-workflow to create a hotfix branch for the login timeout bug in production.
```

---

### Đặt tên branch

```text
Use git-engineering-workflow to suggest the correct branch name for a task that updates the CI pipeline.
```

```text
Use git-engineering-workflow to validate whether the branch name "feature/misc-updates" follows our conventions.
```

---

### Viết commit message

```text
Use git-engineering-workflow to write a commit message for these staged changes that add invoice export.
```

```text
Use git-engineering-workflow to review whether this commit message follows our convention: "fix: bug fix".
```

```text
Use git-engineering-workflow to choose the correct commit type for a change that removes duplicate webhook processing.
```

---

### Chuẩn bị PR

```text
Use git-engineering-workflow to review whether this PR is ready to merge: branch name, commit messages, and checklist.
```

```text
Use git-engineering-workflow to write a PR title for squash merging the feature/payment-webhook branch.
```

---

### Sync branch với develop

```text
Use git-engineering-workflow to bring feature/user-authentication up to date with develop.
```

```text
Use git-engineering-workflow to sync the hotfix/payment-timeout branch with main.
```

---

### Giải quyết merge conflict

```text
Use git-engineering-workflow to guide me through resolving the merge conflict on feature/checkout-refactor.
```

```text
Use git-engineering-workflow to decide which side to keep when resolving a conflict in the billing service.
```

---

### Chạy nhiều task song song với worktree

```text
Use git-engineering-workflow to set up a worktree for working on bugfix/order-sync while feature/payment-webhook is still in progress.
```

```text
Use git-engineering-workflow to list and clean up worktrees that are no longer needed.
```

---

### Cắt release branch

```text
Use git-engineering-workflow to create the release branch for version 2.3.0.
```

```text
Use git-engineering-workflow to finalize and tag the release/v2.3.0 branch.
```

---

### Hotfix production

```text
Use git-engineering-workflow to create a hotfix for the critical payment timeout bug and merge it back correctly.
```

```text
Use git-engineering-workflow to verify that the hotfix has been merged into both main and develop after deployment.
```

---

### Tách commit hoặc dọn dẹp lịch sử local

```text
Use git-engineering-workflow to split the staged changes into separate commits by logical boundary.
```

```text
Use git-engineering-workflow to clean up the wip commit before pushing, without using rebase.
```

---

### Kiểm tra Git hygiene trước khi commit

```text
Use git-engineering-workflow to check the staged diff for debug artifacts, secrets, or unintended files before committing.
```

```text
Use git-engineering-workflow to review AI-generated code before staging it.
```

---

### Recovery và troubleshooting

```text
Use git-engineering-workflow to recover a commit that was accidentally overwritten.
```

```text
Use git-engineering-workflow to fix a push rejection without using force-push.
```

```text
Use git-engineering-workflow to decide what to do when a merge is going wrong and needs to be aborted.
```

---

## Không dùng skill này khi

- Repository release trực tiếp từ `main` (không có `develop`)
- Repository dùng trunk-based development (không có release branch)
- Repository không có integration branch
