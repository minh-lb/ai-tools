# Implementation Plan Review Checklist

- [ ] Is the baseline Specification/request and version clear?
- [ ] Is the Goal specific and outcome-based: does it identify the target actor/system, desired behavior/state/artifact, key scope or constraint, and observable success signal? Is it traceable to the baseline requirements/ACs rather than only saying “implement/improve X”?
- [ ] If a source fact or decision needed for the Goal is unknown, is the Goal explicitly conditional and the blocker named rather than guessed?
- [ ] Does every task cover the right requirements/acceptance criteria without adding scope?
- [ ] Are inspected sources distinguished from components assumed to need inspection?
- [ ] Is impact analysis broad enough without overstating impact?
- [ ] Can a qualified implementer who did not author the Plan follow each task without guessing, and does each step state a concrete action, expected result, and verification?
- [ ] Are dependencies, blockers, and safe ordering clear?
- [ ] Are success/error/boundary/concurrency tests appropriate to the Specification?
- [ ] Are migration/rollout/compatibility/recovery risks addressed?
- [ ] Is the Definition of Done verifiable, with no item marked `done` before execution?
- [ ] Are file paths, CLI commands, effort, owners, release dates, and test results evidence-based?
- [ ] Does the traceability matrix cover every important requirement?

**Goal check example:** “Implement order cancellation” is too generic. Prefer an outcome such as “Allow an authenticated order owner to cancel only their `PENDING` order, persist the `CANCELLED` state and timestamp, and reject invalid requests without mutation,” then trace it to the baseline IDs and acceptance checks.

**Finding format:** `Severity — Task/section — Missing/contradiction — Impact — Fix`. If repository context is unavailable, state what must be inspected; do not treat its absence as evidence that implementation is correct.
