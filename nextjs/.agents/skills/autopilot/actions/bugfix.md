# Bugfix Action

## Prerequisites

- The defect must be reproducible with a clear expected vs actual behavior description.
- Related source files must be readable in the current working tree.

## Steps

1. Capture expected behavior, actual behavior, and reproduction trigger.
2. Inspect only related files and identify the first wrong behavior before editing.
3. Write a regression test that reproduces the bug when a test runner is configured AND the bug is in application logic (not a third-party library, environment config, or CSS). The test should fail before the fix. Skip only when reproduction requires live infrastructure not available locally; document the gap in the summary.
4. If the defect affects user-facing UI, apply `frontend-coding-rules`, `docs/design.md`, `docs/design-extended.md` (only when needed), and `docs/visual-acceptance.md` when present so the fix preserves the product's visual contract, follows `UI.DESIGN_SOURCE_PRECEDENCE`, verifies required viewports/states, and keeps accessibility/responsive rules intact.
5. Apply the smallest root-cause fix; avoid unrelated refactors.
6. Run the regression test and related tests when a test runner is configured. For automated tests, set `EXTERNAL_API=mock` unless the bug requires real/sandbox API validation. Confirm the fix passes.
7. Run `npm run lint` when configured; fix violations before proceeding.
8. Run `npm run typecheck` when configured; otherwise run `tsc --noEmit` when TypeScript is configured.
9. Run `npm run build`. Broaden test scope to the full relevant suite when the suite completes in under 2 minutes and is not known-flaky.
10. Summarize root cause, fix, files, tests, risk, and next step. For user-facing UI fixes, include `Visual Acceptance`.
