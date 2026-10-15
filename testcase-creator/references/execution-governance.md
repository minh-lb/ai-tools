# E2E Case Governance, Reproducibility, and Execution

Keep deterministic E2E case design separate from each execution result. A case may be approved and still not run; a blocked run is not a failure. Exploratory charters are separate from pass/fail cases.

## Design readiness and execution

- **Design status:** `draft` → `review` → `approved`; `retired` when no longer applicable. Feature-level status is not execution outcome.
- **Readiness:** `ready` only when the approved journey/source, setup/data, reproducible user actions, observable oracle, and cleanup/safety are sufficient. `pending-spec` when a required user outcome or contract needs confirmation. `blocked` when environment, permissions, data, or tooling prevent a valid run. `N/A` requires an evidence-based reason.
- **Execution result:** record separately per run: `not-run`, `passed`, `failed`, `blocked`, `not-applicable`, or `inconclusive`. A failed run means observed behavior diverged from an approved expected outcome, not merely that a requirement is unresolved.
- **Exploratory charter:** it has an observation goal, not a pass/fail oracle. When run, record timebox, environment, observations, anomalies, evidence, and follow-ups in separate exploratory run notes; never label it passed/failed. Promote findings to defects or deterministic cases with approved oracles.

## Reproducibility and safety

Capture only what is needed to repeat the journey: application/build, environment, browser/device/OS, locale/timezone, feature flags, test account/role/tenant, starting state and data, dependencies/stubs, and preconditions. Separate preconditions from concrete test data. Avoid secrets and real personal data; use approved synthetic or masked data. Include numbered sign-in actions when authentication is in scope; otherwise state that the test starts with an authenticated session. Never store credentials in the testcase. Define cleanup/reset or state why data is retained.

For destructive, financial, notification, external webhook, bulk, load, security, or fault-injection scenarios, state authorization, isolation, impact limits, and cleanup before execution; never target production without explicit approval. Use backend read-only assertions only when necessary for an approved E2E outcome. A security-sensitive direct API check belongs in an authorized API/security suite, not an E2E case.

## Execution record

For each deterministic run, link to the feature ID or suite path plus its short local E2E case ID. Capture run ID/date, tester, build/environment, result, actual result, evidence location (screenshots, trace, request IDs/logs with secrets redacted), defect ID for failures, and notes. Record charter sessions separately without pass/fail status. Preserve evidence according to project retention/privacy rules. On failure, isolate the smallest triggering journey; do not silently edit the oracle to match implementation. Change expected behavior only after the requirement owner confirms it, then retain history.

## Types and layers

Tag an E2E case as applicable: functional, validation, accessibility/usability, compatibility, localization, regression, or a specified NFR. The test level is end-to-end. Pair each deterministic case with its linked Playwright test per the skill output contract. Link component/unit, API/contract, authorization-bypass, database-invariant, and security-probe cases to their dedicated suites rather than duplicating them here.
