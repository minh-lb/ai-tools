# Automation

## Fit the repository

Inspect existing tests, supported runner versions, scripts, fixture lifecycle, locator conventions, artifact settings, and CI configuration. Reuse Playwright, Cypress, WebDriver, mobile/desktop drivers, or other tooling already selected by the project. Consult version-matching documentation if an API is uncertain. Add a dependency only when the task requires it and existing tools cannot meet the need.

Use this guidance for explicitly requested automated test implementation or for understanding the existing test setup. Avoid generating a second framework, bespoke harness, or duplicate test case library for a simple run.

## Cover the full range of in-scope behavior

1. Before writing tests, map each affected requirement or contract to distinct conditions and expected results. Include applicable valid and invalid inputs, boundaries, roles, reachable states and transitions, dependency failures, timeouts, retries, concurrency, and recovery. For failures, include expected persistence, rollback, and side effects. Use the [test design techniques](../test-design-techniques.md) to derive cases from the behavior model.
2. Assign every condition to an existing or new check that can prove the outcome. Use unit tests for rules, decisions, and state transitions in isolation. Use integration tests for contracts, persistence, transaction atomicity, and dependency behavior at the relevant boundary. Use E2E tests for distinct user journeys and outcomes that depend on the parts working together. If the request limits the test layer, address what it can prove and identify conditions that need another layer.
3. Cover every feasible combination that can change the outcome. Group inputs with the same documented behavior using representative values and test their boundaries. Keep distinct outcomes, known interacting conditions, and high-impact failure cases explicit. Enumerate all combinations when the model is finite and small enough to verify directly.
4. Review the mapping after running tests. Distinguish implemented coverage from cases actually executed and from gaps. Mark an unknown expected result `pending-spec`. Give the reason for each material exclusion or blocker. If required line or branch coverage is measured, report it alongside the mapped behaviors.

## Test structure

- One coherent business outcome per test; name the actor/action/result clearly. Reuse stable case IDs when provided.
- Arrange prerequisites with existing fixtures or supported setup APIs. Keep session and mutable application data independent across cases, workers, and attempts. Verify that the case can run on its own and in the affected suite. Keep setup shortcuts outside the behavior under test.
- Prefer accessible, user-facing locators and scoped stable test IDs. Avoid DOM position, generated CSS classes, or invented selectors.
- Assert the final business outcome and relevant failure invariant. For a regression test, demonstrate that the assertion catches the defect when a safe failing baseline is available. Report when only the fixed build was checked.
- Use retrying queries and assertions to wait for observable state. Keep the action that changes state outside polling or assertion retries. Avoid fixed sleeps, unbounded polling, and using generic network idleness as a signal that the business outcome occurred.
- Use controlled project mechanisms for time, random data, and fault injection. Restore overrides after each test.

## Boundaries and mocks

Use real local/test services for the boundaries the run claims to cover. Sandboxes can validate provider interaction within their limits. Controlled stubs are useful for otherwise hard-to-trigger errors, but label them and explain the uncovered integration. Mocking payment approval cannot establish real payment settlement.

Do not stub the feature's core behavior and call the resulting run full E2E. Setup shortcuts are valid only outside the behavior being verified; a reused authenticated state does not test login.

## Execution and CI

Run the smallest relevant selection first, then the required affected suite. Follow existing browser/project matrices, timeouts, and retry policy. Keep tests safe for concurrent workers; reduce concurrency when resources cannot be isolated rather than accepting races.

Record the exact command, selection, target, revision, counts, exit status, retries, and artifact location. Check that the runner selected and executed the intended cases, especially when a filter or shard returned no tests. Terminal test failures must propagate to the runner/CI exit status. For a failure followed by a successful retry, follow existing CI policy for the final exit status while preserving first-attempt failures and exposing instability. Report skipped/quarantined tests separately.

See [Playwright best practices](https://playwright.dev/docs/best-practices), [Cypress test isolation](https://docs.cypress.io/app/core-concepts/test-isolation), and [Cypress retry-ability](https://docs.cypress.io/app/core-concepts/retry-ability) for runner-specific examples.
