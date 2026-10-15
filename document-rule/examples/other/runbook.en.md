---
id: cca31dee-7154-4dbc-8dad-7158e886bf6c
title: Disable a misbehaving feature flag — Runbook (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, runbook, en]
---
# Disable a Misbehaving Feature Flag — Runbook (Fictional Example)

> **Fictional, non-executable example — not a production procedure.** It intentionally supplies no real flag key, target scope, metric/threshold, dashboard, or control command. Fill the Readiness Gate only from approved system sources; if any required value is missing or unverified, stop and do not execute.

## Trigger and Preconditions

- Trigger: the named feature's error rate exceeds the verified alert threshold for the configured evaluation window.
- Preconditions: confirm the flag can be disabled without data loss; ensure valid permissions and an audit channel.
- **WARNING:** disabling a flag does not restore data already written; if the feature includes a migration, use a separate recovery plan.

## Readiness Gate

Before execution, record and verify all of these from approved sources:

- Feature flag key, environment, and exact target scope: `<verified values>`.
- Error metric, threshold, evaluation window, and dashboard/query: `<verified values>`.
- Approved control-plane/CLI action and required permission: `<verified procedure>`.
- Safe sample request and observable signal that it follows the old code path: `<verified check>`.
- Recovery procedure and responsible on-call contact: `<verified source/contact>`.

If any value is blank, unknown, or unverified, do not execute this example.

## Procedure

1. **Action:** confirm the flag corresponds to the feature and affected scope.  
   **Expected:** the flag-to-behavior mapping is verified.  
   **Verify:** inspect the configuration and approved documentation.
2. **Action:** use only the approved control action recorded in the Readiness Gate to disable the verified flag for the exact target scope.  
   **Expected:** the flag is disabled only for that scope.  
   **Verify:** read the flag state back and run the verified safe sample request; confirm it follows the old code path.
3. **Action:** monitor the named metric on the verified dashboard for one full configured evaluation window.  
   **Expected:** the error rate is below the approved threshold, with no new data-integrity warning.  
   **Verify:** record the dashboard/query result and the audit entry; compare against the verified baseline.

## Completion and Stop / Recovery

Complete only when the flag readback confirms the exact target scope is disabled, the safe request follows the old path, and the monitored error rate stays below the approved threshold for one full evaluation window; record the evidence and audit entry. If the flag or scope cannot be verified, the disable action fails, or the metric does not recover, stop and follow the verified incident/recovery procedure with the named on-call operator. Do not guess a flag/command or re-enable the feature without the responsible operator's approval.
