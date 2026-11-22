# Domain-Driven Design for Laravel

Use this guide when the user requests DDD in Laravel or the module being changed already uses it. Look for domain-owned business invariants, aggregate or bounded-context boundaries, and established layer responsibilities. A modular directory layout alone is insufficient evidence. Inspect the module’s validation, responses, persistence, events, and tests before choosing a pattern.

Templates are optional starting points, not a required architecture. Verify that project-local Laravel docs, response wrappers, and shared base classes exist before relying on them.

## Workflow

1. Extract the business vocabulary, actors, trigger, permitted state changes, invariants, ownership, side effects, and acceptance evidence. Separate approved requirements from assumptions.
2. Identify the bounded context and aggregate owner for each invariant; define the transaction/consistency boundary before selecting layers or templates. Keep the change within the requested slice.
3. Generate only components needed for that behavior. Do not add shared base classes, validation attributes, response envelopes, service providers, repositories, events, or tests solely because a template catalog contains them.
   - Use the project's request/schema validation approach. A custom DTO validation attribute/reflection layer is optional only when already established or requested.
   - Use the existing HTTP response/resource contract. Do not introduce a new response wrapper or envelope by default.
   - For event consumers, inspect delivery guarantees and side effects. Add idempotency where duplicate delivery can cause incorrect effects; use a design whose completion marker cannot permanently suppress a failed retry.
4. Make aggregate operations enforce their own business invariants; let application use cases coordinate loading, domain operations, persistence, transaction, and publication. Model a Domain Action as a pure business operation, not a second application service. Keep cross-context calls behind published contracts; choose sync interactions or events based on required consistency, not fashion.
5. Open the [architecture guide](architecture.md) for layer responsibilities and links to relevant references. Read [modeling](modeling.md) for aggregate and bounded-context changes, [consistency](consistency.md) for writes, tenancy, concurrency or reliable messaging, and [cross-cutting guidance](cross-cutting.md) for work across modules.
6. Replace all template placeholders with actual types, fields, mappings, and project-approved behavior. Use the shared verification workflow and the [DDD verification guide](verification.md) for the affected boundaries.

## Design guidance

- Keep business invariants in the domain owner; keep HTTP, framework, and persistence concerns at their existing boundaries.
- Use entities, aggregate roots, value objects, domain services, repositories, application services, and events only when they clarify a real invariant, ownership boundary, or side effect. Prefer repositories for aggregate roots, not one repository per entity.
- DTOs should represent the application boundary and remain independent of the HTTP request object. Validation may belong in a FormRequest, schema, validator, or existing DTO convention; do not mandate a custom attribute system.
- An application flow may coordinate multiple domain operations. Do not impose a universal “one Action only” rule. Domain actions must not silently perform persistence or external I/O; move such orchestration to the application layer.
- Preserve project-defined response shapes, status codes, authorization policies, deletion/retention rules, transactions, and event delivery semantics. For multi-tenant repositories, enforce tenant scope on reads and writes using trusted context, and verify it with tests; handle concurrent writes according to business risk.
- Give each test the appropriate layer and isolation. Check allowed and rejected transitions, unchanged state after failure, concurrency/tenant boundaries where applicable, and real side effects. Follow the target project's Pest/PHPUnit, mocking, database, and coverage practices rather than assuming a runner.

## Layout

The `Modules/{Module}/{Domain,Application,Infrastructure,Interfaces}` layout in the [architecture guide](architecture.md) illustrates the [Laravel templates](../../templates/laravel-ddd/). Follow the target repository's module paths and registration conventions. Move existing code only when the task calls for it.
