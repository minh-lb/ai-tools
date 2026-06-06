# Severity Model

## Contents

1. Purpose
2. Severity Levels
3. Prioritization Rules
4. What Does Not Merit A Finding

## Purpose

Severity should reflect production risk, not reviewer preference. Use the same severity logic across all checklist dimensions so the report stays consistent.

## Severity Levels

### Critical

Use `Critical` when the change can plausibly cause one of these outcomes if triggered by any user (unauthenticated or authenticated), any valid request, or any normal operational event — not requiring special privileges, a specific network position, or a multi-step exploit chain:

- Authentication or authorization bypass
- Remote code execution or full tenant escape
- Irreversible data corruption or major data loss
- Complete outage of a critical production path
- Secret exposure that materially compromises the environment

If the trigger requires admin privileges, a specific race timing, or a multi-step sequence that must be deliberately constructed, lower to `High` and note the precondition explicitly.

### High

Use `High` when the issue is likely to break an important workflow or create a serious operational or security problem:

- Main user flow fails under realistic conditions
- Migration or rollout can block service or damage data
- Sensitive data may leak to the wrong actor or system
- Retry, locking, or idempotency gaps can duplicate destructive work
- Contract changes can break known consumers

### Medium

Use `Medium` when the issue is meaningful but narrower in blast radius or requires a more specific trigger:

- Incorrect edge-case behavior with real user impact
- Missing test coverage on risky behavior (a red flag in testing review that maps here unless the untested behavior is itself High/Critical risk, in which case inherit that severity)
- Observability gap on a critical path that will slow incident response
- Performance issue likely to matter under expected scale
- Maintainability or architecture problem that materially increases future defect risk

### Low

Use `Low` when the issue is real but has limited impact or low likelihood:

- Minor regression in a non-critical path
- Small operational or diagnostics gap
- Localized maintainability issue with a clear downside

## Prioritization Rules

Adjust severity by considering:

1. Blast radius: one request, one tenant, many tenants, or whole system
2. Likelihood: common path, edge case, or rare operational condition
3. Detectability: obvious failure, silent corruption, or late discovery
4. Recoverability: easy rollback, hard rollback, or irreversible consequence
5. Existing safeguards: tests, feature flags, runtime validation, alerts, or manual gates

If safeguards strongly reduce exposure, mention them and lower confidence or severity where appropriate.

## What Does Not Merit A Finding

Do not raise a formal finding for:

- Pure style preferences without behavioral or maintenance impact
- Personal naming preference when the current name is still clear enough
- Hypothetical concerns with no credible trigger path
- Suggestions that are better framed as optional follow-up than as review blockers
