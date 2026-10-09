# Common Commands

Examples use `develop` as the integration branch. Define `<fetch-remote>` as the authoritative upstream/base remote and `<push-remote>` as the approved writable destination; they may be the same in single-repository workflows and differ in forks. Fetch from upstream and publish PR/MR source branches to the writable fork; a fork push does not integrate upstream. Direct release/hotfix branch and tag pushes must target the actual authorized project. Before any push below, apply the destination check in `references/principles.md` and stop unless exactly one approved effective destination is configured.

## Current branch

```bash
git branch --show-current
```

## Fetch latest remote state

Inspect remote configuration first and replace `<fetch-remote>` with the authoritative remote for the base refs (often upstream in a fork). Treat URLs as sensitive and redact credentials before sharing output:

```bash
git fetch <fetch-remote>
```

## Merge latest integration branch into a task branch (example: `develop`)

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/develop
```

For `hotfix/*` — sync from the configured production branch instead:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/<production-branch>
```

## Abort merge

Confirm with `git status` and `git rev-parse -q --verify MERGE_HEAD` that this is an active merge (not a rebase, cherry-pick, or revert). Check whether aborting would discard pre-existing work. Run the abort only if the user explicitly asks to abandon this confirmed merge and inspection shows no pre-existing work would be lost; if the operation or risk is unclear, stop and ask the user.

```bash
git merge --abort
```

## Show concise history

```bash
git log --oneline --graph --decorate
```

## Stash temporary work

Stashing is not an automatic safety step and is not a complete backup (untracked files are omitted unless requested). Inspect `git status` first, and stash only when the user asks or explicitly approves. When restoring, choose the intended reference from `git stash list` and use `apply` so the stash remains available if conflicts or mistakes occur. After applying, inspect status and the resulting diff; do not drop the stash without explicit approval.

```bash
git stash push -m "<short-description>"
git stash list
git stash apply <stash-ref>
git status
git diff
```

## Show changed files

```bash
git status
git diff --stat
```

## List worktrees

```bash
git worktree list
```

## Add a worktree

Before adding a worktree from a base branch, verify the working tree and any in-progress operation, then use `<fetch-remote>` to fetch and fast-forward the local base branch as described above. Do not use `--force` to bypass an existing worktree association.

```bash
git worktree add worktrees/<task-name> -b feature/<task-name> develop
```

## Remove a worktree

Inspect `git worktree list` and `git -C worktrees/<task-name> status` first. Preserve or commit any work before removal; do not use `--force` to discard changes.

```bash
git worktree remove worktrees/<task-name>
```

## Create a release branch

Examples assume `develop` is the integration branch. Inspect `git status`, fetch `<fetch-remote>`, and fast-forward the local base; if it diverged, stop and inspect rather than creating an incidental merge commit.

```bash
git status
git checkout develop
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/develop
git checkout -b release/v1.5.0
git push <push-remote> release/v1.5.0
```

## Create a hotfix branch

Replace `<production-branch>` with the verified production branch, `<fetch-remote>` with the authoritative base remote, and `<push-remote>` with the approved writable destination. Inspect `git status` first; if that destination is only a fork, this command publishes a source branch and does not integrate upstream.

```bash
git status
git checkout <production-branch>
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/<production-branch>
git checkout -b hotfix/<issue-name>
git push <push-remote> hotfix/<issue-name>
```

## Tag a release

After the release commit has been integrated into the actual configured production project, create the annotated tag at that commit and push only that tag (not every local tag). Replace `<push-remote>` with the approved destination for that production project; do not treat a tag pushed only to a fork as a completed release:

```bash
git tag -a v1.5.0 -m "v1.5.0" <production-release-commit-sha>
git push <push-remote> v1.5.0
```

Follow the repository's release/branch policy; do not push directly to a protected branch or bypass required approvals.

## Show tags

```bash
git tag --sort=-version:refname | head -10
```
