# Release Process

Examples on this page use `develop` as the integration-branch name; replace it with the repository's verified integration branch if different. Use `<fetch-remote>` for authoritative upstream/base refs and `<push-remote>` for the approved writable destination; they may be the same remote in single-project workflows and differ in a fork. Before any push, apply the effective-destination check in `references/principles.md`. Release/hotfix integration pushes and production tags must target the actual authorized target project; a branch or tag pushed only to a fork is not upstream integration or a completed release. If upstream is not writable, use the required PR/MR flow and verify the merged target there.

## Create a release branch

Inspect `git status` first. Fast-forward the local integration branch before branching; if it diverged from the remote, stop and inspect rather than creating an incidental merge commit.

```bash
git status
git checkout develop
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/develop
git checkout -b release/v1.5.0
git push <push-remote> release/v1.5.0
```

## Tag format

Follow the repository's existing version and tag convention. Semantic versioning with a `v` prefix is one common pattern, not a requirement; do not rename tags or introduce a new scheme without an explicit project decision.

## What is allowed on a release branch

A release branch does not sync from the configured integration branch or the production branch. Once cut, it accepts only:

- bug fixes committed directly on the branch
- hotfix branch merges — when a production fix must also land on this release
- version updates, documentation updates, and small release-specific configuration adjustments

Do not add new features. Do not merge the configured integration or production branch into a release branch.

If an urgent fix lands on the configured production branch via a hotfix while this release is open, merge the hotfix branch directly into the release branch (see [Branch Strategy](branch-strategy.md) — Hotfix branches).

## Finalize a release

After validation, integrate the release into the configured production branch, tag that exact release commit, then merge it back into the configured integration branch (often named `develop`). Use `<fetch-remote>` for authoritative refs and `<push-remote>` for an authorized destination. Preserve the stabilization commit history; use a merge commit or ancestry-preserving fast-forward, not squash or rebase-and-merge. Use PR/MRs for protected branches and follow the repository's required approval and merge policy. Before a direct integration merge that creates a commit on the production or integration branch, ask the user for explicit confirmation; if approved, do not force a checkout to a new task branch. Direct merge/push commands still require repository policy permission and operator authorization; the push remote must update the actual target project. If only a fork is writable, use a PR/MR into upstream and do not create/push the production release tag until the release is integrated on the actual production project. Never bypass branch protection.

Example direct-merge path where permitted:

```bash
# Direct path only when <push-remote> updates the actual authorized target project
# 1. Fast-forward the local production branch, then integrate the release
git checkout <production-branch>
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/<production-branch>
git merge release/v1.5.0
git push <push-remote> <production-branch>

# 2. Tag the exact release integration commit on the production branch and push only this tag
# Run only after the release is integrated on the actual production project
git tag -a v1.5.0 -m "v1.5.0" <production-release-commit-sha>
git push <push-remote> v1.5.0

# 3. Fast-forward the local integration branch, then merge the release back into the configured integration branch
git checkout develop
git fetch <fetch-remote>
git merge --ff-only <fetch-remote>/develop
git merge release/v1.5.0
git push <push-remote> develop
```

Step 3 is mandatory. Release-only fixes committed during stabilization must not be lost.

If the configured integration branch (often `develop`) is already ahead of the release branch, the merge will include all stabilization commits in history. Do not cherry-pick individual commits — the full merge preserves the complete stabilization trail.

A release branch is considered closed only after both of these steps complete successfully:
1. The branch is merged into the configured production branch and tagged.
2. The branch is merged into the configured integration branch.

Do not apply further hotfixes to a release branch after both steps are done. If the production branch is tagged but the merge back into the configured integration branch has not completed yet, the release is still open.

## Hotfix during an open release branch

If a production hotfix is required while a release branch is open:

1. Apply the hotfix on a `hotfix/*` branch from the configured production branch (see [Branch Strategy](branch-strategy.md)).
2. Merge the hotfix into the production branch, tag the resulting release commit, and deploy.
3. Merge the same hotfix branch into the open `release/*` branch.
4. Merge the hotfix into the configured integration branch as well.

Use PR/MRs for protected targets and follow repository policy; use a merge commit or ancestry-preserving fast-forward (not squash or rebase-and-merge) so the hotfix tip remains an ancestor of each target. Before a direct integration merge that creates a commit on the production or integration branch, ask the user for explicit confirmation. Do not push directly to protected branches or bypass required approvals. Do not apply the hotfix only to the release branch and expect it to reach the production or configured integration branch automatically.

## Rollback decision

If a deployed release must be rolled back:

- Do not rewrite or delete the release tag.
- Deploy the previous tagged version from the configured production branch.
- Open a `hotfix/*` branch to address the root cause.
- Tag a new patch release after the fix is validated.

Keep the broken release tag in history for auditability.
