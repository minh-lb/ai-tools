# Failure diagnosis

## Preserve before retrying

Capture the first failing step, assertion, expected/actual state, runner output, and relevant trace/screenshot/logs. Note the journey ID, environment, revision, data identity, timestamp/timezone, worker, and attempt when available. Redact secrets.

Classify using evidence:

| Finding | Classification and next action |
|---|---|
| Observed result contradicts an approved expected result; cause not yet isolated | Failed check with unresolved cause; validate the oracle, actor, fixtures, target, and assertion before assigning blame. |
| Contradiction persists with valid setup and observation, and evidence isolates product behavior | Product defect; provide minimal reproduction and impact. |
| Locator, fixture, setup, or assertion is wrong | Test defect; correct it without weakening the intended oracle. |
| Service unavailable, wrong deployment, missing account/tool, or unsafe required action | Environment/permission blocker; identify the missing prerequisite. |
| Essential expected behavior is unspecified | Requirement gap (`pending-spec`); record observations and resolve the oracle. |
| Cause cannot yet be established | Unresolved failure; state the evidence and next discriminating check. |

Do not blame infrastructure merely because the failure is intermittent.

## Investigate with a hypothesis

Compare expected and actual state at the failed boundary. Inspect only relevant logs, network requests, selectors, data, and service health. Check common causes: stale authentication, wrong target, shared fixtures, eventual consistency, asynchronous race, timezone assumptions, and external dependency failure.

Change one factor at a time. Reproduce the original case with the same inputs when safe. A bounded rerun can test a hypothesis; repeated blind retries destroy useful evidence and can duplicate side effects.

If a failure is followed by a passing retry with unchanged product, test, and configuration under comparable conditions, report the attempt history as flaky/intermittent; the cause may remain unknown. A retry does not erase a failure. A passing rerun after a deliberate fix is before/after verification, not evidence of flakiness by itself. Record what changed and follow existing CI policy for the runner's final status.

### Mutation with an unknown outcome

A timeout, disconnect, or cancelled browser wait can occur after the server committed. Before another create, payment, send, or other non-idempotent action:

1. Preserve available request/correlation IDs, owned data identifiers, timestamps, and observations.
2. Reconcile through the product's history/status view or an approved read-only service. Without an ID, search the owned test account by the run's unique data and time window; ambiguous matches remain unresolved.
3. Retry only when evidence establishes that no mutation occurred and the original operation cannot still complete, or the product's documented idempotency/recovery mechanism safely handles this exact operation. A new idempotency key may create a second operation.
4. If reconciliation is unavailable or ambiguous, stop the affected mutation and report the unknown outcome and possible cleanup residue. Continue independent safe checks within the budget.

Example: order submission times out and stock falls by one. Neither observation proves that a usable order exists. Inspect the owned account's orders and correlated status before resubmitting; do not create another order to obtain a green test or delete guessed matches.

## Fix and verify within scope

If fixes are authorized, fix the cause and rerun the original failing journey plus relevant adjacent checks. Add a regression assertion for the observed defect when appropriate. A longer timeout requires evidence that the operation legitimately takes longer; a weaker assertion requires an approved contract change.

If asked only to test, report defects and reproduction steps without silently changing product behavior. Keep cleanup failures and test pollution visible. Stop the affected run if continuing risks additional unauthorized or harmful side effects; unaffected safe checks may continue.
