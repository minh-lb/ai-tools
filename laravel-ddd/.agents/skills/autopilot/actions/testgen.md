# Testgen Action

1. Inspect target code and existing tests.
2. If the active spec contains `Test Cases`, extract scenarios and priorities first (execute P0/P1 before P2).
3. Identify behavior: inputs, outputs, side effects, failure modes, edge cases.
4. Prioritize tests by business/regression risk, not coverage percentage.
5. Write clear behavior-oriented tests; avoid implementation-detail assertions and over-mocking.
6. Run new tests first, then related/full suite when reasonable.
7. Summarize tests added, mapped test cases covered, and remaining gaps.
