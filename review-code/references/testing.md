# Testing

## Focus

Review whether the change has enough automated verification to catch regressions in critical behavior, failure paths, and integration boundaries.

## Inspect

- Unit coverage for new logic and invariants
- Integration coverage for persistence, queues, and external services
- Contract tests for public APIs, events, and schemas
- Regression tests for known or likely failure modes
- Negative-path, timeout, retry, and partial-failure tests
- Determinism, fixture quality, and environment assumptions

## Review Questions

- What important behavior changed, and where is it verified?
- Does the test suite cover both the happy path and the failure path?
- Are there missing tests for rollback, retries, null inputs, empty states, and duplicate events?
- Can the tests pass while the real production integration is still broken?
- Are the tests stable, isolated, and meaningful rather than just increasing line coverage?

## Red Flags

- Risky behavior change with no new or updated tests
- Assertions that only check status codes, not state changes or side effects
- Mock-heavy tests that do not verify real integration boundaries
- Missing regression test for a bug the change claims to fix
- Time-based, order-based, or async tests with hidden flakiness
- Contract change without snapshot, schema, or consumer-facing test coverage

## Evidence

A testing finding should explain:

- What behavior needs verification
- Why current tests do not cover it adequately
- What kind of defect can slip through as a result

## Remediation Direction

- Add focused regression tests for the specific risky path
- Add integration or contract tests where mocks hide real failure modes
- Verify state changes, emitted events, and side effects, not only return codes
- Make nondeterministic tests explicit and controlled
