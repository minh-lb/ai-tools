# Cross-Cutting Concerns

## Event Flow

Controller/Listener -> DTO -> UseCase -> Action -> Repository -> Entity records Domain Event -> UseCase calls `releaseEvents()` and dispatches -> Handler -> receiving module UseCase.

Default handler idempotency pattern:

- Add a stable `eventId` to every Domain Event.
- In the consuming handler, reserve `handler-class + eventId` through a cache repository before calling the UseCase.
- If the reservation already exists, skip processing.
- For queue-based or high-value workflows, replace cache-only deduplication with a durable inbox table.

## Import Rules

- Follow layer constraints inside a module.
- Cross-module direct imports are forbidden except stable `Domain/Events` consumed by handlers.
- In `EventHandler.template`, `{SourceModule}` is the module that owns the Domain Event being consumed — it is distinct from `{Module}` (the receiving module). Replace both placeholders independently.

## Anti-Patterns

- Business logic in Controller, UseCase, Provider, Model, DTO, or Request.
- Domain Action importing Application DTO or HTTP Request.
- UseCase calling Repository directly.
- Eloquent Model used as Domain Entity.
- Domain importing framework/infrastructure code.
- Module A calling Module B Action or Repository directly.
- Repository implementations persisting only identifiers after the Entity has real state.
