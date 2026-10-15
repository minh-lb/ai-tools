# Verification, Rollout, and Recovery

## Plan verification

- Choose **unit** tests for pure logic/rules, **integration** tests for persistence/API/dependencies, and **end-to-end** tests for critical journeys.
- For compatibility changes or data migrations, verify schema/version compatibility, rollback feasibility, and before/after data.
- Include **actual commands** only when verified in the repository. Otherwise describe the check/test to run.
- Pass/fail conditions must be observable signals, not "check that it works reliably."

## Risk-based rollout

1. Preconditions/backup or recovery point when needed.
2. Compatible deployment sequence (expand → code → contract when migrating).
3. Health checks/logs/metrics to observe.
4. Stop/rollback triggers and decision authority when known.
5. Recovery if an operation cannot be reversed automatically.

**CAUTION:** a database down migration does not guarantee restoration of business data. Do not recommend destructive rollback as the default.

## Status and evidence

- `Proposed` = plan not executed.
- `Verified in repository` = source inspected and cited.
- `Executed` = work completed with a log/artifact.
- `Passed` = a test/check result proves it.

Before implementation, write `Verification planned`; do not mark a checklist item `Done` for a command that has not run.
