---
name: git-engineering-workflow
description: Git workflow for repositories that use an integration branch plus release and hotfix branches. Use this skill when defining or enforcing branch strategy, commit conventions, worktree usage, merge rules, release flow, and practical troubleshooting for AI-assisted development in GitFlow-style projects.
---

# Git Engineering Workflow

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review.

This skill is written for GitFlow-style repositories. Do not apply it verbatim to trunk-based repositories or repos that release directly from `main`.

Read only the references needed for the current task:

- [Purpose](references/purpose.md) for the goal, assumptions, and scope of the workflow
- [Principles](references/principles.md) for the baseline rules that always apply
- [Branch Strategy](references/branch-strategy.md) when creating, naming, or syncing branches
- [Commit Convention](references/commit-convention.md) when preparing commits or validating commit quality
- [Worktree Usage](references/worktree-usage.md) when running parallel tasks across branches
- [Merge Strategy](references/merge-strategy.md) when preparing PRs, reviews, and merge decisions
- [Conflict Resolution](references/conflict-resolution.md) when handling merge conflicts safely
- [Release Process](references/release-process.md) when cutting, stabilizing, or shipping releases
- [Common Commands](references/common-commands.md) for frequent Git command references
- [Troubleshooting](references/troubleshooting.md) for common failure modes and recovery steps

Default loading guidance:

1. Start with [Purpose](references/purpose.md) and [Principles](references/principles.md).
2. Load one workflow-specific reference based on the task.
3. Load [Common Commands](references/common-commands.md) or [Troubleshooting](references/troubleshooting.md) only when needed.
