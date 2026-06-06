# Conflict Resolution

## Merge conflicts

Start by syncing from the correct base branch.

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, and `ci/*` branches — sync from `develop`:

```bash
git fetch origin
git merge origin/develop
```

For `hotfix/*` branches — sync from `main`, not `develop`:

```bash
git fetch origin
git merge origin/main
```

If conflicts appear:

1. Run `git status` to see affected files.
2. Edit each conflicted file intentionally. Do not accept both sides blindly.
3. Run tests for the impacted area.
4. Mark resolved files with `git add <file>`.
5. Complete the merge:
   - Preferred: `git merge --continue`
   - If `git merge --continue` is not available: run `git commit` with no `-m` flag — Git will pre-fill the merge commit message from its template.

Useful commands:

```bash
git status
git diff
git merge --abort
```

## Shared branch conflicts

If the branch is already shared, keep the resolution forward-moving. Do not rewrite history to hide the conflict. Resolve it in place and keep the resulting merge visible.

## Decision rule

When resolving a conflict, preserve:

1. The newest correct business behavior
2. Required schema or API compatibility
3. The branch's intended scope
