# Correctness

## Focus

Review whether the code preserves intended behavior, business invariants, and failure handling across normal flows, edge cases, and partial failures.

## Inspect

- Input normalization, validation, and defaulting
- Branching logic, state transitions, and invariant enforcement
- Null, empty, duplicate, stale, or out-of-order data handling
- Error handling, retry behavior, and rollback behavior
- Time, timezone, unit, currency, rounding, and precision logic
- Cache invalidation and derived-state updates

## Review Questions

- What assumptions does this code make, and what happens when one is false?
- Does every write have a matching state transition or cleanup path?
- Can the code return success while leaving the system partially updated?
- Are boundary cases handled: zero, one, many, empty, null, expired, duplicate?
- Does the change rely on ordering, monotonicity, or uniqueness that is not enforced?

## Red Flags

- Unchecked return values or swallowed exceptions
- Default branches that silently accept impossible states
- State mutation before validation completes
- Divergence between stored state and emitted side effects
- Use of stale cached values after writes
- Time comparisons that ignore timezone or clock skew assumptions

## Evidence

A correctness finding should point to:

- The exact scenario that breaks behavior
- The code path that allows it
- The resulting incorrect state, output, or user-visible bug

## Remediation Direction

- Add missing guards, invariant checks, or transactional boundaries
- Fail closed instead of silently accepting bad state
- Make success conditional on all required side effects completing
- Add regression tests for the broken scenario
