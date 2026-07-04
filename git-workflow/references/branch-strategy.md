# Branch Strategy

This reference assumes a GitFlow-style repository with `develop` as the integration branch and `main` as the production branch. If your repository uses different names for these roles, substitute them consistently in all commands on this page.

## Task branches

Start from the integration branch:

```bash
git checkout develop
git pull origin develop
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

Use merge instead of rebase so the branch history stays intact and recoverable.

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch origin
git merge origin/develop
```

For `hotfix/*` — sync from `main`, not `develop`:

```bash
git fetch origin
git merge origin/main
```

## History safety rules

This workflow does not permit history-rewriting operations on task branches.

Safe default:

- sync branches by merging from the correct base: `develop` for task branches, `main` for hotfix branches
- keep new corrective work as forward-moving commits
- avoid destructive history edits even on local branches when the same result can be achieved with merge or follow-up commits
- do not rewrite shared release or hotfix branch history

This skill does not permit:

- `git rebase`
- `git rebase -i`
- `git rebase --continue`
- `git rebase --abort`
- `git reset --hard`
- `git push --force`
- `git push --force-with-lease`

If a branch needs the latest `develop`, prefer:

```bash
git fetch origin
git merge origin/develop
```

If local commits become messy, add a clean follow-up commit instead of rewriting history.

## Hotfix branches

Start urgent fixes from the production branch:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue
```

After the fix is validated, merge back in this exact order:

```bash
# 1. Merge into main and tag
git checkout main
git pull origin main
git merge hotfix/critical-issue
git tag -a v1.4.1 -m "v1.4.1"
git push origin main --tags

# 2. If a release/* branch is currently open, merge into it before develop
git checkout release/v1.5.0
git merge hotfix/critical-issue
git push origin release/v1.5.0

# 3. Merge into develop so the fix is not lost
git checkout develop
git pull origin develop
git merge hotfix/critical-issue
git push origin develop
```

The order matters: merge into `release/*` before `develop` so the release stabilization history stays intact. If no `release/*` branch is open, skip step 2 and go directly from step 1 to step 3.

Do not cherry-pick as the primary merge strategy. Use full merges to keep the history traceable.
