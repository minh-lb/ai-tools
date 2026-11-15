# Data Consistency and Tenant Boundaries

Apply selectively when handling writes, identity/tenant isolation, concurrency, or durable side effects. Use the existing database and queue contracts.

## Trusted ownership

- In a multi-tenant system, derive tenant/organization identity from authenticated server-side context, not a client-editable field. Define which aggregate owns each record.
- Apply tenant constraints to reads, writes, existence checks, relationship lookups, deletes, and uniqueness. Bare `findOrFail($id)` and `updateOrCreate(['id' => $id], ...)` are not sufficient tenant isolation.
- When an owner moves tenants or shares resources, use explicit approved transitions and authorization. Preserve cross-tenant denial semantics without leaking existence where required.
- Do not add tenant columns/scopes to single-tenant projects without an approved need.

## Concurrent commands

- State the race: two actors may read the same state and both attempt an update. Choose optimistic version checks, transaction-scoped row locks, uniqueness constraints, or naturally idempotent commands to match that race.
- An optimistic update must condition on expected version (and tenant when relevant), increment version atomically, and detect zero affected rows as a conflict rather than success.
- Database uniqueness constraints, not preflight `exists()` checks alone, should enforce uniqueness under concurrency. Handle constraint errors according to the public contract.
- Keep the transaction as short as practical. Avoid remote I/O inside retried database transactions unless the operation is safely idempotent.

## Durable events and external effects

- Domain event: an internal fact within a model. Integration event: a public compatibility contract with stable event ID, type/version, owner, and required payload; validate at consumption and translate into receiving-domain terms.
- A database commit followed by direct publication has a failure gap. Use a transactional outbox when the state change and event publication must not be lost; implement delivery/retry/cleanup according to the project.
- An inbox/unique consumer key can deduplicate effects that share a database transaction. External provider effects require provider idempotency keys or reconciliation; do not claim exactly-once delivery from at-least-once transport.
- Retryable failures must remain retryable. Define poison-message/dead-letter and redelivery behavior from the queue/provider contract.

## Verification examples

- Two concurrent commands against the same aggregate preserve its invariant; conflicts are visible or safely resolved.
- A tenant cannot fetch, modify, delete, link, or infer another tenant's private aggregate via a guessed ID.
- A failed transaction does not publish a committed integration event; a committed write cannot silently lose a required event under the chosen mechanism.
- Retrying the same event does not repeat a protected side effect; a previously failed attempt can complete on retry.

Skip checks for mechanisms not used by the feature, and clearly report untested database or queue guarantees.
