# Domain Layer

Contains: Entities, Actions, Events, Repository contracts, Domain Services, Value Objects.

## Responsibilities

- `Entity`: framework-free state, invariant behavior, and recorded Domain Events exposed through `releaseEvents()` when needed.
- `Action`: owns business flow, repository contracts, and state transitions. Does not import Application DTOs or HTTP objects.
- `Event`: immutable record of something that happened in the domain.
- `Repository contract`: stable interface for persistence; implemented in Infrastructure.

## Constraints

- No Eloquent, HTTP, Facades, Application DTOs, or concrete infrastructure.
- Domain Actions accept primitives, Value Objects, or Domain objects only.

## Testing

- Unit tests: Domain Actions, Entities, Services.
- Entity unit tests: verify invariant checks, state transitions, and domain event recording.
- Mock repository contracts; no DB or framework dependencies.
