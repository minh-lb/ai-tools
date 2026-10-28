# Writing an Implementation Plan

**Activation condition:** use this workflow **only after determining that a Plan is needed** under [Plan decision](plan-decision.md). Do not create a Plan file by default for bug fixes/small changes. If the user explicitly requests a Plan, write one even for a small task.

## Inputs / baseline

- Prefer an agreed Specification, acceptance criteria, and code/schema/CI sources that were inspected.
- If no Spec exists and the user **only asks for a Plan**, use a brief `Baseline requirements` section plus open questions; do not create a full Specification document automatically.
- A Plan is a **proposal for work**, not evidence that the work was performed.

## Sequence

1. State a concrete, outcome-based goal and requirement coverage (`FR/BR/NFR/AC` IDs). Name the target actor/system, the specific desired behavior/state/artifact, the key boundary or constraint, and an observable success signal; do not use a generic verb such as “implement” or “improve” without the target outcome. If a source fact or decision is unknown, phrase the goal conditionally and record the blocker instead of inventing it.
   Introduce the goal in plain language; explain essential states/fields beside their identifiers using the baseline's meanings. In paired Spec + Plan, link to definitions already supplied rather than repeating a glossary; a standalone Plan must supply enough context itself.
2. Inspect existing code/architecture/conventions; distinguish `verified` from `to inspect`.
3. Analyze impact across API, domain, persistence, data, auth, testing, deployment, and monitoring when relevant.
4. Resolve decision blockers and dependencies.
5. Break work into tasks in a safe order (inspect → change → verify → release).
6. Map requirements/acceptance criteria to tasks, expected results, and tests; add migration/rollback when risk warrants it.
7. Define measurable completion criteria and explicit execution status.

## Do not assume

Do not invent existing filenames, packages, tables/columns, test commands, staff, timelines, story points, or `Done/Passed` status. If the repository has not been inspected, use `Component to inspect` and `Test command: repository-defined, not yet verified`.

Use the [Feature Plan](../../templates/plan/feature-plan.md) or [Small Change](../../templates/plan/small-change.md) **when a Plan is a requested deliverable**. Do not use the Small Change template to justify creating a Plan file for a simple bug fix without a request.
