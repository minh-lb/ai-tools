# Application Layer

Contains: UseCases, DTOs, EventHandlers.

## Responsibilities

- `UseCase`: accepts an Application DTO, calls one Action, returns the result, and dispatches events returned by `Entity::releaseEvents()` at the Application boundary.
- `DTO`: transport-neutral input/output shape built from arrays or primitives; no Request dependency.
- `EventHandler`: consumes events idempotently and calls its own module UseCase.

## Constraints

- No business rules, Eloquent, or HTTP objects.
- UseCases do not call repositories directly.
- Application orchestration may depend on framework contracts such as event dispatchers or cache repositories, but not facades or concrete infrastructure classes.

## Testing

- DTO unit tests: verify `fromArray()` mapping, `rules()` output, and `#[Rules]` attribute coverage for every constructor property.
- Integration tests: UseCases with real test DB/repositories and event dispatch assertions.
- EventHandlers: run twice with the same event and assert the second delivery is ignored by the idempotency guard.
- For critical asynchronous integrations, prefer a durable inbox or processed-message table over cache-only deduplication.
