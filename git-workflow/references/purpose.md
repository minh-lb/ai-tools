# Purpose

Use this skill to keep Git history clean, collaboration predictable, and AI-assisted changes safe to review.

This workflow assumes a GitFlow-style repository with:

- a configured production branch, commonly `main` or `master`
- an integration branch, commonly `develop`
- `release/*` branches for stabilization
- `hotfix/*` branches for urgent production fixes

Identify the actual branch roles and remote roles from repository configuration and docs before acting. Use `<fetch-remote>` for authoritative upstream/base refs and `<push-remote>` for the approved writable destination; they may be the same in a single-project workflow and differ in a fork. Do not infer production from `main`/`master` or remote roles from `origin`/`upstream` names. A push to a fork does not integrate or release on upstream; direct release/hotfix pushes and production tags must target the actual authorized project, otherwise use its PR/MR flow and verify upstream integration.

Do not apply this skill unchanged when the repository:

- releases directly from its production branch without a separate integration/release flow
- does not use an integration branch
- uses short-lived trunk-based branches without release branches

In those cases, adapt the rules first instead of following the examples literally.

Apply this skill when the task involves:

- defining or enforcing branch rules
- structuring AI-assisted development work
- reviewing Git hygiene before commit or PR
- deciding merge, release, or recovery workflows
