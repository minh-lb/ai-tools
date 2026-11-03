# Git Commit and PR Contracts

## Commit Task Contract

Only an explicit request to execute a commit authorizes committing, limited to the requested scope. Without it, inspect or prepare a proposal and stop before committing. Never push as follow-up without separate permission.

When authorized to commit:

1. Read [purpose](purpose.md), [principles](principles.md), and [commit convention](commit-convention.md).
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
