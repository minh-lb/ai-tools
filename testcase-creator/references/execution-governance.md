# E2E Test Case Design Governance

Keep deterministic E2E testcase design separate from execution results. Testcase approval does not imply a test has run. An unresolved expected result is a specification gap, not a failure.

## Design readiness

- **Design status:** `draft` → `review` → `approved`; `retired` when no longer applicable. Feature-level status is not execution outcome.
- **Readiness:** `ready` only when the approved journey/source, setup/data, reproducible user actions, observable oracle, and cleanup/safety are sufficient. `pending-spec` when a required user outcome or contract needs confirmation. `blocked` when environment, permissions, data, or tooling prevent a valid run. `N/A` requires an evidence-based reason.

## Reproducibility and safety

Document only what a future tester needs to reproduce the journey: target environment and supported client, browser/device when material, locale/timezone, feature flags, test account/role/tenant, starting state, test data, and preconditions. Avoid secrets and real personal data; use synthetic or masked data. Include numbered sign-in actions when authentication is in scope; otherwise declare the authenticated-session precondition. Define cleanup/reset or state why data is retained.

For destructive, financial, notification, external webhook, bulk, load, security, or fault-injection scenarios, document required authorization, isolation, impact limits, and cleanup. This skill designs cases; it does not perform actions against an environment. Security-sensitive direct API probes belong in dedicated authorized suites.

## Types and layers

Tag an E2E case as applicable: functional, validation, accessibility/usability, compatibility, localization, regression, or specified NFR. The test level is end-to-end. Link component/unit, API/contract, authorization-bypass, database-invariant, and security-probe case documents rather than duplicating their coverage here.
