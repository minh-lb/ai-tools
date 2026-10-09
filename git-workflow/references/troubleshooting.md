# Troubleshooting

## Branch already attached to another worktree

Error:

```text
fatal: '<branch>' is already used by worktree
```

Check active worktrees:

```bash
git worktree list
```

Then either remove the old worktree:

```bash
git worktree remove <path>
```

Or create a different branch.

## Need to recover a deleted or overwritten commit

Use reflog, and land directly on a new branch — do not stop at a bare `git checkout <commit>`. That leaves you in detached HEAD, and if anything checks out another ref before a branch is created, the recovered commit can become unreachable again and eventually get garbage-collected.

```bash
git reflog
git checkout -b recovery/<short-description> <commit>
```

Reflog only recovers *committed* content. It cannot bring back deleted untracked files or a dropped stash entry that was itself already removed — there is no path back from those; see `references/principles.md` for the commands that cause that kind of unrecoverable loss.

## Need to abort an in-progress merge

First inspect `git status` and confirm that the operation is a merge, not a rebase or cherry-pick. Check whether there was pre-existing uncommitted work before the merge; aborting can discard it. If operation type or data-loss risk is unclear, stop and ask the user. Run the abort only if the user explicitly asks to abandon this confirmed merge and inspection shows it will not discard pre-existing work:

```bash
git merge --abort
```

Then inspect whether the branch was started from the correct base, whether local commits should be split before retrying, and whether the branch is too broad and should be reduced.

## Remote branch rejects your push after history rewrite attempts

If a local workflow attempted to rewrite branch history, a normal push may be rejected or the branch may diverge from the remote unexpectedly. Identify `<fetch-remote>` as the authoritative source of branch refs and `<push-remote>` as the approved writable destination; in fork workflows, they commonly differ. Do not assume `origin` is canonical or that pushing to a fork updates upstream. Before any retry or direct push, apply the all-push effective-destination check in `references/principles.md`; treat URLs as sensitive and redact embedded credentials before sharing or logging output.

Do not solve this with force-push or more history rewriting in this workflow.

If you are currently in the middle of a confirmed merge, do not abort automatically. Only run `git merge --abort` if the user explicitly asks to abandon it and inspection verifies it will not discard pre-existing work. Do not use that command to exit a rebase or cherry-pick; if the operation or data-loss risk is unclear, stop and ask the user.

If no merge is in progress and the local branch history is in a confusing state, create a backup before doing anything else:

```bash
git fetch <fetch-remote>
git checkout -b backup/<branch>-local
git checkout <branch>
```

Then compare local and remote history carefully, re-apply the intended changes as new commits if needed, and continue with a merge-based update strategy. Do not use `reset --hard` — it discards local work with no recovery path.

## PR is too large to review safely

Do not push review burden downstream. Split the work into smaller branches or separate commits before requesting review.

## Revert a commit that was already merged

Do not use `git reset` — the change is already in shared history. Never create the revert directly on the configured production or integration branch (commonly `main`/`master` and `develop`). Determine which destination branch needs the revert, use `<fetch-remote>` for the authoritative target refs and `<push-remote>` for the approved source branch destination, then create a task branch from the fetched target tip and open a PR/MR to the actual destination project (subject to repository policy). Pushing the revert branch to a fork is only source-branch publication; it is not evidence that the revert was integrated upstream. Treat remote URLs as sensitive and redact credentials before sharing configuration output.

```bash
git fetch <fetch-remote>
git checkout -b bugfix/revert-<short-description> <fetch-remote>/<destination-branch>
git revert <sha>
git push -u <push-remote> bugfix/revert-<short-description>
```

For a squash-merged change, `<sha>` is the squash commit. For a merge commit (for example, a non-squash release or hotfix merge), verify the parents first with `git show --no-patch --pretty=raw <merge-sha>`. Then use `git revert -m <mainline-parent> <merge-sha>` on the task branch. `-m 1` means retain the first parent (normally the destination branch); do not assume it is correct without verifying the merge's parent order. A revert conflict is outside the merge-only procedure in `references/conflict-resolution.md`: inspect `git status`, stop without running `git merge --continue` or `git merge --abort`, and ask the user how to proceed. Do not assume that a revert conflict is a merge conflict.

If a merge commit was reverted and you intend to restore that same change, re-merging the original branch may not reapply the reverted content because its commits are already ancestors. After reviewing the history, restore it by reverting the revert commit on a task branch and using the required PR/MR flow, or create new commits with the intended changes. Squash-merged changes have different ancestry; inspect the graph and diff rather than assuming a re-merge will restore or skip the content.

## Accidentally staged the wrong files

Remove a file from the staging area without discarding changes:

```bash
git restore --staged <file>
```

Or unstage all staged files at once:

```bash
git restore --staged .
```

The working directory is not touched — changes remain but are no longer staged.

If `git restore --staged` is not available (older Git), use:

```bash
git reset HEAD <file>
```

## Golden Rules

1. One task equals one branch.
2. One branch should usually map to one worktree.
3. Sync branches forward with merge; do not use rebase.
4. Keep commits small and named clearly.
5. Never commit secrets.
6. Always review AI-generated code critically.
7. Run tests before opening a PR.
8. Keep history clean and intentional.
9. Prefer squash merge unless there is a clear reason not to.
10. Remove unused worktrees; do not delete branches unless an explicit archival policy requires it.
