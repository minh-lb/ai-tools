# Spec Action

Create a human-reviewable and agent-usable spec from `$ARGUMENTS`.

## Rules

- If requirement is empty, ask one question: `What do you want to build or fix?`
- Use already-loaded project overview and coding standards; read them only if unavailable in context.
- Infer what is safe from the request and existing context.
- Ask only one clarification at a time, only when ambiguity affects implementation or tests.
- Keep specs concise; include diagrams only when they clarify behavior.
- **Decompose aggressively** (`SPEC.ATOMIC_STEPS`): each step in `Implement Plan` must target exactly one production file. A step may include the paired test file only when it directly verifies that production file.
- **Split on complexity** (`SPEC.SPLIT_THRESHOLD`): use the Epic path if **any** applies: >3 distinct user flows, >1 domain module affected, or estimate >7 implementation steps.
- Test coverage planning must be explicit and detailed (`TEST.BEHAVIOR_FIRST`, `TEST.RISK_PRIORITIZATION`): include happy path, validation failures, authorization boundaries, edge cases, and regression-critical scenarios.

## Steps

1. Inspect only code needed to understand current patterns.
2. Assess complexity against the thresholds above and choose a path.

### Simple path (all thresholds below limit)

3. Write `docs/specs/{kebab-name}.md` using the Spec Template below.
4. Fill `Implement Plan`: atomic steps (one production file each, with direct paired test when needed), dependency order, technical decisions. Fill `Test Plan` with concrete targets and `Test Cases` with detailed scenarios.
5. Update `docs/current-feature.md`: set active spec path and status `Spec Written`.
6. Ask the user to review or run `/autopilot run`.

### Epic path (any threshold exceeded)

3. Write `docs/specs/{kebab-name}-epic.md` using the Epic Template below. List all sub-specs with scope and order.
4. Write each sub-spec as `docs/specs/{kebab-name}/part-{n}-{scope}.md` using the Spec Template below. Sub-specs run sequentially — each must be a complete committable unit. A sub-spec may assume prior sub-specs are merged; it must never assume another sub-spec is in-progress.
5. Update `docs/current-feature.md`: set epic path, fill Sub-spec Queue with statuses, set first sub-spec as `Active`, and set Status to `Spec Written`.
6. Ask the user to review and confirm the sub-spec breakdown before running `/autopilot run`.

## Epic Template

```markdown
# {Name} (Epic)

**Type:** epic

## Overview
{What problem this solves and the intended outcome.}

## Requirement
{Original user requirement, verbatim.}

## Goals
- {Concrete verifiable goal}

## Sub-specs

<!-- Status values: Not Started | Active | Complete -->

| # | File | Scope | Depends On | Status |
|---|------|-------|------------|--------|
| 1 | [part-1-{scope}](./{kebab-name}/part-1-{scope}.md) | {what this part covers} | none | Not Started |
| 2 | [part-2-{scope}](./{kebab-name}/part-2-{scope}.md) | {what this part covers} | part-1 | Not Started |

## Out of Scope
- {Explicit exclusions}

## Status
Not Started
```

## Spec Template

```markdown
# {Name}

**Type:** feature | fix
**Epic:** {link to epic spec | N/A}

## Overview
{What problem this solves and the intended outcome.}

## Requirement
{Original user requirement, verbatim.}

## Goals
- {Concrete verifiable goal}

## Input
| Input | Type | Required | Description |
| --- | --- | --- | --- |
| {name} | {type} | yes/no | {description} |

## Output
- Given {condition}, when {action}, then {expected result}.

## Flow
{Mermaid sequence/flowchart/ER — include only if >2 actors or async steps are involved.}

## Use Cases
- {Actor}: {action and expected outcome}

## Business Rules
- {Validation, authorization, constraints, side effects}

## Implement Plan

<!-- Rule: one production file per step. Include a direct paired test file only when needed. Max ~7 steps — use Epic path if larger. -->

1. {Step}: `{exact/file/path}` — {one-line technical decision}
   - Depends on: {step N | none}
   - Verify: {how to confirm this step is complete}

## Test Plan
- Unit: {Domain behavior}
- Integration: {Application/use case behavior}
- API/Feature: {HTTP or user workflow behavior}

## Test Cases
| ID | Level | Scenario | Preconditions | Steps | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Unit/Integration/API | {What behavior is verified} | {State, permissions, input data} | {Numbered test steps} | {Observable outcome and assertions} | P0/P1/P2 |

<!-- Include both success and failure paths. At minimum cover: happy path, input validation, auth/authz, edge cases, and one regression-risk scenario. -->

## Out of Scope
- {Explicit exclusions}

## Status

<!-- Valid values: Not Started | In Progress | Complete -->
<!-- Do NOT use "Active" here — that is only for sub-spec Queue rows in the epic table. -->

Not Started
```
