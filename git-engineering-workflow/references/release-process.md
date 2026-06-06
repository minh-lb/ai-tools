# Release Process

## Create a release branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.5.0
git push origin release/v1.5.0
```

## Tag format

Use semantic versioning with a `v` prefix:

```text
v<major>.<minor>.<patch>
```

Examples:

```text
v1.5.0   — planned release
v1.5.1   — hotfix patch on top of a release
v2.0.0   — breaking or major milestone
```

Do not use formats like `release-1.5.0` or `1.5.0` without the `v` prefix unless the repository already follows a different convention.

## What is allowed on a release branch

A release branch does not sync from `develop` or `main`. Once cut, it accepts only:

- bug fixes committed directly on the branch
- hotfix branch merges — when a production fix must also land on this release
- version updates, documentation updates, and small release-specific configuration adjustments

Do not add new features. Do not merge `develop` or `main` into a release branch.

If an urgent fix lands on `main` via a hotfix while this release is open, merge the hotfix branch directly into the release branch (see [Branch Strategy](branch-strategy.md) — Hotfix branches).

## Finalize a release

After validation:

```bash
# 1. Merge into main — do not squash, preserve stabilization commits as-is
git checkout main
git pull origin main
git merge release/v1.5.0

# 2. Tag the release
git tag -a v1.5.0 -m "v1.5.0"
git push origin main --tags

# 3. Merge back into develop to preserve stabilization commits
git checkout develop
git pull origin develop
git merge release/v1.5.0
git push origin develop
```

Step 3 is mandatory. Release-only fixes committed during stabilization must not be lost.

If `develop` is already ahead of the release branch, the merge will include all stabilization commits in history. Do not cherry-pick individual commits — the full merge preserves the complete stabilization trail.

A release branch is considered closed only after both of these steps complete successfully:
1. The branch is merged into `main` and tagged.
2. The branch is merged into `develop`.

Do not apply further hotfixes to a release branch after both steps are done. If `main` is tagged but the `develop` merge has not completed yet, the branch is still open.

## Hotfix during an open release branch

If a production hotfix is required while a release branch is open:

1. Apply the hotfix on a `hotfix/*` branch from `main` (see [Branch Strategy](branch-strategy.md)).
2. Merge the hotfix into `main`, tag, and deploy.
3. Merge the same hotfix branch into the open `release/*` branch.
4. Merge the hotfix into `develop` as well.

Do not apply the hotfix only to the release branch and expect it to reach `main` or `develop` automatically.

## Rollback decision

If a deployed release must be rolled back:

- Do not rewrite or delete the release tag.
- Deploy the previous tagged version from `main`.
- Open a `hotfix/*` branch to address the root cause.
- Tag a new patch release after the fix is validated.

Keep the broken release tag in history for auditability.
