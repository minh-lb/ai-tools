# Application Layer

The application layer coordinates a requested use case and the boundaries it needs. Follow the target repository's existing service/action/use-case pattern.

## Possible responsibilities

- Accept a transport-neutral input shape where useful.
- Coordinate the domain operation(s), repository ports, transaction, and required side effects.
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
