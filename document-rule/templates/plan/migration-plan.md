# <Migration> — Implementation & Rollout Plan

> **Status:** Proposed | **Baseline:** <Spec/ADR> | **Environment:** <must be identified before execution>

## Outcome & Compatibility Contract

<Desired schema/data behavior; readers/writers that must coexist.>

## Preconditions & Risks

- Existing schema/version: <verified or unknown>
- Data volume/backup/recovery point: <if known>
- Old/new application compatibility: <need to verify>
- Stop criteria: <measurable>

## Ordered Phases

### Phase 1 — Inspect & validate

1. <Schema/dependency checks> → **Verify:** <...>

### Phase 2 — Expand safely

1. <Non-breaking schema/data change> → **Verify:** <...>

### Phase 3 — Application rollout & backfill (nếu cần)

1. <Deploy and incremental backfill> → **Verify:** <...>

### Phase 4 — Contract old behavior (chỉ sau khi verified)

1. <Remove deprecated dependency> → **Verify:** <...>

## Test / Rollout / Stop / Recovery

- Test scenarios and expected results: <...>
- Monitoring/checks: <...>
- Abort trigger: <...>
- Recovery path: <avoid claiming DOWN migration restores data>

## Definition of Done

- [ ] Compatibility verified for affected versions.
- [ ] Data validation and migration checks executed.
- [ ] Post-deploy monitoring and recovery evidence recorded.
