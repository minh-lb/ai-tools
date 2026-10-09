# Merge Strategy

## Preferred merge mode

Default to squash merge for regular task branches:

```text
Squash and Merge
```

This applies to: `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `ci/*`.

These branches must merge into the repository's integration branch (commonly `develop`). Do not merge task branches directly into the configured production branch (commonly `main` or `master`). Changes reach production only through `release/*` or `hotfix/*` branches.

`release/*` and `hotfix/*` branches follow non-squash merge flows. See [Release Process](release-process.md) and [Branch Strategy](branch-strategy.md) for those flows.

This keeps history easier to scan, rollback, and audit.

## Pull Request Title Convention

Use this format for every PR/MR title:

```text
[ISSUE-ID] <Action> <Feature/Component>
```

Rules:

- Write the title in English by default and include a valid issue ID, or `[NO-ISSUE]` only when explicitly allowed. Use another language only when the user explicitly requests it.
- Start the action with a capitalized imperative verb.
- Describe the primary objective of the entire PR/MR, accurately reflecting the final diff.
- Keep the title under 72 characters when practical; do not end it with a period.
- Avoid vague or generic descriptions.
- Do not use Conventional Commits format for PR/MR titles.
- Use `[NO-ISSUE]` only when explicitly allowed.

Examples:

```text
[AUTH-123] Implement JWT authentication
[FE-201] Add dashboard analytics
[BUG-305] Fix login session expiration
[API-102] Optimize user search performance
```

If no valid issue ID is available and `[NO-ISSUE]` has not been explicitly allowed, stop and ask rather than inventing an ID. Before merging, verify the current PR/MR title still follows this convention and accurately reflects the final diff; if it does not, propose a corrected title and wait for confirmation before proceeding. If the platform uses the PR/MR title as the squash commit message, set a separate squash commit message that follows `references/commit-convention.md`; do not change the PR/MR title into Conventional Commits format.

## When not to squash

Do not squash by default when preserving the curated commit sequence matters more than compressing history.

Typical exceptions:

- release branches with auditable stabilization commits
- branches intentionally structured as a small sequence of reviewable commits
- branches whose commit history is already part of a documented release trail

In those cases, use a non-squash merge mode intentionally and keep every visible commit compliant with the commit convention.

## Hotfix branches and PRs

Hotfix branches follow the non-squash integration flow described in [Branch Strategy](branch-strategy.md), not the regular task-branch squash flow. Use a merge commit or ancestry-preserving fast-forward, never rebase-and-merge, so the hotfix tip remains an ancestor of each target for verification. Integrate directly only when branch policy permits and the operator is authorized; before a direct integration merge that creates a commit on the configured production or integration branch, ask the user for explicit confirmation. Otherwise use a PR/MR with an ancestry-preserving merge mode. Do not squash a hotfix into a single commit when the step-by-step recovery history matters for auditing or rollback.

## Before opening a PR

Confirm:

1. The feature or fix behaves as expected.
2. Automated tests pass.
3. No merge conflicts remain.
4. No debug code or commented-out dead code remains.
5. Required documentation is updated.
6. Database migrations are reviewed for safety and rollback.
7. Backward compatibility is checked when relevant.

## Creating a PR/MR

### Ask, prepare, and preview before creation

Before drafting the description, ask the user whether they want it in English or Vietnamese. Render the complete description, including headings and explanatory text, in the chosen language while preserving the template's sections and meaning. The PR/MR title defaults to English regardless of the description language; use another title language only if explicitly requested.

Prepare the description from `templates/pull-request-template.md`. Fill applicable sections, include links to related tasks in Plane, Jira, Trello, or another tracker when available (otherwise write N/A), and record test statuses truthfully with evidence. Replace or remove the Related issue placeholder with the applicable issue reference.

Before creating, show a complete preview and wait for the user's explicit approval. Include all fields below, and do not summarize or omit any part of the description:

```text
Source branch: <source-owner/project>:<source-branch>
Fetch/base remote: <fetch-remote>
Source push remote: <push-remote>
Effective push target (if different): <approved source project; credentials redacted>
Source tip SHA: <approved-commit-sha>
Target project: <target-owner/project>
Target branch: <target-branch>
Planned source-branch push: <none or exact remote/branch to be pushed>
Title: <PR/MR title>
Description:
<complete rendered description>
```

If the user requests changes, revise and show the full preview again. Create only after approval of the final preview. Bind approval to the exact source owner/project, fetch/base remote, source push remote and tip SHA, target project and branch, title, description, and any planned push. If any field or source tip changes, present the revised complete preview and get approval again. Recheck the local source tip and remote ref immediately before creation; if either differs from the approved SHA, stop and obtain approval for a new preview.

### Choose the creation method

First identify the repository and hosting platform, then prefer an available, authenticated MCP tool for that platform. With MCP, explicitly select the approved target project and source owner/project; do not rely on a current tab or default repository. If no suitable MCP tool is available, use the matching CLI (`gh` for GitHub or `glab` for GitLab) if installed and authenticated. Before preview, confirm the intended source branch is checked out (`git branch --show-current`) and the worktree state is understood (`git status --short`); only committed content is included in the PR/MR. First enumerate all effective push destinations with `git remote get-url --push --all <push-remote>`; this includes that remote's configured URLs when no separate push URL exists. Git can push to every effective destination, so require exactly one approved destination; if more than one is returned, stop and ask the user to configure/select a single destination before any push. Verify that the single destination is the approved source project; treat URL output as sensitive and do not expose embedded credentials. Only then record the local source-tip SHA with `git rev-parse refs/heads/<branch-name>` and check the exact source ref against that approved effective push destination with `git ls-remote --exit-code <effective-push-url> refs/heads/<branch-name>`, since fetch and push URLs may differ. A matching ref with exit status 0 returns its SHA; status 2 means no matching ref. Other non-zero statuses or network/authentication errors are failures, not evidence that the branch is missing—stop and report them rather than pushing. Include the source owner/project, fetch/base remote, source push remote, single effective push destination/project (credentials redacted), approved local tip SHA, target project, and whether a push is needed in the complete preview. A needed push is an external side effect and requires explicit approval as part of that preview; do not push before approval. Immediately before pushing, re-enumerate effective push destinations and require the same single approved destination; if it changed or multiple destinations exist, stop and obtain approval for a revised preview. Verify the local tip still equals the approved SHA, push only if the ref was confirmed missing (never force), then verify the remote ref SHA exactly equals the approved SHA against that same effective push destination. If an existing remote ref differs, stop; do not overwrite it. Recheck both local and remote SHAs immediately before PR/MR creation; any mismatch requires a revised preview and approval. Do not create the PR/MR through MCP or CLI before preview approval.

Inspect the selected remote URL to identify the source host and distinguish it from the PR/MR target project. In fork workflows, these may differ; do not assume `origin` or `upstream` is correct by name. Treat remote URLs as potentially sensitive and redact embedded credentials before sharing or logging output. Detect the platform from the selected repository remote (at minimum for CLI fallback, and whenever the repository/platform is not already established):

```bash
git remote get-url <push-remote>
```

- URL contains `github.com` → use `gh` (GitHub CLI)
- URL contains `gitlab.com` or a self-hosted GitLab domain → use `glab` (GitLab CLI)

For a CLI fallback, verify the selected CLI is installed and authenticated first (`gh auth status` / `glab auth status`). Explicitly bind the CLI invocation to the approved target project and source owner/project; do not rely on the current directory or default remote for a fork workflow. If the CLI cannot represent the approved source and target separately, use a suitable authenticated MCP tool or stop and provide the approved preview for the user to create manually.

Only after approval of a preview that explicitly includes the push, confirm `<push-remote>` is the intended writable source remote and push without force:

```bash
git push -u <push-remote> <branch-name>
```

Verify the branch exists on that source remote before creating the PR/MR; in a fork workflow, this publication does not imply the PR/MR target has integrated the branch. If the remote or target project differs from the approved preview, stop and present a revised preview for approval.

Use the completed description preview unchanged when creating the PR/MR.

### GitHub

```bash
gh pr create \
  --repo <target-owner>/<target-repo> \
  --base <target-branch> \
  --head <source-owner>:<source-branch> \
  --title "[ISSUE-ID] <Action> <Feature/Component>" \
  --body-file <filled-template-file>
```

### GitLab

Before using the GitLab CLI for a fork, inspect `glab mr create --help` and confirm the installed version supports explicit source and target project selection. If it cannot represent the approved projects, do not use that CLI; use a suitable authenticated MCP tool or stop and provide the approved preview manually. For same-project requests, verify the CLI's selected project matches the approved target project.

```bash
glab mr create \
  --source-branch <source-branch> \
  --target-branch <target-branch> \
  --title "[ISSUE-ID] <Action> <Feature/Component>" \
  --description "$(cat <filled-template-file>)"
```

GitLab calls it a merge request (MR) rather than a pull request; the same title convention, description template, and target-branch rules apply. Use the actual issue ID and a concise English imperative title. Use `[NO-ISSUE]` only when explicitly allowed.

Target the configured production branch only for `release/*` or `hotfix/*` PRs/MRs that should integrate directly into production (see [Branch Strategy](branch-strategy.md)); otherwise target the configured integration branch (commonly `develop`). Validate the target against repository policy and the title convention before previewing and again before creation. If the platform uses the PR/MR title as the squash commit message, set a separate squash commit message that follows `references/commit-convention.md`.

### Verify after creation

After the platform reports the PR/MR was created, inspect the created record and confirm:

1. A valid PR/MR URL is present.
2. The source branch and target branch are correct.
3. The title matches the required convention and reflects the diff.
4. The platform-reported state is open (or the expected state if the platform reports another state).
5. The description contains the completed template and its testing evidence.

Report the URL and confirmed details. If creation or any verification fails, state what failed and do not claim the PR/MR is successfully created.

## Review expectations

Reviewers should inspect:

- architecture and separation of concerns
- requirement correctness and edge cases
- error handling and resilience
- authentication, authorization, and validation
- query and API efficiency
- readability, naming, duplication, and testability
