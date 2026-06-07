# Refactor Action

## Prerequisites

- Existing code must be in a stable, passing state (lint + typecheck + build + tests green). If failing, fix first.
- The scope must be structure/quality improvements only — no new behavior.

## Steps

1. Identify current behavior, public contracts, and coverage.
2. Run existing related tests when a test runner is configured plus `npm run lint` (when configured), `npm run typecheck` (when configured), and `npm run build` as baseline. If already failing, stop and report.
3. Plan a small behavior-preserving change; ask before broad refactors.
4. If the refactor touches user-facing UI, apply `frontend-coding-rules`, `docs/design.md`, `docs/design-extended.md` (only when needed), and `docs/visual-acceptance.md` when present so structure changes do not drift from the product's visual contract, follow `UI.DESIGN_SOURCE_PRECEDENCE`, verify required viewports/states, and keep accessibility/responsive rules intact.
5. Apply incrementally without unrelated formatting churn.
6. Run existing related tests when a test runner is configured to verify no behavior change.
7. Run `npm run lint` when configured; fix violations before proceeding.
8. Run `npm run typecheck` when configured; otherwise run `tsc --noEmit` when TypeScript is configured.
9. Run `npm run build` and report behavior change as `none` unless explicitly requested. For user-facing UI refactors, include `Visual Acceptance`.
