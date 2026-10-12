---
name: git-workflow
description: Use when performing GitFlow-style repository tasks involving commits, branch changes, merges, pushes, PR/MRs, releases, hotfixes, reverts, conflicts, or worktrees.
metadata:
  author: Minh Luu
---

# Git Workflow

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review.

This skill is written for GitFlow-style repositories. Do not apply it verbatim to trunk-based repositories or repos that release directly from their production branch (commonly `main` or `master`).

## When To Use

Use this skill for any of these task types. The host may auto-load it based on its description, but activation depends on the agent environment; if it was not loaded, invoke/load it explicitly:

- **Commit**: commit, amend, validate or review a commit message, prepare a squash message, split staged changes
- **Branch**: create, name, sync, or validate a branch
- **PR / merge**: open a PR/MR, follow local title/merge conventions, review merge readiness
- **Release**: cut, stabilize, finalize, or roll back a release
- **Conflict**: resolve a merge conflict
- **Worktree**: create, list, or remove a worktree

For commit tasks, load `references/commit-convention.md` before acting.
For PR/MR creation or title tasks, load `references/merge-strategy.md` and use the repository's PR/MR template when one exists. Determine the title from the repository's contribution guide, existing PR/MR history, and any required issue or ticket reference; preserve the established format and language. If no title convention is documented, use the fallback template `[ticket ID] <short description>`. This fallback format requires a real ticket ID; never fabricate or omit it. If no ticket ID is available, ask the user how to proceed before drafting the title. Include the proposed title in the complete preview and obtain approval before external creation or an unapproved push. Follow the user's language preference for the description; if it is unclear from the request or context, ask before drafting the preview. Prefer a suitable authenticated MCP tool; otherwise use an authenticated `gh` or `glab` with explicit source and target projects. Load `references/commit-convention.md` when preparing a squash message.

## When Not To Use

- The repository is trunk-based or releases directly from its production branch (commonly `main` or `master`)
- The task is code editing with no Git workflow decision
- The user wants a generic Git explanation unrelated to this workflow

Adapt the rules first if the repo uses different branch roles or a non-GitFlow release model.

## Scope Boundaries

This skill covers Git workflow mechanics only. The following topics are outside its scope and must be handled by the team or platform separately:

- Branch protection rule setup (GitHub/GitLab settings)
- CI/CD pipeline configuration and gate requirements
- Tag signing and GPG verification
- Database migration safety practices
- Deployment checklists and smoke testing
- Changelog and release notes authoring
- Access control and permissions (RBAC)
- Semantic version bump decision-making
- Incident response governance and rollback SLA
- Hotfix urgency triage criteria

## Output Rules

These rules apply to Git actions under this GitFlow-oriented skill; first confirm the repository actually uses this workflow.

1. Before committing, inspect branch suitability, staged diff scope, and intent. Follow the repository's message format and history; do not impose a scope, syntax, or length rule the project does not use.
2. Split unrelated staged work only when staging intent is clear; otherwise ask before changing the staged set.
3. Use a task branch by default. Before creating a code commit on the repository's verified production or integration branch, ask for explicit confirmation. Confirmation does not bypass branch protection or separate push/merge policies.
4. Never force-push. Before any push, enumerate effective destinations with `git remote get-url --push --all <push-remote>` and require exactly one approved destination; stop on failure, none, or multiple. Recheck immediately before pushing. This also applies to source-branch preparation for PR/MR creation; see `references/principles.md`.
5. Follow this skill's merge-based update policy and do not run history-rewriting operations or `git reset --hard`. If the user's requested operation conflicts with repository policy, stop and clarify.
6. For merge continuations, use the repository's merge-message convention. When actual conflicts were resolved, record the affected files and resolution in the commit body if the project requires it; see `references/conflict-resolution.md`.
7. Do not discard uncommitted/untracked work with `git clean`, `git checkout -- <path>`, `git restore <path>` (without `--staged`), or forced worktree removal without the required explicit approval and safety checks. Never use `git worktree remove --force` to discard a dirty worktree.

## Commit Task Contract

When asked to commit, follow this order exactly:

1. Read `references/purpose.md`, `references/principles.md`, and `references/commit-convention.md`.
2. Run `git status` to inspect both staged and unstaged changes.
3. Determine staging intent from context:
   - If the user explicitly names specific files or says "staged only" / "what's in staged" → commit only what is already staged, do not run `git add`.
   - If nothing is staged yet → stage all relevant changes with `git add` before proceeding.
   - Otherwise → infer from the user's request. When intent is unclear, ask before staging.
4. Inspect the final staged diff.
5. Decide whether the staged work is one logical commit or must be split.
6. Follow the repository's documented type/message convention; do not invent a scope if none is required.
7. Draft the final commit message and validate it against the staged intent.
8. Run relevant project checks (tests, linter) when feasible, or explicitly state which checks were skipped.
9. Execute `git commit` with the validated message.

If any earlier step fails, stop. Explain the blocking reason and the smallest corrective action needed.

## Reference Index

Load only the references needed for the current task. Always start with `purpose.md` and `principles.md`.

| Task | Reference |
|------|-----------|
| Understand scope and assumptions | [purpose.md](references/purpose.md) |
| Baseline rules (always apply) | [principles.md](references/principles.md) |
| Commit message, intent, and split | [commit-convention.md](references/commit-convention.md) |
| Branch create, name, sync, hotfix flow | [branch-strategy.md](references/branch-strategy.md) |
| PR readiness, title, and merge mode | [merge-strategy.md](references/merge-strategy.md) |
| Parallel work, worktree isolation | [worktree-usage.md](references/worktree-usage.md) |
| Merge conflict resolution | [conflict-resolution.md](references/conflict-resolution.md) |
| Release cut, stabilize, finalize, rollback | [release-process.md](references/release-process.md) |
| Frequent Git commands | [common-commands.md](references/common-commands.md) |
| Failure recovery and edge cases | [troubleshooting.md](references/troubleshooting.md) |

Default loading order:
1. `purpose.md` + `principles.md` — always
2. One task-specific reference from the table above
3. `common-commands.md` or `troubleshooting.md` — only if needed
