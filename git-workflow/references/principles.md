# Principles

## Repository-specific branch and remote names

Determine the repository's actual integration branch, production branch, and remote roles before acting; inspect repository documentation and configuration rather than inferring from names. `main`/`master`, `develop`, and `origin` are conventional examples, not guarantees. Use `<fetch-remote>` for the authoritative upstream/base refs and `<push-remote>` for the user-approved writable destination; in a single-repository workflow they may be the same remote. In a fork workflow, they commonly differ: fetch from canonical upstream and publish the source branch to the writable fork. For direct release/hotfix integration, `<push-remote>` must point to the actual authorized production/integration project; pushing the same branch name to a fork does not update upstream. If upstream is protected or not writable, use the required PR/MR flow and verify integration on upstream. Treat remote URLs as potentially sensitive: do not expose or log embedded credentials; redact them before sharing output.

## Before any push, verify every effective destination

This destination check applies to every `git push` in this skill, including direct release/hotfix pushes and PR/MR source-branch preparation. Before pushing, enumerate all effective endpoints with `git remote get-url --push --all <push-remote>`; this includes multiple configured `remote.<name>.url` values even when no `pushurl` is set. Git may push to every returned endpoint. Require exactly one destination and verify it is the approved project for this operation; if the command fails, returns none, or returns more than one, stop and ask the user to configure/select one approved destination. Re-enumerate immediately before the push and stop if the endpoint changed. Do not rely on `git remote -v` or inspect only `pushurl`, and never share or log raw URL output containing credentials.

Before starting a merge, run `git status` and confirm no merge, rebase, cherry-pick, or revert is already in progress. Do not start a merge with unrelated staged, unstaged, or untracked work; preserve it on a safe branch or ask the user how to proceed. Never automatically stash or discard unrelated work.

## Commits on production or integration branches require confirmation

Use a task branch by default. Before making a code commit while currently on the repository's configured production branch (often `main` or `master`) or configured integration branch (often `develop`), stop and ask the user for explicit confirmation. If the user approves, a commit on that current branch is allowed; do not require checking out a new task branch. This confirmation does not override repository branch protection, authorization requirements, or separate push/merge policies. Prefer PR/MR for protected branches, and never bypass branch protection.

Common branch-name examples include `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`, `chore/*`, `docs/*`, and `ci/*`. They illustrate GitFlow roles; follow the repository's actual naming policy and do not introduce or prohibit a prefix solely because it is absent from this list.

Treat the repository's configured production and integration branches as sensitive workflow branches and use a task branch by default. If already on the configured production or integration branch (often `main`/`master` and `develop`, respectively), ask for explicit user confirmation before a code commit; once approved, stay on the current branch if that is what the user wants. Do not force a checkout solely to satisfy the default.

## Keep branch scope reviewable

When the repository workflow uses task branches, prefer one independently reviewable objective per branch. Avoid unrelated changes, but do not split tightly coupled work mechanically. Follow the repository's naming and branch-scope conventions.

## Keep changes small and reviewable

Do not mix feature work, refactors, infra changes, and unrelated fixes in the same branch unless they are tightly coupled.

## Do not rewrite shared history

This workflow does not allow force-pushing branch history after a branch has been published.

Do not use:

- `git push --force`
- `git push --force-with-lease`

If a branch has already been pushed, preserve its remote history and prefer forward-moving fixes such as new commits or a merge from the correct base (`develop`/the integration branch for task branches, the configured production branch for hotfix branches).

## Do not use rebase or hard reset in this workflow

This workflow blocks history-rewriting operations because they can hide, drop, or orphan code when used incorrectly.

Do not use:

- `git rebase`
- `git rebase -i`
- `git rebase --continue`
- `git rebase --abort`
- `git reset --hard`

To update a local base/release branch from its authoritative remote, use `git fetch <fetch-remote>` followed by `git merge --ff-only <fetch-remote>/<branch>`. If it cannot fast-forward, stop and inspect the divergence rather than creating an incidental merge commit. To synchronize a task or hotfix branch with its correct base, use `git fetch <fetch-remote>` followed by an ordinary merge:

- For ordinary task branches: merge from `<fetch-remote>/<integration-branch>`.
- For hotfix-role branches: merge from `<fetch-remote>/<production-branch>`.

If local work appears lost, use `git reflog` to recover commits before considering any reset.

## Never run commands that discard work with no recovery path

`git reflog` only helps for content that was committed at some point — it cannot bring back untracked files or uncommitted working-directory edits. Some commands destroy exactly that, permanently, in one shot. Do not use:

- `git clean -f`, `git clean -fd`, `git clean -fx` (or any `-f`/`--force` variant) — deletes untracked files and directories with no reflog, no trash, no undo
- `git checkout -- <path>` or `git restore <path>` (without `--staged`) — discards uncommitted changes to tracked files
- `git worktree remove --force` to discard uncommitted or untracked changes; never force-remove a dirty worktree, even with user approval

If any other discard command seems like the right fix, stop and confirm with the user first: run `git status` (and `git status` inside the worktree, for the worktree case) to show exactly what would be lost, and proceed only after explicit approval—or preserve the work on a safe branch. For a dirty worktree, commit or stash only with user approval, then remove it normally once clean. Consider `git worktree remove --force` only for a confirmed-clean target if Git still requires it, after checking status and receiving explicit user confirmation.

## Do not delete branches as routine cleanup

This workflow does not use branch deletion as a default cleanup step.

Keep branch records for traceability unless the repository has an explicit archival or retention policy outside this skill.

If a branch must be deleted, use `git branch -d` (refuses to delete a branch with unmerged commits) — never `git branch -D` (force-deletes regardless of merge status) unless the user has explicitly confirmed the branch's commits are no longer needed anywhere.

## Review AI output like human output

Before commit or PR, verify:

1. The code matches the requirement.
2. Tests cover the intended behavior.
3. No debug artifacts remain.
4. No secrets or local-only files are staged.
5. Generated code follows project conventions.
