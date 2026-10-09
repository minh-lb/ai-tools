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
- **PR / merge**: open a PR, prepare a squash title, choose a merge mode, review merge readiness
- **Release**: cut, stabilize, finalize, or roll back a release
- **Conflict**: resolve a merge conflict
- **Worktree**: create, list, or remove a worktree

For commit tasks, load `references/commit-convention.md` before acting.
For PR/MR creation or title tasks, load `references/merge-strategy.md` and use `templates/pull-request-template.md` for the description. Before creating, ask the description language, default the title to English, and show a complete preview for user approval. Prefer MCP when an appropriate tool is available; otherwise use authenticated `gh` or `glab`. Load `references/commit-convention.md` when preparing a squash commit message.

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

These rules apply to every Git action taken under this skill:

1. Never treat `git commit` as a raw shell action. Always validate branch suitability, staged diff scope, and commit intent first.
2. Reject vague commit messages such as `fix: bug fix`, `chore: update`, `wip`, or messages missing scope. This workflow requires `<type>(<scope>): <summary>`.
3. `scope` is mandatory for normal commits. Choose a stable subsystem, domain, or tooling boundary from the diff.
4. If staged changes span unrelated scopes or intents, stop and split into multiple commits instead of using a vague or catch-all scope.
5. Before committing, verify the commit message matches the real intent of the diff and that no debug artifacts, secrets, or unintended files are staged.
6. Never add any `Co-authored-by` or co-author attribution line — not in the body, not in the footer, not in squash messages.
7. Use a task branch by default. Before making a code commit on the repository's production branch (commonly `main` or `master`) or integration branch (commonly `develop`), ask the user for explicit confirmation. If approved, committing on the current branch is allowed; do not force a checkout to a new task branch. Confirmation does not bypass branch protection or separate push/merge policies. For release/hotfix integration merges, also follow the branch/release references and repository policy.
8. Never use `git push --force`, `git push -f`, or `git push --force-with-lease`. Keep remote history forward-moving.
9. Before any push, enumerate all effective destinations with `git remote get-url --push --all <push-remote>` and require exactly one approved destination. If the command fails, returns no destination, or returns multiple destinations, stop; recheck the same destination immediately before pushing. This applies to direct pushes and PR/MR source-branch preparation — see `references/principles.md`.
10. Never use `git rebase`, `git rebase -i`, `git rebase --continue`, `git rebase --abort`, or `git reset --hard`. Use merge-based updates instead.
11. If the task is a merge continuation and Git provides a merge commit template, keep the merge flow consistent with `references/merge-strategy.md` instead of forcing a normal conventional summary line. If the merge had actual conflicts, append a `Conflicts resolved in:` list (file + how it was resolved) to the commit body — see `references/conflict-resolution.md`.
12. Never run `git clean -f`/`-fd`/`-fx`, `git checkout -- <path>`, or `git restore <path>` (without `--staged`) on uncommitted or untracked work without explicit user approval. Never use `git worktree remove --force` to discard a dirty worktree, even with approval; preserve the changes and remove it normally once clean. Consider `--force` only for a confirmed-clean worktree if Git still requires it, after checking `git status` and getting explicit user confirmation (see `references/principles.md`).

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
6. Choose the correct `type` and `scope` from the actual diff — not from the user's shorthand wording alone.
7. Draft the final commit message in the required format and validate it against the staged intent.
8. Run relevant project checks (tests, linter) when feasible, or explicitly state which checks were skipped.
9. Execute `git commit` with the validated message.

If any earlier step fails, stop. Explain the blocking reason and the smallest corrective action needed.

## Reference Index

Load only the references needed for the current task. Always start with `purpose.md` and `principles.md`.

| Task | Reference |
|------|-----------|
| Understand scope and assumptions | [purpose.md](references/purpose.md) |
| Baseline rules (always apply) | [principles.md](references/principles.md) |
| Commit message, type, scope, split | [commit-convention.md](references/commit-convention.md) |
| Branch create, name, sync, hotfix flow | [branch-strategy.md](references/branch-strategy.md) |
| PR readiness, squash title, merge mode | [merge-strategy.md](references/merge-strategy.md) |
| Parallel work, worktree isolation | [worktree-usage.md](references/worktree-usage.md) |
| Merge conflict resolution | [conflict-resolution.md](references/conflict-resolution.md) |
| Release cut, stabilize, finalize, rollback | [release-process.md](references/release-process.md) |
| Frequent Git commands | [common-commands.md](references/common-commands.md) |
| Failure recovery and edge cases | [troubleshooting.md](references/troubleshooting.md) |

Default loading order:
1. `purpose.md` + `principles.md` — always
2. One task-specific reference from the table above
3. `common-commands.md` or `troubleshooting.md` — only if needed
