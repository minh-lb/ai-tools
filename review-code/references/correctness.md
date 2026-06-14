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
- **Numeric edge cases**: integer overflow or underflow, floating-point equality comparison, division by zero, rounding accumulation across operations
- **Off-by-one errors**: range bounds, slice indices, pagination offsets, loop termination, fencepost conditions
- **Early return and cleanup**: whether early returns skip required cleanup (resource release, state reset, audit log)
- **Type coercion and implicit conversion**: silent widening, narrowing, truthiness checks that pass for unexpected values (e.g., `0`, `""`, `[]` treated as falsy)
- **Shared-state correctness under concurrency**: whether a logic invariant relies on state that another goroutine, thread, or async task can mutate mid-operation (raise here for logic correctness; raise in [Concurrency](concurrency.md) for the synchronization mechanism)

## Review Questions

- What assumptions does this code make, and what happens when one is false?
- Does every write have a matching state transition or cleanup path?
- Can the code return success while leaving the system partially updated?
- Are boundary cases handled: zero, one, many, empty, null, expired, duplicate?
- Does the change rely on ordering, monotonicity, or uniqueness that is not enforced?
- Can integer arithmetic overflow or lose precision at realistic input values?
- Are range and index calculations correct at the first element, last element, and empty collection?
- Does any early return path skip a required cleanup or state reset?
- Can a type coercion or truthiness check silently pass for a value that should have been rejected?

## Red Flags

- Unchecked return values or swallowed exceptions
- Default branches that silently accept impossible states
- State mutation before validation completes
- Divergence between stored state and emitted side effects
- Use of stale cached values after writes
- Time comparisons that ignore timezone or clock skew assumptions
- Floating-point equality (`==`) used where a tolerance or decimal type is required
- Loop or slice bound that is off by one at the boundary (`<` vs `<=`, `len` vs `len-1`)
- Early return that skips `defer`, `finally`, `close()`, or a required compensating action
- Implicit type coercion that silently accepts `null`, `0`, or `""` as a valid non-empty value
- Logic that assumes an object or collection is not concurrently modified without a guard

## Evidence

A correctness finding should point to:

- The exact scenario or input that breaks behavior
- The code path that allows it
- The resulting incorrect state, output, or user-visible bug

## Remediation Direction

- Add missing guards, invariant checks, or transactional boundaries
- Fail closed instead of silently accepting bad state
- Make success conditional on all required side effects completing
- Use exact numeric types (decimal, big integer) for money, counters, and precision-sensitive values
- Validate bounds before indexing; use exclusive-upper-bound conventions consistently
- Ensure all exit paths (return, throw, break) reach required cleanup or use structured resource management (defer, try-with-resources, using)
- Add explicit type checks or schema validation instead of relying on coercion
- Add regression tests for the broken scenario
