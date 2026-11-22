# Application Layer

The application layer coordinates a requested use case and the boundaries it needs. Follow the target repository's existing service/action/use-case pattern.

## Possible responsibilities

- Accept a transport-neutral input shape where useful.
- Coordinate load → approved domain transition → save and required side effects. The application layer owns transaction demarcation (or delegates to the project's unit-of-work abstraction); domain code owns business invariants.
- Return a result that the calling interface can map to its established contract.
- Dispatch or publish domain events at the boundary and timing required by the project.
- Adapt consumed events into the receiving module's own application flow.

Do not impose one operation per use case or require every flow to have both a DTO and an Action. Keep transaction ownership, event timing, and error semantics explicit.

## DTOs and validation

A DTO may carry application input/output without depending on an HTTP request. Validate input with the existing FormRequest, schema, validator, or DTO approach. Reflection attributes such as `#[Rules]` and a shared `BaseDTO` are optional patterns; add them only when established or specifically justified. Ensure mapping rejects or handles absent, invalid, and nullable data according to the actual contract rather than relying on unsafe casts.

## Event consumers

Use the transport's actual delivery semantics. Where duplicate delivery can repeat a non-idempotent effect, enforce idempotency at a durable side-effect boundary. Do not mark an event completed before work succeeds unless the claim and effect share an atomic transaction or a recoverable lease/state design. For external effects, use provider idempotency or an outbox/inbox/reconciliation strategy appropriate to the workflow.

## Testing

Test orchestration, persistence, events, and failure/retry behavior at the appropriate project layer. For a consumer, cover successful processing, duplicate delivery after success, retry after a failed attempt, and concurrent delivery when those scenarios are possible and material. A cache-only unit test does not prove durable or cross-instance idempotency.

## Aggregate write workflow

1. Get the actor and trusted tenant/organization scope from the established authorization boundary when relevant; never trust a client-submitted tenant ID as authorization.
2. Load the aggregate using the repository's approved scoped lookup and missing/forbidden semantics.
3. Invoke domain behavior; reject invalid transitions before persisting. For operations spanning aggregates, make consistency requirements and failure/recovery strategy explicit.
4. Persist within the approved transaction boundary and apply optimistic/pessimistic locking or database uniqueness constraints when concurrent attempts can violate the rule.
5. Publish only after durable state commit, or write to an outbox atomically. For external side effects, use the approved reliable delivery/idempotency design, not a naive inline callback.

Domain events express internal business facts. Public/integration events are versioned contracts between contexts or services; do not equate an internal PHP event class with a stable integration schema. Use [consistency.md](consistency.md) for risk-relevant details.
