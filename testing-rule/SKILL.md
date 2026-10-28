---
name: testing-rule
description: Use when running, writing, reviewing, or debugging E2E tests and frontend journeys, including forms, async UI, responsive/accessibility checks, smoke/regression runs, and flaky failures. Not for unit-only testing or test case documentation alone.
metadata:
  author: Minh Luu
---

# Testing Rule

Verify user goals through the product's real entry point. Match conclusions to executed evidence and tested boundaries.

## Workflow

1. Inspect repository instructions, acceptance criteria, existing runner/fixtures, and tool capabilities. Reuse the project's stack and commands.
2. Select journeys by changed behavior and risk: actor, initial state, action, expected outcome. Confirm target, account, data, boundaries, and authorization. Use approved requirements as the oracle; mark essential missing expectations `pending-spec`.
3. Execute through the product entry point. Verify the outcome, including readback after reload when persistence matters; a click, toast, or HTTP status alone is insufficient.
4. Preserve failures and investigate before retrying or assigning blame. Bound investigation; reserve authorized teardown time and report cleanup residue.
5. Report scope/environment, commands or actions, exact results, retries, real/mocked boundaries, material findings, and gaps. Link evidence rather than dumping logs. Authored tests, builds, and lower-level passes do not establish E2E success.

## Load selectively

For an existing smoke run with known setup, this file is sufficient. Open references only for the current decision or risk; do not preload the library or reread unchanged material. The skill's README is optional during execution. Scale notes and reports to the task; avoid duplicate test documents.

| Need | Reference |
|---|---|
| Journey selection, roles, negative paths | [Scope/design](references/scope-and-design.md) |
| Setup, credentials, isolation, cleanup | [Environment/data](references/environment-and-data.md) |
| Interactive browser verification | [Browser execution](references/browser-execution.md) |
| Screens, navigation, visual comparisons | [Frontend](references/frontend-checks.md) |
| Forms, validation, async races | [Forms/state](references/frontend-forms-and-state.md) |
| Responsive, touch, keyboard, accessibility | [Accessibility/responsive](references/frontend-accessibility-and-responsive.md) |
| Automated tests or CI changes | [Automation](references/automation.md) |
| Failure, timeout, flaky diagnosis | [Diagnosis](references/failure-diagnosis.md) |
| Complex results or acceptance readiness | [Reporting](references/evidence-and-reporting.md) |

## Essential boundaries

- Use owned data and existing authorization; testing does not authorize production charges, messages, or others' data changes. Protect secrets in evidence.
- After a mutation timeout, reconcile committed state before resubmitting; stop when retry safety is unknown. Read diagnosis for recovery.
- Keep failed, blocked, skipped, pending-spec, and flaky results visible. Never weaken assertions or turn missing evidence into a pass.
