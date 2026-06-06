# Common Commands

## Current branch

```bash
git branch --show-current
```

## Fetch latest remote state

```bash
git fetch origin
```

## Merge latest `develop` into a task branch

For `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*` — sync from `develop`:

```bash
git fetch origin
git merge origin/develop
```

For `hotfix/*` — sync from `main` instead:

```bash
git fetch origin
git merge origin/main
```

## Abort merge

```bash
git merge --abort
```

## Show concise history

```bash
git log --oneline --graph --decorate
```

## Stash temporary work

```bash
git stash
git stash pop
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

```bash
git worktree add worktrees/<task-name> -b feature/<task-name> develop
```

## Remove a worktree

```bash
git worktree remove worktrees/<task-name>
```

## Create a release branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.5.0
git push origin release/v1.5.0
```

## Create a hotfix branch

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<issue-name>
git push origin hotfix/<issue-name>
```

## Tag a release

```bash
git tag -a v1.5.0 -m "v1.5.0"
git push origin main --tags
```

## Show tags

```bash
git tag --sort=-version:refname | head -10
```
