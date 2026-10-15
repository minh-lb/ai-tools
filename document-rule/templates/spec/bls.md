# <Business Capability> — Business Logic Specification

> **ID:** <BLS-ID> | **Scope/source:** <verified or requested>

## Objective & Vocabulary

<Business outcome, actor, entities, definitions.>

## Inputs & Preconditions

- Actor/trigger: <...>
- Inputs: <validation>
- Authorization/state: <...>

## Business Rules

| ID | Condition | Required action | Error / no-op behavior |
|---|---|---|---|
| BR-001 | <...> | <...> | <...> |

## Decision Table (nếu có nhiều nhánh)

| Rule priority | Conditions | Decision | Side effect |
|---|---|---|---|
| 1 | <...> | <...> | <...> |

## State Transitions (nếu có trạng thái)

| From | Trigger | To | Guard / invariant |
|---|---|---|---|
| <state> | <...> | <state> | <...> |

## Success & Failure Flows

1. <business step / state decision>
2. <mutation/response>

## Data Effects / Events (nếu có)

<Changed fields, unchanged fields, event triggers, duplicate/retry semantics if known.>

## Acceptance Criteria

| ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | BR-001 | <...> |

## Unknowns (nếu còn)

- <decision needed + impact>
