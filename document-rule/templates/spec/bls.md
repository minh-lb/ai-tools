---
id: "<unique-task-id-or-uuid>"
title: "<Business capability> — Business Logic Specification"
type: business-logic-specification
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Business Capability> — Business Logic Specification

> **ID:** <BLS-ID> | **Scope/source:** <verified or requested>

## Objective and Vocabulary

<Business outcome, actor, entities, definitions.>

## Inputs and Preconditions

- Actor/trigger: <...>
- Inputs: <validation>
- Authorization/state: <...>

## Business Rules

| ID | Condition | Required action | Error / no-op behavior |
|---|---|---|---|
| BR-001 | <...> | <...> | <...> |

## Decision Table (if there are multiple branches)

| Rule priority | Conditions | Decision | Side effect |
|---|---|---|---|
| 1 | <...> | <...> | <...> |

## State Transitions (if states apply)

| From | Trigger | To | Guard / invariant |
|---|---|---|---|
| <state> | <...> | <state> | <...> |

## Success and Failure Flows

1. <business step / state decision>
2. <mutation/response>

## Data Effects / Events (if any)

<Changed fields, unchanged fields, event triggers, duplicate/retry semantics if known.>

## Acceptance Criteria

| ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | BR-001 | <...> |

## Unknowns (if any)

- <decision needed + impact>
