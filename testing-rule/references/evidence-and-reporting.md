# Evidence and reporting

## Keep statuses explicit

Use the project's status convention when present, preserving these distinctions:

| Status | Meaning |
|---|---|
| Passed | Executed actions satisfied known expected outcomes in the stated environment. |
| Failed | An executed check contradicted a known expected outcome; state whether the cause is established. |
| Blocked | A prerequisite, tool, environment, or permission prevented valid execution. |
| Pending-spec | An essential expected outcome has no authoritative oracle. |
| Not run / skipped | No execution evidence; explain why. |

Record flaky/intermittent behavior as an additional finding with the first result and each retry result. Never merge blocked, skipped, pending-spec, or flaky cases into clean passing coverage.

## Compact report contract

Scale the report to the task. Include:

1. **Verdict and scope:** which user goals were verified and material unresolved risks.
2. **Execution context:** target/environment, revision/deployment when known, browser/device or runner, account role, and real/sandboxed/mocked dependencies.
3. **Execution evidence:** exact commands or interactive steps; counts for passed, failed, blocked, skipped, and retries where available. Use runner counts as emitted; do not count attempts as distinct cases.
4. **Findings:** case ID, expected/actual result, reproduction, impact, and evidence link for each material issue. State unknown causes explicitly.
5. **Gaps and next action:** untested criteria, cleanup residue, missing oracle or prerequisite, and the smallest next check or decision.

Do not generate a long test document unless requested or required by the project. Link existing run artifacts instead of copying full logs; ensure they contain no secrets. If no artifact was captured, say what direct observation supports the result.

## Completion gate

Before claiming success, reconcile planned journeys with results. Passing smoke checks establish only their selected scope. Local tests with mocked providers establish only that local configuration. Manual browser checks establish only the inspected session. Unit tests, builds, and file validation cannot substitute for an unexecuted E2E run.

Example verdict: “Local smoke: 3 passed. Checkout failed on the first attempt and passed on retry; instability remains unresolved. Payment used a stub, so provider settlement and production checkout remain unverified.”

When tooling or accounts are unavailable, deliver the runnable work and precise blocker. Do not claim the tests passed because they were authored, statically reviewed, or expected to work.
