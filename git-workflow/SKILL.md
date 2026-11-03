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

Only an explicit request to execute a commit authorizes committing, limited to the requested scope. Without it, inspect or prepare a proposal and stop before committing. Never push as follow-up without separate permission.

When authorized to commit:

1. Read `references/purpose.md`, `references/principles.md`, and `references/commit-convention.md`.
2. Inspect both staged and unstaged changes with `git status`.
3. Determine staging intent. If the user names files or says “staged only,” commit only what is staged and do not run `git add`. If nothing is staged, stage relevant changes. If staging intent is unclear, ask before changing the staged set.
4. Inspect the final staged diff. Split unrelated work only when intent is clear.
5. Follow the repository's documented message convention; do not invent a scope.
6. Run relevant checks when feasible and report any gaps.
7. Confirm the permission still covers the final scope and branch, then commit with the validated message. Stop unless push is separately authorized.

If an earlier step fails, stop and explain the blocker and smallest corrective action.

## PR / MR Preparation

Write descriptions for human and AI reviewers who do not have access to the authoring chat. Explain what the change does and why. Ground the description in the full target-relative diff and verified requirements; include relevant design decisions, behavior that must remain unchanged, affected boundaries, and verification gaps.

For the Summary, include a concise **Context** bullet before **Actual** and **Expect**. Name the affected screen, flow, component, or process and any relevant setting or data precondition; keep it focused on reviewer orientation and avoid repeating Actual/Expect. Determine title format from contribution guidance, existing PR/MR history, and required issue references. If no convention is documented, use `[ticket ID] <short description>` with a real ticket ID. Never fabricate or omit the ID; ask how to proceed if none is available.

Include the proposed title and complete description in the preview, along with source and target projects/branches and relevant SHAs. Get approval before external creation and separate approval for any push that was not explicitly authorized. Use the user's language preference. Prefer a suitable authenticated MCP tool; otherwise use authenticated `gh` or `glab` with explicit source and target projects. Verify the result after submission.

## Scope Boundaries

This skill covers Git workflow mechanics. Branch protection configuration, CI/CD policy, tag signing, database migration safety, deployment checklists, changelog authoring, access control, versioning decisions, and incident-response governance are handled by the team or platform.

## Reference Index

Read only the references that apply to the current task. Start with `purpose.md` and `principles.md` for workflow context and baseline safeguards. The compact [operations index](references/operations.md) also maps tasks to detailed guides.

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
