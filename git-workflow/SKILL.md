---
name: git-workflow
description: Use when handling Git branches, commits, pushes, PR/MRs, merges, conflicts, releases, or worktrees. Load before every Git operation, including read-only checks; require explicit permission for commits and pushes.
metadata:
  author: Minh Luu
---

# Git Workflow

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review. Its loading and authorization rules apply in every repository; branch, merge, and release recipes must follow that repository's documented model.

## When To Use

Load this skill before each Git action. If it is absent from the current context, including after context compaction, read it before acting. When invoked inside **task-delivery**, keep its selected current checkout and no-worktree/no-automatic-commit boundaries; this skill does not override user or orchestrator constraints. This includes read-only commands (`status`, `diff`, `log`, `show`, remote inspection), write commands, and Git operations through scripts, IDEs, MCP, `gh`, or `glab`. Do not assume keyword matching guarantees activation. Host instructions must enforce this preflight; metadata alone cannot guarantee loading.

- **Inspection:** inspect the working tree, staged changes, history, refs, or remotes.
- **Commit:** commit, amend, review a commit message, prepare a squash message, or split staged changes.
- **Branch:** create, name, sync, or validate a branch.
- **PR / merge:** prepare or open a PR/MR, review merge readiness, or handle integration conventions.
- **Release:** cut, stabilize, finalize, or roll back a release.
- **Conflict:** resolve a merge conflict.
- **Worktree:** create, list, use, or remove a worktree.

For commit tasks, read `references/commit-convention.md` before acting. For PR/MR title, description, or creation tasks, read `references/merge-strategy.md` and use the repository's template when one exists. For a squash message, also read `references/commit-convention.md`.

## Branch Model

Confirm branch roles and repository policy before applying a recipe. Follow GitFlow only when documented; do not apply its recipes verbatim to trunk-based repositories or repositories that release directly from production. In a fork, distinguish the upstream fetch remote from the fork push remote. If local policy conflicts with a requested operation, stop and clarify.

## Safety And Authorization

- Never create a commit or push without explicit user permission for that action and scope. “Review,” “fix,” “prepare a commit,” “create a PR/MR,” or release/conflict work is not implicit commit or push permission. Commit permission does not authorize push. This applies to tags, amendments, auto-committing merges/reverts/cherry-picks, continuation commands, and tools that commit or push indirectly.
- Before committing, inspect branch suitability, staged diff scope, and intent. Follow the repository's message format and history; do not impose a scope, syntax, or length rule the project does not use.
- Prefer a task branch when a new branch is in scope and permitted. If the user or active workflow requires the current branch and checkout, do not create/switch branches. Before creating a code commit on a verified production or integration branch, ask for explicit confirmation. Confirmation does not bypass branch protection or separate push/merge policies.
- Never force-push. Before a push, run `git remote get-url --push --all <push-remote>` and proceed only with exactly one approved destination. Stop if the command fails, returns none or multiple destinations, or the project is unclear. Recheck immediately before the push. This applies to source-branch preparation for PR/MR creation too; see `references/principles.md`.
- Follow repository policy for branch updates. Do not rewrite history or run `git reset --hard`. Do not discard uncommitted or untracked work with `git clean`, `git checkout -- <path>`, `git restore <path>` without `--staged`, or forced worktree removal. Do not auto-stash or change the staged set when intent is unclear.
- Before merging, confirm the working tree is clean and no operation is active. Respect branch protection. Never use `git worktree remove --force` to discard a dirty worktree.

Example: “Prepare a PR” allows review and drafting, not commit or push.

## Commit Task Contract

For an explicitly authorized commit, read [commit and PR contracts](references/commit-pr-contracts.md) and [commit convention](references/commit-convention.md). Verify the staged scope and checks; do not commit or stage without the required authorization.

## PR / MR Preparation

For PR/MR drafting or creation, read [commit and PR contracts](references/commit-pr-contracts.md) and [merge strategy](references/merge-strategy.md). Preview the full diff-backed title, description and endpoints; obtain required approvals before remote writes.

## Scope Boundaries

This skill covers Git workflow mechanics. Branch protection configuration, CI/CD policy, tag signing, database migration safety, deployment checklists, changelog authoring, access control, versioning decisions, and incident-response governance are handled by the team or platform.

## Reference Index

Read only references needed for the operation. Basic read-only Git inspection needs this SKILL.md alone; consult [purpose](references/purpose.md) and [principles](references/principles.md) for consequential branch/history changes. The optional [operations index](references/operations.md) routes advanced tasks.

| Task | Reference |
|---|---|
| Understand scope and assumptions | [purpose.md](references/purpose.md) |
| Baseline safeguards | [principles.md](references/principles.md) |
| Commit message, intent, and split | [commit-convention.md](references/commit-convention.md) |
| Branch create, name, sync, or hotfix flow | [branch-strategy.md](references/branch-strategy.md) |
| PR readiness, title, and merge mode | [merge-strategy.md](references/merge-strategy.md) |
| Parallel work and worktree isolation | [worktree-usage.md](references/worktree-usage.md) |
| Merge conflict resolution | [conflict-resolution.md](references/conflict-resolution.md) |
| Release cut, stabilize, finalize, or rollback | [release-process.md](references/release-process.md) |
| Frequent Git commands | [common-commands.md](references/common-commands.md) |
| Failure recovery and edge cases | [troubleshooting.md](references/troubleshooting.md) |

For errors, load `troubleshooting.md` only when needed. Do not load every reference by default.
