# Testing

## Focus

Review whether the behavior in scope has enough automated verification to catch regressions in critical paths, failure modes, and integration boundaries—whether reviewing a diff or an existing codebase.

## Inspect

- Unit coverage for new logic and invariants
- Integration coverage for persistence, queues, and external services
- End-to-end or smoke coverage for critical cross-boundary workflows, when applicable
- Frontend component/interaction tests for user-visible loading, empty, error, validation, success, and recovery states
- Browser E2E coverage for critical routes, direct navigation, refresh/back-forward, forms, responsive viewports, and realistic API failure/slow-network behavior when feasible
- Keyboard and accessible-name/state checks for changed controls; automated accessibility scans are useful but do not prove conformance
- Contract tests for public APIs, events, and schemas
- Regression tests for known or likely failure modes
- Negative-path, timeout, retry, and partial-failure tests
- Load/stress tests for scale-sensitive changes, and property-based/fuzz tests for parsers or complex untrusted-input handling, when warranted
- Coverage change and the repository's configured coverage threshold, when one exists
- Test validity: whether assertions would fail for the target regression, verify state/side effects rather than only superficial outputs, and avoid false positives
- Determinism, fixture quality, cleanup, and environment assumptions
- Test maintainability and complexity (tests are code that future engineers must understand)
- Execution results or CI status for the relevant test and static-check suites, when available

## Review Questions

- What important behavior changed, and where is it verified?
- Do relevant local or CI checks pass, and are any failures introduced by this change or pre-existing?
- Does the test suite cover both the happy path and the failure path?
- Are there missing tests for rollback, retries, null inputs, empty states, and duplicate events?
- Does the change meet the project's documented coverage target, if coverage is measured and a target is defined?
- Can the tests pass while the real production integration is still broken?
- Do critical workflows have meaningful cross-boundary tests, or are they covered only by unit tests with mocks?
- Do component tests assert user-visible behavior using accessible roles/names or other stable user-facing contracts rather than framework internals and CSS structure?
- Do changed UI journeys cover loading, empty, validation, permission, error, retry, and asynchronous race states that are materially reachable?
- For route/navigation changes, do browser tests cover direct entry, refresh, and history behavior? For responsive changes, are relevant viewports exercised?
- Are keyboard operation and focus transitions tested for custom interactions, and are automated accessibility results supplemented with manual checks where risk warrants?
- Are performance-sensitive changes checked at realistic scale, and do parser/input changes have suitable property-based or fuzz coverage where appropriate?
- Are the tests stable, isolated, and meaningful rather than just increasing line coverage?
- Would each relevant test fail if the reviewed behavior were broken, or could it pass vacuously because the assertion/mock/fixture does not observe the effect?
- Do tests verify important state transitions, persistence, emitted events, and external side effects at the appropriate boundary?
- Are test helpers and fixtures simpler than the behavior they verify, with cleanup that prevents order-dependent or cross-test leakage?

## Red Flags

- Risky behavior change with no new or updated tests
- Assertions that only check status codes, not state changes or side effects
- Tests that pass when the target behavior is broken, assert the wrong condition, or rely on mocks that encode the implementation instead of the contract
- Complex, shared, or order-dependent fixtures that can hide failures or leak state between tests
- Mock-heavy tests that do not verify real integration boundaries
- Missing regression test for a bug the change claims to fix
- Time-based, order-based, or async tests with hidden flakiness
- Contract change without snapshot, schema, or consumer-facing test coverage
- Critical cross-boundary behavior verified only by mocked unit tests when an integration/E2E test is feasible
- UI tests coupled to component internals, CSS selectors, or snapshots only, so a broken user journey can still pass or harmless markup changes make tests brittle
- A critical form, route, dialog, or asynchronous UI state has no component/browser regression test despite realistic failure modes
- Accessibility is declared covered only by an automated scan or test-library role query without keyboard/runtime verification for a custom widget
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
- Prefer queries and assertions based on accessible roles, names, visible text, and observable outcomes; use stable test IDs only where user-facing contracts are insufficient
- Add focused component or browser tests for the state transition and route behavior that could regress; use isolated mocks/stubs for network failures
- Combine automated accessibility checks with keyboard and assistive-technology testing for important or custom interactions
