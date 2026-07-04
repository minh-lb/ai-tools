# Git Workflow

Skill for GitFlow-style repositories. Use it whenever an agent needs to perform any Git task involving branches, commits, merges, PRs, releases, conflicts, or worktrees.

This skill activates automatically on any commit or amend request — no explicit invocation needed.

---

## Use cases

### Create a branch

```text
Use git-workflow to create a branch for adding a payment webhook feature.
```

```text
Use git-workflow to create a hotfix branch for the login timeout bug in production.
```

---

### Name or validate a branch

```text
Use git-workflow to suggest the correct branch name for a task that updates the CI pipeline.
```

```text
Use git-workflow to validate whether the branch name "feature/misc-updates" follows our conventions.
```

---

### Commit

```text
commit
```

```text
commit only the staged files
```

```text
commit just the changes in src/
```

### Validate a commit message

```text
Use git-workflow to review whether this commit message follows our convention: "fix: bug fix".
```

```text
Use git-workflow to choose the correct commit type for a change that removes duplicate webhook processing.
```

```text
Use git-workflow to stop and split the staged changes if they should not be committed as one logical commit.
```

---

### Prepare a PR

```text
Use git-workflow to review whether this PR is ready to merge: branch name, commit messages, and checklist.
```

```text
Use git-workflow to write a PR title for squash merging the feature/payment-webhook branch.
```

---

### Sync a branch

```text
Use git-workflow to bring feature/user-authentication up to date with develop.
```

```text
Use git-workflow to sync the hotfix/payment-timeout branch with main.
```

---

### Resolve a merge conflict

```text
Use git-workflow to guide me through resolving the merge conflict on feature/checkout-refactor.
```

```text
Use git-workflow to decide which side to keep when resolving a conflict in the billing service.
```

---

### Run parallel tasks with worktrees

```text
Use git-workflow to set up a worktree for working on bugfix/order-sync while feature/payment-webhook is still in progress.
```

```text
Use git-workflow to list and clean up worktrees that are no longer needed.
```

---

### Cut a release branch

```text
Use git-workflow to create the release branch for version 2.3.0.
```

```text
Use git-workflow to finalize and tag the release/v2.3.0 branch.
```

---

### Hotfix production

```text
Use git-workflow to create a hotfix for the critical payment timeout bug and merge it back correctly.
```

```text
Use git-workflow to verify that the hotfix has been merged into both main and develop after deployment.
```

---

### Split commits or clean up local history

```text
Use git-workflow to split the staged changes into separate commits by logical boundary.
```

```text
Use git-workflow to clean up the wip commit before pushing, without using rebase.
```

---

### Check Git hygiene before committing

```text
Use git-workflow to check the staged diff for debug artifacts, secrets, or unintended files before committing.
```

```text
Use git-workflow to review AI-generated code before staging it.
```

---

### Revert a merged commit

```text
Use git-workflow to revert a squash-merged commit that was already pushed to develop.
```

```text
Use git-workflow to revert a merge commit on main using the correct parent flag.
```

---

### Unstage accidentally staged files

```text
Use git-workflow to remove a file from the staging area without discarding its changes.
```

---

### Recovery and troubleshooting

```text
Use git-workflow to recover a commit that was accidentally overwritten.
```

```text
Use git-workflow to fix a push rejection without using force-push.
```

```text
Use git-workflow to decide what to do when a merge is going wrong and needs to be aborted.
```

---

## When not to use this skill

- Repository releases directly from `main` with no `develop` branch
- Repository uses trunk-based development with no release branches
- Repository has no integration branch
