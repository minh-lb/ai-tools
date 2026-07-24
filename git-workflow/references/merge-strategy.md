# Merge Strategy

## Preferred merge mode

Default to squash merge for regular task branches:

```text
Squash and Merge
```

This applies to: `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*`.

These branches must merge into `develop` (the integration branch). Do not merge task branches directly into `main`. Changes reach `main` only through `release/*` or `hotfix/*` branches.

`release/*` and `hotfix/*` branches follow non-squash merge flows. See [Release Process](release-process.md) and [Branch Strategy](branch-strategy.md) for those flows.

This keeps history easier to scan, rollback, and audit.

The PR title or final squash commit message must follow the same commit convention as normal commits:

```text
<type>(<scope>): <summary>
```

If the platform lets reviewers edit the squash message before merge, clean it up before completing the merge.

Good PR titles:

```text
feat(billing): add invoice export endpoint
fix(webhooks): prevent duplicate event processing
refactor(checkout): simplify payment service
chore(deps): bump aws-sdk to v3.632.0
ci(github-actions): run integration tests on pull requests
```

Bad PR titles:

```text
Update some things
fix bug
WIP: payment stuff
feat: changes
```

The PR title is the squash commit message. Treat it with the same care as a commit summary line.

If the current PR title does not satisfy `<type>(<scope>): <summary>`, do not proceed with the merge. Propose a corrected title, explain why it fails, and wait for confirmation before continuing.

## When not to squash

Do not squash by default when preserving the curated commit sequence matters more than compressing history.

Typical exceptions:

- release branches with auditable stabilization commits
- branches intentionally structured as a small sequence of reviewable commits
- branches whose commit history is already part of a documented release trail

In those cases, use a non-squash merge mode intentionally and keep every visible commit compliant with the commit convention.

## Hotfix branches and PRs

Hotfix branches follow the direct merge flow described in [Branch Strategy](branch-strategy.md), not the PR squash flow.

If the team requires a PR review for hotfixes, use a non-squash merge to preserve the individual fix commits. Do not squash a hotfix into a single commit when the step-by-step recovery history matters for auditing or rollback.

## Before opening a PR

Confirm:

1. The feature or fix behaves as expected.
2. Automated tests pass.
3. No merge conflicts remain.
4. No debug code or commented-out dead code remains.
5. Required documentation is updated.
6. Database migrations are reviewed for safety and rollback.
7. Backward compatibility is checked when relevant.

## Creating the PR from local (GitHub or GitLab CLI)

Detect the platform from the remote before doing anything else:

```bash
git remote get-url origin
```

- URL contains `github.com` → use `gh` (GitHub CLI)
- URL contains `gitlab.com` or a self-hosted GitLab domain → use `glab` (GitLab CLI)

Both require the CLI installed and authenticated first — check with `gh auth status` / `glab auth status`. If the CLI isn't installed or isn't authenticated, do not fake a PR or improvise an API call: tell the user the CLI is unavailable and hand them the validated title/body to paste into the platform's web UI instead.

Push the branch before creating the PR (never force):

```bash
git push -u origin <branch-name>
```

### GitHub

```bash
gh pr create \
  --base develop \
  --head <branch-name> \
  --title "<type>(<scope>): <summary>" \
  --body "$(cat <<'EOF'
<what changed, why, test plan>
EOF
)"
```

### GitLab

```bash
glab mr create \
  --source-branch <branch-name> \
  --target-branch develop \
  --title "<type>(<scope>): <summary>" \
  --description "<what changed, why, test plan>"
```

GitLab calls it a merge request (MR) rather than a pull request — same title convention and same base-branch rules apply.

For both: only use `--base main` / `--target-branch main` when this is a `release/*` or `hotfix/*` PR that targets `main` directly (see [Branch Strategy](branch-strategy.md)); everything else targets `develop`. The generated title still has to pass the same `<type>(<scope>): <summary>` validation as any commit message — the CLI accepting the string is not the same as it being correct.

## Review expectations

Reviewers should inspect:

- architecture and separation of concerns
- requirement correctness and edge cases
- error handling and resilience
- authentication, authorization, and validation
- query and API efficiency
- readability, naming, duplication, and testability
