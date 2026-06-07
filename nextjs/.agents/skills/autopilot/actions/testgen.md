# Testgen Action

## Prerequisites

- Target production code must exist and be stable (no parallel edits in progress).
- A test runner must be configured (Vitest, Jest, etc.) or be ready to configure.

## Steps

1. Inspect target code and existing tests.
2. If the active spec contains `Test Cases`, extract scenarios and priorities first (execute P0/P1 before P2).
3. Identify behavior: inputs, outputs, side effects, failure modes, edge cases.
4. Prioritize tests by business/regression risk, not coverage percentage.
5. Write clear behavior-oriented tests using the repo's existing test runner; use Vitest when configuring a new test harness. Avoid implementation-detail assertions and over-mocking.
6. For frontend code, prefer tests around actions, transforms, hooks, validation, routing contracts, and user-visible behavior. Add component render tests only when an existing harness supports them and the behavior risk justifies it.
7. Run `npm run lint` when configured; fix violations before running tests.
8. Run `npm run typecheck` when configured; otherwise run `tsc --noEmit` when TypeScript is configured. Fix errors before running tests.
9. Run new tests first, then related/full suite when reasonable.
10. Summarize tests added, mapped test cases covered, and remaining gaps.
