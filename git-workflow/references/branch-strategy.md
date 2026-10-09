# Branch Strategy

This reference assumes a GitFlow-style repository with `develop` as a conventional integration-branch example and a configured production branch (commonly `main` or `master`). Define `<fetch-remote>` as the authoritative upstream/base remote and `<push-remote>` as the approved writable destination; they may be the same outside a fork workflow. In a fork, fetch authoritative refs from upstream and publish the source branch to the writable fork. Direct release/hotfix integration pushes must target the actual authorized production/integration project, not merely a fork with the same branch name; if that project is protected or not writable, use its PR/MR flow. Replace branch examples with verified names. Before branch switches or merges, inspect `git status`; if there is staged, unstaged, or untracked work, preserve it and stop before switching/syncing rather than stashing or discarding automatically. Do not start an operation while another Git operation is in progress. Every push example below is subject to the effective-destination check in `references/principles.md`; stop unless exactly one approved destination exists.

## Task branches

Start from the integration branch:

```bash
git status
git checkout develop
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/develop
git checkout -b feature/new-feature
```

Use:

- `feature/*` for new capabilities
- `bugfix/*` for non-production defects
- `hotfix/*` for urgent production fixes
- `release/*` for release stabilization
- `chore/*` for maintenance and non-behavioral updates
- `docs/*` for documentation-only changes
- `ci/*` for CI pipeline and automation changes

## Keep branches up to date

Use merge instead of rebase so the branch history stays intact and recoverable. Do not use `git pull` for synchronization: `pull.rebase` configuration can silently change it into a rebase. Fetch first, then run the explicit merge command for the branch role below.

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/develop
```

For `hotfix/*` — sync from the configured production branch, not the integration branch:

```bash
git fetch <fetch-remote>
git merge <fetch-remote>/<production-branch>
```

## History safety rules

This workflow does not permit history-rewriting operations on task branches — see `references/principles.md` for the full banned-command list and safe alternatives.

Branch-specific additions to that baseline:

- do not rewrite shared release or hotfix branch history, even locally, once the branch is published
- if local commits become messy, add a clean follow-up commit instead of rewriting history (see "Keep branches up to date" above for the sync commands)

## Hotfix branches

Start urgent fixes from the repository's configured production branch (the example below uses `<production-branch>`):

```bash
git status
git checkout <production-branch>
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/<production-branch>
git checkout -b hotfix/critical-issue
```

After the fix is validated, integrate it into every required target in this order:

1. The configured production branch (then create/push the release tag)
2. The currently open `release/*` branch, if any
3. The configured integration branch (often `develop`)

Use a PR/MR for merges into protected branches, following the repository's review and merge policy. Preserve ancestry of the hotfix branch tip in every target: use a merge commit or an ancestry-preserving fast-forward, not squash or rebase-and-merge. If hosting policy cannot preserve ancestry, stop and agree on another verification method with the user. Before a direct integration merge that creates a commit on the configured production or integration branch, ask the user for explicit confirmation; if approved, the merge may be performed on that target branch without forcing a checkout to a new task branch. Direct merges/pushes still require repository policy permission and operator authorization; never bypass branch protection or force-push. Examples use `<fetch-remote>` for authoritative refs and `<push-remote>` for the authorized destination. They show the direct-merge path only when the push remote updates the actual target project and repository policy permits it. In fork workflows, use a PR/MR into upstream instead; a push to the fork does not integrate the upstream branch:

```bash
# 1. Fast-forward the local production branch, then integrate the hotfix and tag
git checkout <production-branch>
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/<production-branch>
git merge hotfix/critical-issue
git tag -a v1.4.1 -m "v1.4.1"
git push <push-remote> <production-branch>
git push <push-remote> v1.4.1

# 2. If a release/* branch is currently open, update it before integrating the hotfix
git checkout release/v1.5.0
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/release/v1.5.0
git merge hotfix/critical-issue
git push <push-remote> release/v1.5.0

# 3. Merge into the configured integration branch so the fix is not lost
git checkout develop
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/develop
git merge hotfix/critical-issue
git push <push-remote> develop
```

The order matters: merge into `release/*` before the configured integration branch so the release stabilization history stays intact. If no `release/*` branch is open, skip step 2 and go directly from step 1 to step 3.

Step 3 (merge into the configured integration branch) is mandatory, exactly like the equivalent step in [Release Process](release-process.md). A hotfix is not done once the production branch is tagged — if step 2 or step 3 hits a conflict or gets interrupted, the task is still open until every applicable target (the configured production branch, the open `release/*` if any, and the configured integration branch) has the fix. Do not treat tagging the production branch as a stopping point.

Before considering a hotfix finished, fetch current remote refs and verify that every required target contains the **tip commit of the hotfix branch** (not a target-side merge commit or release tag; independently merged targets can have different merge-commit IDs):

```bash
git fetch <fetch-remote>
git branch -r --contains <hotfix-branch-tip-sha>
```

Confirm the output includes `<fetch-remote>/<production-branch>`, `<fetch-remote>/<integration-branch>`, and `<fetch-remote>/release/<version>` if a release branch was open. If a required upstream target is missing, complete its integration via the authorized flow before closing the task. Use `git merge-base --is-ancestor <hotfix-branch-tip-sha> <fetch-remote>/<target>` for an explicit per-target check; a zero exit status means that authoritative target contains the hotfix tip.

If a required target was already squash-merged, do not claim the original hotfix tip SHA is an ancestor. This is an exception to the ancestry requirement: use patch-ID comparison only if the user explicitly agrees that patch equivalence is an acceptable alternative. The hotfix source must contain only the intended fix (not unrelated synchronization changes), and the merge base and squash commit must be unambiguous; otherwise stop for manual review. Confirm the squash commit is reachable from the current authoritative target with `git merge-base --is-ancestor <squash-commit-sha> <fetch-remote>/<target>` (zero exit status means it is reachable). Then inspect commits and current content since that squash commit for later edits or reversions, and run relevant tests on the upstream target. Use the output of the first command as `<merge-base-sha>` in the next command:

```bash
git merge-base <hotfix-branch-tip-sha> <fetch-remote>/<target>
git diff --binary <merge-base-sha> <hotfix-branch-tip-sha> | git patch-id --stable
git show --pretty=format: --binary <squash-commit-sha> | git patch-id --stable
```

Use this fallback only for unambiguous textual patches; binary changes require separate content-specific review. Matching non-empty patch IDs indicate whitespace-insensitive patch equivalence only; they do not prove ancestry or semantic equivalence. Review upstream target history and content for changes to the affected paths after the squash commit (for example, `git log --oneline <squash-commit-sha>..<fetch-remote>/<target> -- <affected-paths>` and `git diff <squash-commit-sha>..<fetch-remote>/<target> -- <affected-paths>`), because a later revert or edit can remove the fix even when the historical patch IDs match. Confirm the squash commit contains no unrelated changes. If the IDs differ, are empty, or the squash commit/merge base is ambiguous or includes conflict-resolution/unrelated synchronization edits, do not claim the fix is verified—show the evidence and ask the user for manual review or another verification method.

Do not cherry-pick as the primary merge strategy. Use full merges to keep the history traceable.
