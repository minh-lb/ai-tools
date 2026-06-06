# Concurrency

## Focus

Review whether concurrent execution, retries, async processing, or shared mutable state can produce duplicates, races, lost updates, or ordering bugs.

## Inspect

- Shared state mutation across threads, requests, workers, or nodes
- Read-modify-write sequences and transaction isolation assumptions
- Queue consumers, schedulers, retries, and at-least-once delivery semantics
- Locks, leases, compare-and-swap logic, and deduplication keys
- Ordering assumptions between events, callbacks, and background jobs
- Idempotency of destructive or externally visible operations

## Review Questions

- What happens if the same work is processed twice?
- Can two actors observe the same old state and both write conflicting updates?
- Does retry behavior preserve correctness or multiply side effects?
- Are ordering assumptions enforced, or only hoped for?
- Can failures leave partial work that another worker will misinterpret?

## Red Flags

- Non-idempotent create, charge, send, or delete operations behind retryable paths (if the idempotency gap is primarily an API contract issue — missing idempotency key field, unstable response — see [API](api.md) — raise one combined finding, not two)
- Read-modify-write logic without lock, version check, or transaction protection (if the root fix is a DB-level transaction or constraint rather than application-level coordination, see [Database](database.md) — raise one combined finding, not two)
- Queue consumers that assume exactly-once delivery
- State machines updated by multiple actors without explicit sequencing
- Cache or flag used as a lock without expiration and ownership safeguards
- Background jobs started before the transaction that creates their data commits

## Evidence

A concurrency finding should describe:

- The competing actors or duplicate-delivery scenario
- The missing coordination or idempotency control
- The resulting duplicate work, lost update, inconsistent state, or user-visible error

## Remediation Direction

- Add idempotency keys, deduplication, or uniqueness constraints
- Protect critical updates with transactions, optimistic locking, or explicit leases
- Trigger async work only after durable state is committed
- Make ordering assumptions explicit and validated
