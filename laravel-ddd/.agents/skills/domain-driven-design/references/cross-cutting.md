# Cross-Cutting Concerns

## Event Flow

Controller/Listener -> DTO -> UseCase -> Action -> Repository -> Entity records Domain Event -> UseCase calls `releaseEvents()` and dispatches -> Handler -> receiving module UseCase.

## Import Rules

- Follow layer constraints inside a module.
- Cross-module direct imports are forbidden except stable `Domain/Events` consumed by handlers.

## Anti-Patterns

- Business logic in Controller, UseCase, Provider, Model, DTO, or Request.
- Domain Action importing Application DTO or HTTP Request.
- UseCase calling Repository directly.
- Eloquent Model used as Domain Entity.
- Domain importing framework/infrastructure code.
- Module A calling Module B Action or Repository directly.
