---
name: domain-driven-design
description: Laravel backend module design using DDD layers, Actions, DTOs, repositories, and events.
---

# Domain Driven Design

Use for Laravel backend modules only.
This skill is self-contained. Do not assume project-local Laravel docs, response wrappers, or
shared base classes exist unless you can see them in the target codebase.

## Workflow

1. Extract business behavior, trigger, state transition, and side effects.
2. Identify bounded context/module.
3. Generate only the needed slice for the requested flow.
   - DTO selected: also generate `BaseDTO` and `Rules` support classes unless the target codebase already has compatible versions.
   - HTTP interface selected: also generate `Request`, `Resource`, and `ApiResponse` unless the target codebase already has a compatible version at `Modules/Shared/Support/Http/ApiResponse.php`.
   - Cross-module event consumer selected: also apply an idempotency guard in the handler.
4. Keep same-module flow through UseCase -> Action. Cross-module side effects travel through Domain Events only.
5. Token-safe load order — load only what the current scenario needs:
   - Command (create/update/delete): `architecture.md` → `domain.md` + `application.md` + `infrastructure.md` + `interfaces.md` → `cross-cutting.md` if events are involved → relevant templates only.
   - Query (list/find by criteria): `architecture.md` → `domain.md` + `infrastructure.md` + `interfaces.md` → relevant templates only.
   - Event consumer: `architecture.md` → `application.md` + `cross-cutting.md` → `EventHandler.template` + `DomainEvent.template`.
6. Replace every template placeholder with compile-safe, domain-specific code and explicit persistence/resource mappings.
7. Validate file set and generate tests by layer. Test guidance in each layer's Testing section; test templates in `references/architecture.md`. Confirm against `references/verification.md`.

## DDD-Specific Rules

- Domain Actions accept primitives, Value Objects, or Domain objects; never Application DTOs.
- Application DTOs are transport-neutral; build from arrays, not HTTP Request objects.
- Controllers stay thin: validate request, build DTO, call one UseCase, return `ApiResponse::success()` with Resource-shaped data.
- A UseCase orchestrates one Action and may dispatch Domain Events released by returned Entities. Do not call repositories from the UseCase.
- Cross-module communication uses Domain Events only. Module A must not call Module B Action or Repository directly.
- Domain code must not import Eloquent models, facades, HTTP objects, or concrete infrastructure.
- Prefer Value Objects over primitives for domain concepts with invariants (e.g., Email, Money, Status). Use `templates/ValueObject.template`.
- Every DTO constructor property must have a `#[Rules([...])]` attribute. Required properties use `'required'`; optional properties use `'nullable'` or `'sometimes'`. DTOs without `#[Rules]` on every property are invalid. (see `templates/DTO.template` and `templates/RulesAttribute.template`)

## References

- `references/architecture.md`: paths, layer index, and template catalog.
- `references/domain.md`: Domain layer constraints.
- `references/application.md`: Application layer constraints.
- `references/infrastructure.md`: Infrastructure layer constraints.
- `references/interfaces.md`: Interfaces layer constraints.
- `references/cross-cutting.md`: event flow, imports, anti-patterns.
- `references/verification.md`: file-set checks and validation checklist.

## Layout

`Modules/{Module}/Domain`, `Application`, `Infrastructure`, `Interfaces`.
Shared reusable support may live under `Modules/Shared/`.
Never place module domain code under `app/`.
