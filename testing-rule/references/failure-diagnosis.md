# Failure diagnosis

## Preserve before retrying

Capture the first failing step, assertion, expected/actual state, runner output, and relevant trace/screenshot/logs. Note the journey ID, environment, revision, data identity, timestamp/timezone, worker, and attempt when available. Redact secrets.

Classify using evidence:

| Finding | Classification and next action |
|---|---|
| Behavior contradicts an approved expected result | Product defect; provide minimal reproduction and impact. |
| Locator, fixture, setup, or assertion is wrong | Test defect; correct it without weakening the intended oracle. |
| Service unavailable, wrong deployment, missing account/tool, or unsafe required action | Environment/permission blocker; identify the missing prerequisite. |
| Essential expected behavior is unspecified | Requirement gap (`pending-spec`); record observations and resolve the oracle. |
| Cause cannot yet be established | Unresolved failure; state the evidence and next discriminating check. |

Do not blame infrastructure merely because the failure is intermittent.

## Investigate with a hypothesis

Compare expected and actual state at the failed boundary. Inspect only relevant logs, network requests, selectors, data, and service health. Check common causes: stale authentication, wrong target, shared fixtures, eventual consistency, asynchronous race, timezone assumptions, and external dependency failure.

Change one factor at a time. Reproduce the original case with the same inputs when safe. A bounded rerun can test a hypothesis; repeated blind retries destroy useful evidence and can duplicate side effects.

If attempt one fails and a retry passes, report the attempt history as flaky/intermittent. A retry does not erase a failure. Follow existing CI policy for the runner's final status while separately exposing instability.

## Fix and verify within scope

If fixes are authorized, fix the cause and rerun the original failing journey plus relevant adjacent checks. Add a regression assertion for the observed defect when appropriate. A longer timeout requires evidence that the operation legitimately takes longer; a weaker assertion requires an approved contract change.

If asked only to test, report defects and reproduction steps without silently changing product behavior. Keep cleanup failures and test pollution visible. Stop the affected run if continuing risks additional unauthorized or harmful side effects; unaffected safe checks may continue.
