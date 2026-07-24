# Worktree Usage

## When to use worktrees

Use a separate worktree when you need parallel task execution without constantly stashing or switching branches.

Typical cases:

- one feature in progress and one urgent bugfix
- multiple AI sessions working on isolated tasks
- release stabilization while feature work continues

## Create a worktree

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

Git refuses this by default if the worktree has uncommitted or untracked changes — that refusal is the safety net. Do not reach for `git worktree remove --force` to push past it. If the worktree is dirty, either commit/push the work first, or stop and confirm with the user that the uncommitted changes are safe to discard before forcing anything.

This workflow does not use branch deletion as routine cleanup. Remove the worktree if it is no longer needed, but keep the branch record unless a separate retention policy explicitly says otherwise.
