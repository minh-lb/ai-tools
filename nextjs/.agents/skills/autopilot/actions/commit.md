# Commit Action

## Prerequisites

- Code changes must exist in the working tree. If no changes, inform the user there is nothing to commit.
- `npm run lint` (when configured) must pass. Run before proceeding; stop if failing.
- `npm run typecheck` when configured, or `tsc --noEmit` when TypeScript is present but no `typecheck` script exists, must pass. Stop if failing.
- `npm run build` must pass. Run it before proceeding; stop if failing.
- If an active spec is available, run tests from its `Test Plan` and verify at least all P0/P1 `Test Cases`. Stop if critical cases fail.

## Steps

1. If the commit represents completed spec work, update `docs/current-feature.md` and the active spec status before staging so the state change is included in the commit.
2. Show files to stage and proposed conventional commit message.
3. Ask: `Commit these changes? (yes/no/edit message)`.
4. If rejected (`no`): leave working tree unchanged, note the reason, and stop. Resume by running `/autopilot commit` again when ready.
5. If approved, stage and commit following `COMMIT.APPROVAL`, `COMMIT.SCOPED_STAGE`, `COMMIT.NO_AI_ATTRIBUTION`, and `COMMIT.BUILD_GATE`.
6. Report commit hash and branch.
7. Report which `Test Cases` IDs were verified (especially P0/P1), and list any intentionally deferred cases.
