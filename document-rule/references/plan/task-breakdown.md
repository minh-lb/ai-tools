# Actionable Implementation Tasks

## A good task includes

1. An ID (`IMP-01`) and an outcome.
2. Coverage: related requirement/acceptance-criterion IDs.
3. Prerequisites and dependencies.
4. Concrete, ordered actions (Inspect / Modify / Add / Run / Verify); avoid bundling unrelated goals that are hard to test together.
5. The expected artifact/state after the task.
6. Specific verification and pass/fail conditions.
7. Risk, stop condition, and recovery when an operation is hazardous.

## Decomposition level

- Make each task small enough that another reviewer/agent can continue without inferring business rules.
- Do not split trivial operations into meaningless fragments; group them when they share an outcome and verification.
- Separate discovery from implementation when paths or API conventions are unknown.
- If a dependency is an unresolved decision, state the blocker rather than inventing an implementation.

## Example (fictional)

### IMP-02 — Implement guarded cancellation

- **Covers:** BR-001, BR-002, NFR-001; AC-001, AC-002, AC-004.
- **Depends on:** IMP-01 (inspect order persistence).
- **Actions:** add the `PENDING → CANCELLED` transition and protect the mutation against concurrency.
- **Expected:** invalid requests leave state unchanged; at most one transition succeeds, and a concurrent loser returns the contract's conflict response without mutation.
- **Verification:** state-transition tests and concurrent integration test (**not run**).

Do **not** describe a specific algorithm/path without source evidence. Estimate effort only when requested and supported by evidence.
