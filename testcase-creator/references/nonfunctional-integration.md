# NFRs and Integration — Selection Guide

These are prompts for finding applicable requirements, not a default acceptance checklist. Select only quality attributes supported by the product scope, architecture, and approved sources. Do not invent numeric thresholds, support matrices, security mechanisms, or operational policies. If the owner/source has not defined a required oracle, record a `pending-spec` question instead of turning an example into a testcase.

| Group | Questions and test direction |
| --- | --- |
| Performance | Find approved FE and API latency/throughput objectives, percentiles, workload, dataset, measurement window, and environment. Measure screen interaction and service/API latency separately. If a required threshold or workload is missing, mark it `pending-spec`; do not assume a generic response-time or user-count target. |
| Reliability and recovery | Identify availability/failover requirements, backup and restore policy, data integrity guarantees, recovery objectives, and supported degraded modes. Test only specified behavior; ask for the owner, target, and recovery evidence when absent. Do not assume failover is automatic or infer backup cadence/RPO/RTO. |
| Security and privacy | Derive cases from the system's authentication/session model, authorization and threat model, data classification, transport/storage controls, and approved security requirements. Check applicable CSRF/XSS, secrets, privacy, and audit concerns; do not assume a particular login method, token/session lifetime, cryptographic mechanism, or control applies to every feature. |
| Operations | Identify required telemetry, alert conditions/owners, log fields and retention policy, maintenance behavior, release validation, and rollback expectations. Verify policy-defined behavior; do not invent retention durations, alert thresholds, or monitoring tools. |
| Compatibility | Use the product's approved browser, OS, device, client, API/schema, and locale support matrix. Do not assume “latest” versions or that desktop/tablet/mobile/native clients are supported. Mark unsupported variants N/A only with an authoritative reason. |
| Usability and accessibility | Apply the product's accessibility, input-method, viewport, localization, and usability requirements to supported clients. Use approved design versions and measurable criteria; do not infer device matrices, zoom thresholds, contrast criteria, or supported languages when unspecified. |

## Integration flows

For in-scope cross-layer behavior, select the smallest end-to-end flows that prove important business outcomes and side effects. Examples of paths to consider include registration→login, create→list/read-back, form→API→DB/cache/queue→UI, failure→rollback/recovery, permission changes during a flow, and retry after a lost response. Examples are prompts, not assumed product behavior. Name participating components/contracts, assert the approved outcome at each relevant layer, and link shared cases rather than duplicating them.

For complex flows, model state transitions and test valid, invalid, and recovery paths. Distinguish UI observations from API/data assertions. An unresolved expected result remains `pending-spec`.

## Common open questions

Ask only the questions relevant to the feature: What are the approved service/UI SLOs and workload? Which recovery guarantees and backup policy apply? Which authentication/security controls are in use? What data retention and alerting policies apply? Which clients, browsers, devices, locales, and versions are supported? Who owns each decision? Never substitute a generic checklist value for an answer.
