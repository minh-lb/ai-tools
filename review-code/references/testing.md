# Testing

## Focus

Review whether the change has enough automated verification to catch regressions in critical behavior, failure paths, and integration boundaries.

## Inspect

- Unit coverage for new logic and invariants
- Integration coverage for persistence, queues, and external services
- End-to-end or smoke coverage for critical cross-boundary workflows, when applicable
- Contract tests for public APIs, events, and schemas
- Regression tests for known or likely failure modes
- Negative-path, timeout, retry, and partial-failure tests
- Load/stress tests for scale-sensitive changes, and property-based/fuzz tests for parsers or complex untrusted-input handling, when warranted
- Coverage change and the repository's configured coverage threshold, when one exists
- Determinism, fixture quality, and environment assumptions
- Execution results or CI status for the relevant test and static-check suites, when available

## Review Questions

- What important behavior changed, and where is it verified?
- Do relevant local or CI checks pass, and are any failures introduced by this change or pre-existing?
- Does the test suite cover both the happy path and the failure path?
- Are there missing tests for rollback, retries, null inputs, empty states, and duplicate events?
- Does the change meet the project's documented coverage target, if coverage is measured and a target is defined?
- Can the tests pass while the real production integration is still broken?
- Do critical workflows have meaningful cross-boundary tests, or are they covered only by unit tests with mocks?
- Are performance-sensitive changes checked at realistic scale, and do parser/input changes have suitable property-based or fuzz coverage where appropriate?
- Are the tests stable, isolated, and meaningful rather than just increasing line coverage?

## Red Flags

- Risky behavior change with no new or updated tests
- Assertions that only check status codes, not state changes or side effects
- Mock-heavy tests that do not verify real integration boundaries
- Missing regression test for a bug the change claims to fix
- Time-based, order-based, or async tests with hidden flakiness
- Contract change without snapshot, schema, or consumer-facing test coverage
- Critical cross-boundary behavior verified only by mocked unit tests when an integration/E2E test is feasible
- Scale-sensitive or parser/security-sensitive changes with no corresponding load or fuzz/property-based check where the risk warrants one

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
