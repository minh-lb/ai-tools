---
name: domain-driven-design
description: Laravel backend module design using DDD layers, Actions, DTOs, repositories, and events.
---

# Domain Driven Design

Use for Laravel backend modules only.
Shared Laravel rules come from `docs/coding-standards.md`, especially:
`LARAVEL.CTRL_THIN`, `LARAVEL.DOMAIN_ACTION_OWNS_RULES`, `LARAVEL.USECASE_ONE_ACTION`,
`LARAVEL.API_RESPONSE_ONLY`, `LARAVEL.CROSS_DOMAIN_EVENTS`, `LARAVEL.DOMAIN_NO_INFRA`.

## Workflow

1. Extract business behavior, trigger, state transition, and side effects.
2. Identify bounded context/module.
3. Generate only the needed slice: Entity, Action, DTO, Model, Provider, Repository, Event, UseCase, Handler, Controller.
4. Keep same-module flow through UseCase/Action; cross-module side effects via Domain Events.
5. Token-safe load order: `references/architecture.md` -> only relevant layer references -> only needed templates.
6. Replace every template placeholder with compile-safe code.
7. Test by layer (see `references/domain.md`, `references/application.md`).

## DDD-Specific Rules

- Domain Actions accept primitives, Value Objects, or Domain objects; never Application DTOs.
- Application DTOs are transport-neutral; build from arrays, not HTTP Request objects.
- Every DTO constructor property must have a `#[Rules([...])]` attribute. Required properties use `'required'`; optional properties use `'nullable'` or `'sometimes'`. DTOs without `#[Rules]` on every property are invalid. (see `templates/DTO.template` and `templates/RulesAttribute.template`)

## References

- `references/architecture.md`: paths and layer index.
- `references/domain.md`: Domain layer constraints.
- `references/application.md`: Application layer constraints.
- `references/infrastructure.md`: Infrastructure layer constraints.
- `references/interfaces.md`: Interfaces layer constraints.
- `references/cross-cutting.md`: event flow, imports, anti-patterns.
- `references/templates.md`: template catalog.

## Layout

`Modules/{Module}/Domain`, `Application`, `Infrastructure`, `Interfaces`.
Never place module domain code under `app/`.
