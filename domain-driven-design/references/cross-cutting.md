# Cross-Cutting Concerns

## Module boundaries

- Keep each module's domain rules and persistence owned by that module.
- Do not reach into another module's private repository or data model. Prefer a published contract. Use a domain event for decoupled side effects; use an explicit synchronous application/API contract when the use case requires a response and the project permits it.
- Follow the project's actual import and dependency rules; the example `Modules/{Module}` layout is not mandatory.

## Event flow and idempotency

A common flow is: entry point → application coordination → domain behavior/persistence → durable event publication → consumer → receiving application flow. A domain event publish is not a synchronous call into its consumer. Trace each async consumer as a separate path.

For each consumer, establish delivery semantics, stable event identity, side effects, and recovery behavior:

- Duplicate deliveries are normal with at-least-once transports. If processing is naturally idempotent, document the invariant and test it.
- If a non-idempotent effect needs deduplication, use a stable event or operation ID and enforce it at the durable side-effect boundary.
- Do not write a permanent “processed” cache marker before processing and then skip all redeliveries: if work fails after the marker, a retry may be lost.
- When the durable effect and inbox/processed record share a database, use an atomic transaction/unique constraint or the repository's proven equivalent. For external effects, use the provider's idempotency support, outbox/inbox, or reconciliation; a local transaction cannot make a remote side effect atomic.
- Define retry, lease/claim expiration, and dead-letter behavior from the actual transport/project policy. Avoid arbitrary cache TTLs and do not claim exactly-once delivery without evidence.

## Template notes

The event templates are skeletons only. Event IDs must remain stable across serialization, retries, and redelivery; do not generate a fresh ID when reconstructing the same logical event. Choose transaction timing, publication mechanism, consumer state, and error policy from the target system.

## Anti-patterns to avoid

- Domain rules hidden in controllers, ORM callbacks, or transport handlers.
- Cross-module access to another module's private persistence model.
- Repository implementations that omit real persisted fields.
- A message acknowledged before durable completion without safe recovery.
- A deduplication marker that suppresses retries after failed processing.
- Publishing an event before the required state is durably committed, unless the contract explicitly permits it.
