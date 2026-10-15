---
id: d6fde655-a8da-4959-9c4d-671fe47c5214
title: Add `cancelledAt` — Migration Plan (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, migration, en]
---
# Add `cancelledAt` — Migration Plan (Fictional Example)

> **Document status: `draft`.** The assumption that the system lacks `cancelledAt` has not been verified; schema/version/data volume are unknown.
>
> **Execution gate:** this is an outline, not an execution-ready migration. Do not run MIG-02–MIG-04 until MIG-01 verifies the actual schema/tooling/versions and this Plan is updated with concrete migration steps, compatibility checks, commands, and recovery evidence. Obtain any approval required by the project workflow.

## Goal and Safety Contract

**Goal (conditional on inspection):** If MIG-01 confirms `cancelledAt` is absent, add it as a nullable field and persist a server-generated timestamp for every successful cancellation while old and new application versions remain compatible during rollout. Success is observable when old/new readers pass the verified compatibility checks and a successful cancellation persists one valid timestamp; otherwise revise or stop the Plan.

**Safety contract:** Keep the migration additive while old application versions are active. Do not tighten constraints or remove the old path until compatibility, data validation, and recovery are verified.

## Preconditions

- Inspect database migration conventions and current order status/enum.
- Verify nullability, backwards compatibility, and data recovery plans.
- **CAUTION:** do not assume a down migration restores deleted timestamps.

## Phases

### MIG-01 — Inspect

1. Inspect schema, migration tooling, and order read/write code.  
   **Verify:** record verified dependency paths, current schema/version/data facts, migration tooling, compatibility constraints, and recovery options; update later phases with repository-specific actions and checks. **Planned**.

### MIG-02 — Expand

1. Add a nullable column compatible with the old application, if the contract permits it.  
   **Verify:** schema check in staging and reads/writes from old/new readers. **Planned**.

### MIG-03 — Roll out code

1. Deploy a writer that uses `cancelledAt` according to the [cancel-order Specification](../spec/order-cancellation-spec.en.md).\
   **Verify:** integration tests and runtime error checks. **Planned**.

### MIG-04 — Cleanup (optional)

1. Tighten constraints/remove the old path only after data and compatibility are verified.  
   **Verify:** backfill/completeness checks if required.

## Stop and Recovery

Stop rollout if old-version reads or state updates fail; keep the schema additive and return the application to a compatible version if that recovery has been verified. Do not delete the new column as a "rollback" that could lose data.

## Done

- [ ] Schema compatibility was checked in practice.
- [ ] Data validation has evidence.
- [ ] Stop/recovery procedures were confirmed before production.
