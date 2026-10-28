---
id: "<unique-task-id-or-uuid>"
title: "<Feature> — Feature Specification"
type: feature-specification
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Feature> — Feature Specification

> **Document status:** `draft` | **ID:** <SPEC-ID> | **Source:** <ticket/doc/user request>
>
> Remove `<...>` instructions and inapplicable sections before delivery; mark unknowns as `Unknown` with their impact.

## 1. Objective and Scope

- Objective: <observable business/system outcome in plain language; explain essential terms on first use>
- In scope: <behavior>
- Out of scope: <explicit exclusions>

## 2. Actors, Triggers, Preconditions

- Actor: <who>
- Trigger: <event/API>
- Inputs: <names and constraints>
- Preconditions: <permissions/state>

## 3. Requirements

| ID | Condition / Behavior | Result |
|---|---|---|
| FR-001 | When <condition>, system MUST <action> | <observable output> |
| BR-001 | If <invalid case>, system MUST <response> | <no mutation / state> |

## 4. Flows and Exceptions

### Success flow
1. <trigger and validation>
2. <decision/state update>
3. <response/side effect>

### Error / alternative flows
| Condition | Response | State / side effect |
|---|---|---|
| <condition> | <error/status> | <change or no change> |

## 5. Data / API Contract (if relevant)

<Only validated or requested fields, types, error schema, compatibility.>

## 6. NFRs (if supported by evidence)

| ID | Constraint | How to verify |
|---|---|---|
| NFR-001 | <measurable constraint> | <measurement/test> |

## 7. Acceptance Criteria

| AC ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | FR-001 | Given <state>, when <action>, then <result> |

## 8. Decisions / Open Questions (if any)

- <question + consequence>
