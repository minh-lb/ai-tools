---
id: "<unique-task-id-or-uuid>"
title: "<Migration> — Implementation and Rollout Plan"
type: migration-plan
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Migration> — Implementation and Rollout Plan

> **Document status:** `draft` | **Baseline:** <Spec/ADR> | **Environment:** <must be identified before execution>

## Goal

**Outcome:** <State the concrete schema/data end state, affected readers/writers, compatibility boundary, and observable completion signal. If current schema is unknown, make the outcome conditional on inspection and name that blocker. Avoid a generic “add/change a column” goal.>

## Compatibility Contract

<Specify which old/new readers and writers must coexist and the evidence that proves compatibility.>

## Preconditions and Risks

- Existing schema/version: <verified or unknown>
- Data volume/backup/recovery point: <if known>
- Old/new application compatibility: <needs verification>
- Stop criteria: <measurable>

## Ordered Phases

### Phase 1 — Inspect and validate

1. <Schema/dependency checks> → **Verify:** <...>

### Phase 2 — Expand safely

1. <Non-breaking schema/data change> → **Verify:** <...>

### Phase 3 — Application rollout and backfill (if needed)

1. <Deploy and incremental backfill> → **Verify:** <...>

### Phase 4 — Contract old behavior (only after verification)

1. <Remove deprecated dependency> → **Verify:** <...>

## Test / Rollout / Stop / Recovery

- Test scenarios and expected results: <...>
- Monitoring/checks: <...>
- Abort trigger: <...>
- Recovery path: <do not claim a DOWN migration restores data>

## Definition of Done

- [ ] Compatibility was verified for affected versions.
- [ ] Data validation and migration checks were executed.
- [ ] Post-deploy monitoring and recovery evidence were recorded.
