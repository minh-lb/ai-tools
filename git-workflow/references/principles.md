# Principles

## Never work directly on `main`, `master`, or `develop`

Create a task branch for every change. Direct commits to `main`, `master`, or `develop` are not allowed.

Allowed branch patterns:

```text
feature/*     — new capabilities or behavior
bugfix/*      — non-production defects
hotfix/*      — urgent production fixes
release/*     — release stabilization
chore/*       — repository maintenance, config, non-behavioral updates, build tooling, dependency updates
docs/*        — documentation-only changes
ci/*          — CI pipeline and automation changes
```

Note: there is no `build/*` branch prefix. Commits with the `build` type (build tooling, dependency updates) belong on `chore/*` branches. Branch prefixes map to scope of work, not to commit types one-to-one.

Avoid direct development on:

```text
main
master
develop
```

## One task equals one branch

Each branch should cover one business objective or one bug.

Good examples:

```text
feature/user-authentication
feature/payment-webhook
bugfix/order-status-sync
hotfix/payment-timeout
chore/update-editorconfig
docs/update-deployment-guide
ci/add-integration-test-job
```

Bad examples:

```text
feature/multiple-changes
feature/misc
```

## Keep changes small and reviewable

Do not mix feature work, refactors, infra changes, and unrelated fixes in the same branch unless they are tightly coupled.

## Do not rewrite shared history

This workflow does not allow force-pushing branch history after a branch has been published.

Do not use:

- `git push --force`
- `git push --force-with-lease`

If a branch has already been pushed, preserve its remote history and prefer forward-moving fixes such as new commits or a merge from the correct base (`develop` for task branches, `main` for hotfix branches).

## Do not use rebase or hard reset in this workflow

This workflow blocks history-rewriting operations because they can hide, drop, or orphan code when used incorrectly.

Do not use:

- `git rebase`
- `git rebase -i`
- `git rebase --continue`
- `git rebase --abort`
- `git reset --hard`

To bring a branch up to date, use `git fetch origin` followed by a merge from the correct base:

- For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*`: merge from `origin/develop`
- For `hotfix/*`: merge from `origin/main`

If local work appears lost, use `git reflog` to recover commits before considering any reset.

## Do not delete branches as routine cleanup

This workflow does not use branch deletion as a default cleanup step.

Keep branch records for traceability unless the repository has an explicit archival or retention policy outside this skill.

## Review AI output like human output

Before commit or PR, verify:

1. The code matches the requirement.
2. Tests cover the intended behavior.
3. No debug artifacts remain.
4. No secrets or local-only files are staged.
5. Generated code follows project conventions.
