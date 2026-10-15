# <Feature> — Feature Specification

> **Status:** Draft | **ID:** <SPEC-ID> | **Source:** <ticket/doc/user request>  
> Xóa các hướng dẫn `<...>` và mục không áp dụng trước khi bàn giao; chưa biết thì ghi `Chưa xác định` kèm tác động.

## 1. Objective & Scope

- Objective: <observable business/system outcome>
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

## 4. Flows & Exceptions

### Success flow
1. <trigger and validation>
2. <decision/state update>
3. <response/side effect>

### Error / alternative flows
| Condition | Response | State / side effect |
|---|---|---|
| <condition> | <error/status> | <change or no change> |

## 5. Data / API Contract (nếu liên quan)

<Only validated or requested fields, types, error schema, compatibility.>

## 6. NFR (nếu có căn cứ)

| ID | Constraint | How to verify |
|---|---|---|
| NFR-001 | <measurable constraint> | <measurement/test> |

## 7. Acceptance Criteria

| AC ID | Covers | Given / When / Then |
|---|---|---|
| AC-001 | FR-001 | Given <state>, When <action>, Then <result> |

## 8. Decisions / Open Questions (nếu còn)

- <question + consequence>
