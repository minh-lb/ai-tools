# Functional Requirements and Business Rules

## Standard wording

- `FR-001`: When **[actor/trigger]** and **[condition]**, the system **MUST [behavior]**, producing **[observable result]**.
- `BR-001`: Only when **[business condition]** is **[action/state]** allowed.
- `BR-002`: If **[prohibited case]**, the system **MUST [error]** and **MUST NOT [side effect]**.

Split rules when their conditions or outcomes need independent testing. State precedence when multiple rules may apply at once.

## Use a decision table for multiple conditions

| Authenticated | Owner | Status=PENDING | Expected |
|---|---|---|---|
| No | N/A | N/A | 401, no mutation |
| Yes | No | N/A | 403, no mutation |
| Yes | Yes | Yes | Allow cancellation |
| Yes | Yes | No | 409, no mutation |

**Fictional example only:** status codes/permissions must follow a known contract; do not apply this table to a real project by default.

## Commonly missed cases

- Empty input, wrong type/format, missing permission.
- Invalid state, repeated operation, duplicate message/request.
- Dependency failure and data state after failure.
- Concurrent modification/races when state, inventory, or balances change.
- Time zones, rounding, and priority when a calculation depends on them.

Do not add behavior merely for "complete coverage"; record undecided cases as `Open Questions`.
