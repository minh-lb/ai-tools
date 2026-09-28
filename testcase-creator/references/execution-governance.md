# Test Case Governance, Reproducibility, and Execution

Keep a test case definition separate from each execution result. A case may be approved and still not run; a blocked run is not a failure, and a pending-spec case has no valid expected result yet.

## Test case lifecycle

- **Design status:** `draft` → `review` → `approved`; `retired` when no longer applicable. Feature-level status is not execution outcome.
- **Readiness:** `ready` only when requirement/source, setup/data, reproducible steps, oracle, and cleanup/safety are sufficient. `pending-spec` when a business rule, contract, threshold, or oracle needs confirmation. `blocked` when environment, permission, data, or tooling prevents a valid run. `N/A` requires a reason and evidence.
- **Execution result:** record separately per run: `not-run`, `passed`, `failed`, `blocked`, `not-applicable`, or `inconclusive`. Never mark `pending-spec` as failed/passed. A failed run means observed behavior diverged from an approved expected result, not merely that a requirement is unresolved.

## Reproducibility and safety

For each case, capture only what is needed to repeat it: application/build and API version, environment, browser/device/OS or runtime, locale/timezone, feature flags/configuration, test account/role/tenant, data IDs and starting state, dependencies/stubs, and preconditions. Avoid secrets and real personal data; use approved synthetic or masked data. Give numbered steps, explicit inputs, and observable oracle. Define cleanup/reset or state why data is retained. For destructive, financial, notification, external webhook, bulk, load, security, or fault-injection cases, state authorization, isolation, impact limits, and cleanup before execution; never target production without explicit approval.

## Execution record (separate from the test definition)

Link each run to the stable testcase ID and capture run ID/date, tester, build/environment, result, actual result, evidence location (logs/screenshots/trace/request IDs with secrets redacted), defect ID for failures, and notes. Preserve evidence sufficiently for review, but follow project retention/privacy rules. On a failure, reproduce and isolate the smallest triggering condition; do not silently edit the expected result to match current behavior. Change expected behavior only after the requirement owner confirms it, then retain history.

## Types and layers

Tag cases as applicable: functional, validation, UI/usability/accessibility, API/contract, integration, system, regression, security, performance/load, reliability/recovery, compatibility, localization, data migration, operational/observability. Identify the test level (component/unit, API/service, integration, end-to-end) and automation suitability. Do not imply manual UI observations prove server security or that mocked integration proves a real dependency works.
