# Behavior Flows, State Transitions, and Error Handling

## Flows

- **Trigger → Authorization → Validation → Business decision → Mutation/side effects → Response** is a checklist, not a mandatory order for every system.
- State **what happens** at each step; do not prescribe code-level details unless a technical design is requested.
- Link steps to `FR-*`/`BR-*`; do not define two different versions of the same rule.

## State machines

When states exist, describe allowed and prohibited transitions, who may perform them, associated data changes, and invariants that must hold.

| Current | Trigger | Next | Condition |
|---|---|---|---|
| PENDING | cancel | CANCELLED | owner + authenticated |
| SHIPPED | cancel | unchanged | rejected |

This table is illustrative. If actual states are unknown, **do not invent an enumeration**.

## Errors and side effects

For each important error, state: condition → observable response/error → whether state/database/event changes. Specify retryability only **when there is a contract**. Define error precedence when one request may match multiple error branches and their order could affect information disclosure.

## Concurrency / idempotency

Specify the desired property (for example, "at most one transition succeeds") instead of prematurely requiring a technical mechanism such as locking/transactions. Mechanisms belong in an Implementation Plan or Design.
