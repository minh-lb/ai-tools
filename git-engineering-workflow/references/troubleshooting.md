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

Use reflog:

```bash
git reflog
git checkout <commit>
```

Recover first, then create a new branch from the recovered commit if needed.

## Merge is going wrong

Abort early instead of forcing through a broken state:

```bash
git merge --abort
```

Then inspect:

- whether the branch was started from the correct base
- whether local commits should be split before retrying
- whether the branch is too broad and should be reduced

## Remote branch rejects your push after history rewrite attempts

If a local workflow attempted to rewrite branch history, a normal push may be rejected or the branch may diverge from the remote unexpectedly.

Do not solve this with force-push or more history rewriting in this workflow.

If you are currently in the middle of a merge, abort it first:

```bash
git merge --abort
```

If no merge is in progress and the local branch history is in a confusing state, create a backup before doing anything else:

```bash
git fetch origin
git checkout -b backup/<branch>-local
git checkout <branch>
```

Then compare local and remote history carefully, re-apply the intended changes as new commits if needed, and continue with a merge-based update strategy. Do not use `reset --hard` — it discards local work with no recovery path.

## PR is too large to review safely

Do not push review burden downstream. Split the work into smaller branches or separate commits before requesting review.

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
