# Decide When an Implementation Plan Is Needed

> **Default:** do not create a Plan file just because a coding task is underway. Classify scope and risk first; for a simple task, implement and verify directly. Distinguish **internal reasoning/planning** from **creating a Plan document**.

## Decision process (top to bottom)

1. **Explicit request:** If the user asks to write/export/create a Plan file, create one within the requested scope, even for a small task. If the user says **not** to create a Plan, do not create one. Follow authoritative repository/project instructions when they do not conflict with higher-priority instructions.
2. **No Plan request:** after inspecting the necessary context/code, assess impact, risk, and dependencies. Do not decide from the task title alone.
3. **Small, low-risk task:** make the change, run appropriate checks, and briefly report the result. **Do not create a Plan file or ask the user to approve a Plan.**
4. **Medium task:** use a short checklist *during the work or in the response* if helpful; **do not create** `plan.md` automatically.
5. **Complex/high-risk task:** establish sequence and verification/recovery before changes. Create a **Plan file** only when requested, required by the repository/project, or when the assigned deliverable is itself a planning document. Without authorization/instructions to create a file, keep it to necessary analysis or discussion; do not add a deliverable.
6. **During implementation:** reassess if scope or risk grows. A task that looked small at first still requires appropriate verification and risk communication.

## Practical classification

| Level | Typical signals | Default approach (when no Plan was requested) |
|---|---|---|
| **Small / simple** | Typo, error message, isolated condition, small test; typically 1–2 local files; no contract/schema change or migration; clear verification | **No Specification or Plan file.** Make the change and run appropriate checks |
| **Medium** | Several related components, dependent steps, but no significant rollout risk | Sketch a short checklist if helpful; no Plan file by default |
| **Large / high risk** | Multiple modules/services, public API/schema/data changes, migration, auth/permissions, concurrency, backwards compatibility, production rollout, multiple phases, or risk of data loss | Establish sequence, verification, and recovery first; **create a Plan file only when requested or required** |

These signals are **heuristics**, not hard thresholds: changing permissions in one file can be high risk; a mechanical rename across many files can be low risk. Focus on **blast radius**, data, and consequences—not file count alone.

## A bug-fix Specification is different from an Implementation Plan

- A bug may need behavior alignment independently of a Plan. If a Spec is requested, write a brief bug-fix Spec defining **WHAT**, the cause (verified or explicitly unknown), and acceptance criteria. If only a fix is requested but material behavior/scope/contract conditions are unclear, ask the blocking question or state a concise conditional baseline inline; do not add a Spec file unless requested or required by project policy.
- For a small, local bug with clear desired behavior and direct verification, do not create a Spec or Plan file by default; fix and test appropriately.
- A bug-fix Spec should describe the cause, but it does not automatically replace a full RCA or prescribe implementation. State a cause only when supported by evidence; create an Implementation Plan only when requested or required by the repository/project.

## Important boundaries

- Do **not** equate "the task needs implementation steps" with "the task needs an exported Implementation Plan file."
- Do **not** add a full Specification before fixing a small bug unless requested or required by project policy. Settle unclear business rules with focused clarification rather than an unrequested file.
- If the user only asks to **fix a bug**, the default deliverable is the requested code/change and suitable verification evidence, **not** a Specification plus Plan.
- If the user asks for a **Specification + Plan**, provide both in that order; do not omit the Plan because the task is small. You may offer a shorter Plan if the user permits it.
- If the user asks only for a **Plan**, write only the Plan; do not implement code or create a full Specification automatically.
- If the user asks to **print only section X** or requests no explanation, do not add a task-size assessment or rationale for omitting a Plan.

## Decision examples

- "Fix the incorrect validation message on the login screen"; local change, no contract change, clear test → **fix directly; no Plan file**.
- "Fix the index bug in this calculation and add a unit test" → **no Plan file** unless inspection reveals broader impact.
- "Migrate the order schema across services and deploy with no downtime" → **plan implementation, migration, verification, and recovery first**; create a Plan file when requested/required.
- "Create an Implementation Plan for this typo fix" → **create a Plan** because the user explicitly requested it (keep it concise).

See the [workflow](workflow.md) and [task breakdown](task-breakdown.md) once a Plan is needed, plus the [No Plan Required example](../../examples/plan/no-plan-required.en.md).
