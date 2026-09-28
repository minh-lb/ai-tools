# Operating Test Suites for Large and Complex Projects

A broad checklist is not proof of project coverage. Apply this guide when the product has many features, teams, services, tenants, integrations, variants, or frequent releases. Preserve **one feature per testcase file**; organize files in the project's agreed domain/module/service hierarchy. Do not make one giant file per service or duplicate shared cross-cutting cases in every feature.

## 1. Build a scope and ownership map

Before drafting cases, inventory:

- Product/domain → capability/feature → user journey/entry point.
- UI clients (web/mobile/admin), BFF/API gateway, service/API boundaries, data stores, queues/jobs, external providers, identity/authorization, and operational controls.
- Which team owns each feature/service, contract, test suite, test data, and unresolved decision.
- Shared requirements and reusable test suites: auth/roles, tenant isolation, audit, notifications, payments, file handling, accessibility, compatibility, performance, recovery.

Use stable IDs for feature, requirement, service/component, and case. Create an index or manifest outside individual feature files when the project has many features; link each feature file from it. Keep feature case IDs stable and never rely on row number or filename alone as a trace key.

## 2. Bound feature files and cross-service flows

A feature file owns behavior and cases for one cohesive user/business capability, with FE and BE sections (or evidence-based N/A). Split a feature when independently owned requirements, actors, lifecycle, or release/testing ownership make one suite hard to review; do not split only to hide a large row count. Record dependencies and links between files.

Place a cross-service journey in the suite of the user-visible/business initiating capability or in an explicitly owned integration suite. The case must name participating services/contracts and assert end-to-end business outcome plus critical intermediate side effects. Service-local suites verify their own contract and failure modes. Link, do not copy, shared cases; identify the canonical owner and how consuming features reference it.

## 3. Portfolio traceability and release coverage

For large scope, maintain a release-level traceability view (a project tool, index, or generated report) with at least:

`Requirement/AC/risk → feature ID → case ID → owning suite/team → design readiness → release/build → execution run → result/evidence/defect`.

Track unlinked requirements, cases without an accepted source, high risks without a case, cases not selected for the release, and blocked/unrun cases. A percentage is meaningful only with a named denominator and scope. Avoid copying run results into case design rows; keep execution records separate and link by stable case ID.

## 4. Dependency and variant matrices

Model only supported, risk-relevant combinations, but make them explicit:

- Service/API contract versions and backward compatibility windows.
- Client/browser/OS/device/locales; tenant plans/configuration; roles and ownership; feature flags/experiments; data schema/migration versions.
- Provider modes (real sandbox, stub, unavailable), queue/message schema versions, retry behavior, and relevant deployment topology (single/multiple instances, region if applicable).

Use pairwise or higher-strength combinations for low-risk independent factors. Force explicit coverage of known interactions, migration/rollback, mixed-version deployments, stale messages, permission × tenant × ownership, and partial failures. Mark unsupported combinations N/A with the authoritative reason; do not silently omit them.

## 5. Test environments and data at scale

Define environment tiers and purpose (local/component, shared integration, staging/pre-release, production monitoring only), ownership, refresh/reset strategy, provider sandboxes, network boundaries, secrets handling, and permitted destructive actions. Document synthetic/masked data creation, referential dependencies, tenant isolation, unique identifiers, cleanup/retention, and parallel-run collision avoidance. Never place real credentials or unnecessary PII in suites or evidence.

For non-deterministic dependencies, specify whether the case uses a contract stub, deterministic simulator, or real sandbox and what that proves. A mocked service test does not prove real integration. Record test limitations and run the smallest safe end-to-end smoke set against integrated environments.

## 6. Change-impact and regression selection

For each release/change, map changed requirements, components/contracts, schemas, flags, dependencies, and operational configuration to affected features and shared suites. Select:

1. Direct functional cases for changed behavior.
2. Contract/consumer cases for changed interfaces and compatible versions.
3. Adjacent/upstream/downstream integration cases and shared security/data invariants.
4. High-risk regression paths (data integrity, permissions, payments, retries, migration, rollback, recovery).
5. A risk-based smoke set for deployment; full regression as required by release policy.

Record why relevant cases were excluded, who accepted residual risk, and the evidence/build for the selected run. Recompute impact when a dependency, schema, feature flag, or deployment topology changes; do not select regression solely by filename or recent failures.

## Worked traceability example (illustrative; replace with real IDs and rules)

A purchase requirement `REQ-42` says an authorized buyer can place an order; API contract `API-ORD-POST-v3` creates one order; payment provider `PAY-SBX` may timeout. Feature suite `checkout.md` owns the initiating journey and FE cases. It links (without copying) to the canonical `authorization.md` tenant-isolation case and `payment-integration.md` provider failure cases. BE cases assert response **and** persisted order/payment/outbox states using approved `BR-18`, `E-7`, and `EC-3`; unresolved timeout semantics stay pending-spec. Release `R-2026.10` records the selected case IDs, build, provider mode, execution run IDs, results, redacted trace IDs, and defects. If the payment client or outbox changes, the impact map selects checkout retry, payment integration, idempotency, and transaction regression. These identifiers and behaviors are examples, not defaults for another project.
