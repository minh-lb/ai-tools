---
name: git-workflow
description: Load before every Git operation, including read-only checks and PR/MR tasks; require user permission to commit or push.
metadata:
  author: Minh Luu
---

# Git Workflow

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review.

Load this skill before Git operations in every repository. Its loading and authorization gates apply regardless of branching model. Its branch, merge, and release recipes assume GitFlow; do not apply those recipes verbatim to trunk-based repositories or repos that release directly from their production branch.

## When To Use

Before each Git action, confirm this skill and its baseline references are loaded in the current context. If absent (including after context compaction), read them before executing. This includes read-only commands (`status`, `diff`, `log`, `show`, remote inspection), write commands, and Git operations through scripts, IDEs, MCP, `gh`, or `glab`. Do not assume keyword matching guarantees activation. Host instructions must enforce this preflight; skill metadata alone cannot guarantee loading.

- **Inspection**: inspect working tree, staged changes, history, refs, or remotes
- **Commit**: commit, amend, validate or review a commit message, prepare a squash message, split staged changes
- **Branch**: create, name, sync, or validate a branch
- **PR / merge**: open a PR/MR, follow local title/merge conventions, review merge readiness, and prepare its description
- **Release**: cut, stabilize, finalize, or roll back a release
- **Conflict**: resolve a merge conflict
- **Worktree**: create, list, or remove a worktree

For commit tasks, load `references/commit-convention.md` before acting.
For PR/MR creation, title, or description preparation/update tasks, load `references/merge-strategy.md` and use the repository's PR/MR template when one exists. For the description Summary, include a concise **Context** bullet before **Actual** and **Expect**, naming the affected screen/flow/component/process and any relevant setting or data precondition when applicable; keep it focused on reviewer orientation and avoid unrelated workflow detail or repeating Actual/Expect. Determine the title from the repository's contribution guide, existing PR/MR history, and any required issue or ticket reference; preserve the established format and language. If no title convention is documented, use the fallback template `[ticket ID] <short description>`. This fallback format requires a real ticket ID; never fabricate or omit it. If no ticket ID is available, ask the user how to proceed before drafting the title. Include the proposed title in the complete preview and obtain approval before external creation or an unapproved push. Follow the user's language preference for the description; if it is unclear from the request or context, ask before drafting the preview. Prefer a suitable authenticated MCP tool; otherwise use an authenticated `gh` or `glab` with explicit source and target projects. Load `references/commit-convention.md` when preparing a squash message.

Write PR/MR descriptions for both human reviewers and AI reviewers who have no access to the authoring chat. Explain what the MR does and why, and provide the review context defined in `references/merge-strategy.md`: relevant design decisions, behavior that must remain unchanged, affected boundaries, and verification gaps. Ground the description in the full target-relative diff and verified requirements; keep it useful without relying on chat history.

## When Not To Use

- The task is code editing with no Git operation or workflow decision
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

Loading and authorization gates apply to all Git actions. Confirm the branching model before applying GitFlow-specific recipes.

0. Never create a commit or push without explicit user permission for that action and scope. “Review”, “fix”, “prepare a commit”, “create a PR/MR”, or release/conflict work is not implicit commit/push permission. Commit permission does not authorize push; PR/MR approval authorizes push only when the exact push is explicitly included. This covers all branches, tags, amendments, auto-committing merges/reverts/cherry-picks, continuation commands, and tools that commit or push indirectly. Stop and ask when scope is unclear; do not run a command that can auto-commit without commit permission.
1. Before committing, inspect branch suitability, staged diff scope, and intent. Follow the repository's message format and history; do not impose a scope, syntax, or length rule the project does not use.
2. Split unrelated staged work only when staging intent is clear; otherwise ask before changing the staged set.
3. Use a task branch by default. Before creating a code commit on the repository's verified production or integration branch, ask for explicit confirmation. Confirmation does not bypass branch protection or separate push/merge policies.
4. Never force-push. Before any push, enumerate effective destinations with `git remote get-url --push --all <push-remote>` and require exactly one approved destination; stop on failure, none, or multiple. Recheck immediately before pushing. This also applies to source-branch preparation for PR/MR creation; see `references/principles.md`.
5. Follow this skill's merge-based update policy and do not run history-rewriting operations or `git reset --hard`. If the user's requested operation conflicts with repository policy, stop and clarify.
6. For merge continuations, use the repository's merge-message convention. When actual conflicts were resolved, record the affected files and resolution in the commit body if the project requires it; see `references/conflict-resolution.md`.
7. Do not discard uncommitted/untracked work with `git clean`, `git checkout -- <path>`, `git restore <path>` (without `--staged`), or forced worktree removal without the required explicit approval and safety checks. Never use `git worktree remove --force` to discard a dirty worktree.

## Commit Task Contract

Only an explicit request to execute a commit (not just draft/review its message) authorizes committing, limited to the requested scope. Without it, inspect or prepare a proposal and stop before committing. Never push as follow-up without separate permission.

When authorized to commit, follow this order exactly:

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
9. Confirm explicit commit permission still covers the final staged scope and branch; ask again if it changed or is unclear. Execute `git commit` with the validated message. Stop here unless a push is separately authorized.

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
