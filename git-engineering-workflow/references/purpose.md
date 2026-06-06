# Purpose

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review.

This workflow assumes a GitFlow-style repository with:

- `main` or `master` is the production branch
- `develop` is the integration branch
- `release/*` branches for stabilization
- `hotfix/*` branches for urgent production fixes

If a repository uses equivalent branch roles with different names, substitute the names accordingly.

Do not apply this skill unchanged when the repository:

- releases directly from `main`
- does not use an integration branch
- uses short-lived trunk-based branches without release branches

In those cases, adapt the rules first instead of following the examples literally.

Apply this skill when the task involves:

- defining or enforcing branch rules
- structuring AI-assisted development work
- reviewing Git hygiene before commit or PR
- deciding merge, release, or recovery workflows
