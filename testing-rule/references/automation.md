# Automation

## Fit the repository

Inspect existing tests, supported runner versions, scripts, fixture lifecycle, locator conventions, artifact settings, and CI configuration. Reuse Playwright, Cypress, WebDriver, mobile/desktop drivers, or other tooling already selected by the project. Consult version-matching documentation if an API is uncertain. Add a dependency only when the task requires it and existing tools cannot meet the need.

Implement tests only when requested or necessary for the authorized verification task. Avoid generating a second framework, bespoke harness, or duplicate test case library for a simple run.

## Test structure

- One coherent business outcome per test; name the actor/action/result clearly. Reuse stable case IDs when provided.
- Arrange isolated prerequisites with existing fixtures or supported setup APIs. Perform the behavior under test through the real product boundary.
- Prefer accessible, user-facing locators and scoped stable test IDs. Avoid DOM position, generated CSS classes, or invented selectors.
- Assert the final business outcome and relevant failure invariant. An assertion should fail if the target behavior is broken; checking only presence, status 200, or a mock call often misses it.
- Wait on observable state with runner-supported assertions and bounded timeouts. Avoid fixed sleeps, unbounded polling, and treating generic network idleness as business completion.
- Use controlled project mechanisms for time, random data, and fault injection. Restore overrides after each test.

## Boundaries and mocks

Use real local/test services for the boundaries the run claims to cover. Sandboxes can validate provider interaction within their limits. Controlled stubs are useful for otherwise hard-to-trigger errors, but label them and explain the uncovered integration. Mocking payment approval cannot establish real payment settlement.

Do not stub the feature's core behavior and call the resulting run full E2E. Setup shortcuts are valid only outside the behavior being verified; a reused authenticated state does not test login.

## Execution and CI

Run the smallest relevant selection first, then the required affected suite. Follow existing browser/project matrices, timeouts, and retry policy. Keep tests safe for concurrent workers; reduce concurrency when resources cannot be isolated rather than accepting races.

Record the exact command, selection, target, revision, counts, exit status, retries, and artifact location. Failures must propagate to the runner/CI exit status. Preserve first-attempt failures even when retries succeed. Report skipped/quarantined tests separately; do not disable checks to obtain green output.
