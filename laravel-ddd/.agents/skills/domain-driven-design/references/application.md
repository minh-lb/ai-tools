# Application Layer

Contains: UseCases, DTOs, EventHandlers.

## Responsibilities

- `UseCase`: follows `LARAVEL.USECASE_ONE_ACTION`; accepts Application DTO, calls one Action, returns result, dispatches events returned by `Entity::releaseEvents()` at the Application boundary.
- `DTO`: transport-neutral input/output shape built from arrays or primitives; no Request dependency.
- `EventHandler`: consumes events idempotently and calls its own module UseCase.

## Constraints

- No business rules, Eloquent, or HTTP objects.
- UseCases do not call Repository directly (see `LARAVEL.USECASE_ONE_ACTION`).

## Testing

- DTO unit tests: verify `fromArray()` mapping, `rules()` output, and `#[Rules]` attribute coverage for every constructor property.
- Integration tests: UseCases with real test DB/repositories and event dispatch assertions.
- EventHandlers: run twice with same event and assert idempotent outcome.
