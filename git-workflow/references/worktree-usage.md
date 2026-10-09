# Worktree Usage

## When to use worktrees

Use a separate worktree when you need parallel task execution without constantly stashing or switching branches.

Typical cases:

- one feature in progress and one urgent bugfix
- multiple AI sessions working on isolated tasks
- release stabilization while feature work continues

## Create a worktree

Verify the repository's configured integration branch and confirm the target worktree path is unused. The command below uses `develop` as the conventional example; substitute the verified integration branch if it differs.

```bash
git worktree add worktrees/payment-webhook -b feature/payment-webhook develop
```

Follow this mapping strictly:

- one task per branch
- one branch per worktree
- one worktree per AI session
- one PR per branch

Deviating from this (e.g. multiple tasks in one worktree) breaks the "one task equals one branch" principle and makes parallel work harder to review and merge.

## Inspect and clean up

List active worktrees:

```bash
git worktree list
```

Before removing, confirm the worktree is actually clean:

```bash
git -C worktrees/payment-webhook status
```

Remove a merged, clean task worktree:

```bash
git worktree remove worktrees/payment-webhook
```

Git refuses this by default if the worktree has uncommitted or untracked changes — that refusal is the safety net. If the worktree is dirty, stop and preserve the changes; commit or stash them only with user approval, then remove the now-clean worktree normally. Never use `git worktree remove --force` to discard a dirty worktree, even if the user approves the loss. If Git refuses removal despite the target being clean, inspect the reason; only consider `--force` after checking status and obtaining explicit user confirmation.

This workflow does not use branch deletion as routine cleanup. Remove the worktree if it is no longer needed, but keep the branch record unless a separate retention policy explicitly says otherwise.
