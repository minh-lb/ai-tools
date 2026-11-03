# Worktree Usage

## When to use worktrees

A worktree is **optional isolation for separate writable tasks**, not a prerequisite for AI agents or sessions. Use one only when independent tasks truly need concurrent write isolation, the repository supports testing from the new checkout, and the user/workflow permits it. A single task's sequential Coder → Tester → Reviewer subagents may share the current working directory: serialize source edits and keep Tester/Reviewer read-only. If the user forbids worktrees or the local test setup requires the current checkout, stay in that checkout.

Typical cases:

- one feature in progress and one urgent bugfix
- multiple AI sessions working on isolated tasks
- release stabilization while feature work continues

## Create a worktree

Verify the repository's configured integration branch and confirm the target worktree path is unused. The command below uses `develop` as the conventional example; substitute the verified integration branch if it differs.

```bash
git worktree add worktrees/payment-webhook -b feature/payment-webhook develop
```

When isolation is authorized and chosen, keep each **concurrently writable independent task** in its own branch/worktree. Multiple sequential roles on the *same task* can share that task's checkout; a subagent context is not automatically another worktree. Create a PR only when explicitly requested. Do not use worktrees to evade dirty-tree safety, a user's no-worktree choice, or an environment that cannot run its tests there.

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
