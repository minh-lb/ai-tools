---
name: domain-driven-design
description: Design or implement a Laravel module when the user requests Domain-Driven Design or the target codebase already uses that approach. Use for bounded-context modeling, domain behavior, repositories, application flows, and domain events; do not impose DDD layers on ordinary Laravel CRUD work.
metadata:
  author: Minh Luu
---

# Domain-Driven Design for Laravel

Use this skill only when the user requests DDD or the target Laravel codebase already has a DDD/module architecture. Before scaffolding, inspect the existing directory structure, namespaces, dependencies, framework version, validation, response, event, persistence, and test conventions. If the project does not use DDD and the user has not asked to introduce it, follow the current architecture or ask before creating new layers.

Templates are optional starting points, not a required architecture. This skill is self-contained; do not assume project-local Laravel docs, response wrappers, or shared base classes exist unless verified in the target codebase.

## Workflow

1. Extract the requested business behavior, trigger, state change, data invariants, side effects, and acceptance evidence.
2. Identify the module/bounded context and the existing project conventions. Keep the change within the requested slice.
3. Generate only components needed for that behavior. Do not add shared base classes, validation attributes, response envelopes, service providers, repositories, events, or tests solely because a template catalog contains them.
   - Use the project's request/schema validation approach. A custom DTO validation attribute/reflection layer is optional only when already established or requested.
   - Use the existing HTTP response/resource contract. Do not introduce a new response wrapper or envelope by default.
   - For event consumers, inspect delivery guarantees and side effects. Add idempotency where duplicate delivery can cause incorrect effects; use a design whose completion marker cannot permanently suppress a failed retry.
4. Keep domain invariants independent of HTTP and persistence details. Let the application layer coordinate the operation using the project's established ports/use cases/actions and transaction boundaries. Avoid direct access to another module's internals. Prefer events for decoupled side effects; use an explicit stable contract for synchronous interactions when the business flow and project architecture require one.
5. Load `references/architecture.md` first, then only layer guidance and templates relevant to the requested slice. Load `cross-cutting.md` when module boundaries, events, or shared concerns are involved. Use `verification.md` for the final review.
6. Adapt templates completely: replace placeholders with real types, fields, mappings, and project-approved behavior. Remove unused files and example conventions.
7. Validate generated behavior with the project's supported checks and tests for the changed layers. Do not claim checks ran unless they did; do not commit unless asked.

## Design guidance

- Keep business invariants in the domain owner; keep HTTP, framework, and persistence concerns at their existing boundaries.
- Use entities, value objects, domain services, repository abstractions, application services, and events only when they clarify a real invariant, ownership boundary, or side effect.
- DTOs should represent the application boundary and remain independent of the HTTP request object. Validation may belong in a FormRequest, schema, validator, or existing DTO convention; do not mandate a custom attribute system.
- An application flow may coordinate the number of domain operations needed for the use case. Do not impose a universal “one Action only” rule.
- Preserve project-defined response shapes, status codes, authorization policies, deletion/retention rules, transactions, and event delivery semantics.
- Give each test the appropriate layer and isolation. Follow the target project's Pest/PHPUnit, mocking, database, and coverage practices rather than assuming a runner.

## Layout

The `Modules/{Module}/{Domain,Application,Infrastructure,Interfaces}` paths in `references/architecture.md` are an example layout used by the templates. Follow the target repository's actual module paths and registration conventions. Never move existing code into this layout unless the task requests that change.
