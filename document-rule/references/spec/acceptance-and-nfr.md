# Specification Acceptance Criteria, NFRs, and Traceability

## Acceptance criteria must be testable

Prefer `Given` initial context/data; `When` a trigger; `Then` an observable outcome plus data/state/side effects.

- Assign `AC-001` and map it to `FR-*`, `BR-*`, and `NFR-*`.
- Cover the happy path, validation, permissions, and invalid states; add race/retry cases when risk warrants it.
- Do not combine variants that are hard to verify in one AC when they need separate tests; one AC may map to multiple requirements when the scenario is genuinely shared.
- Avoid criteria such as "the system works correctly," "the API works well," or "the UI is user-friendly."

## NFRs

- Include performance, availability, security, audit, observability, consistency, and localization **only when requested or supported by evidence**.
- Specify measurement method, environment/load, and threshold **when supplied by the user**; if a threshold is missing, mark it `Unknown` rather than inventing a number.
- Example: `NFR-001: For two cancellation requests on the same PENDING order, at most one operation successfully changes the state.` → verify with concurrent requests.

## Handoff matrix

| Requirement ID | Flow / Contract | Acceptance |
|---|---|---|
| FR-001 | Success flow | AC-001 |
| BR-002 | Error path | AC-002 |
| NFR-001 | Concurrency rule | AC-004 |

Every important requirement needs an acceptance criterion or an explained exception. Do not claim a test passed: acceptance criteria **define what must be verified**; they are not a test report.
