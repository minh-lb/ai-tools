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

1. Extract the business vocabulary, actors, trigger, permitted state changes, invariants, ownership, side effects, and acceptance evidence. Separate approved requirements from assumptions.
2. Identify the bounded context and aggregate owner for each invariant; define the transaction/consistency boundary before selecting layers or templates. Keep the change within the requested slice.
3. Generate only components needed for that behavior. Do not add shared base classes, validation attributes, response envelopes, service providers, repositories, events, or tests solely because a template catalog contains them.
   - Use the project's request/schema validation approach. A custom DTO validation attribute/reflection layer is optional only when already established or requested.
   - Use the existing HTTP response/resource contract. Do not introduce a new response wrapper or envelope by default.
   - For event consumers, inspect delivery guarantees and side effects. Add idempotency where duplicate delivery can cause incorrect effects; use a design whose completion marker cannot permanently suppress a failed retry.
4. Make aggregate operations enforce their own business invariants; let application use cases coordinate loading, domain operations, persistence, transaction, and publication. Model a Domain Action as a pure business operation, not a second application service. Keep cross-context calls behind published contracts; choose sync interactions or events based on required consistency, not fashion.
5. Load `references/architecture.md` first. Read `references/modeling.md` for new aggregates, business rules, or bounded-context changes; layer references only for affected components; `references/consistency.md` for writes, concurrent updates, multi-tenancy, or reliable messaging; `cross-cutting.md` for cross-module work; `verification.md` for final review.
6. Adapt templates completely: replace placeholders with real types, fields, mappings, and project-approved behavior. Remove unused files and example conventions.
7. Validate generated behavior with the project's supported checks and tests for the changed layers. Do not claim checks ran unless they did; do not commit unless asked.

## Design guidance

- Keep business invariants in the domain owner; keep HTTP, framework, and persistence concerns at their existing boundaries.
- Use entities, aggregate roots, value objects, domain services, repositories, application services, and events only when they clarify a real invariant, ownership boundary, or side effect. Prefer repositories for aggregate roots, not one repository per entity.
- DTOs should represent the application boundary and remain independent of the HTTP request object. Validation may belong in a FormRequest, schema, validator, or existing DTO convention; do not mandate a custom attribute system.
- An application flow may coordinate multiple domain operations. Do not impose a universal “one Action only” rule. Domain actions must not silently perform persistence or external I/O; move such orchestration to the application layer.
- Preserve project-defined response shapes, status codes, authorization policies, deletion/retention rules, transactions, and event delivery semantics. For multi-tenant repositories, enforce tenant scope on reads and writes using trusted context, and verify it with tests; handle concurrent writes according to business risk.
- Give each test the appropriate layer and isolation. Check allowed and rejected transitions, unchanged state after failure, concurrency/tenant boundaries where applicable, and real side effects. Follow the target project's Pest/PHPUnit, mocking, database, and coverage practices rather than assuming a runner.

## Interaction with other workflows

This skill owns DDD architecture decisions, not general code style, test-case documents, E2E execution, or review publication. Apply repository coding/testing/review conventions where present; never assume another skill is installed. Do not write implementation plans or testcase documents unless separately requested. For behavior benchmarking outside the normal workflow, use `eval/scenarios.md` and report observed results separately from static review.

## Layout

The `Modules/{Module}/{Domain,Application,Infrastructure,Interfaces}` paths in `references/architecture.md` are an example layout used by the templates. Follow the target repository's actual module paths and registration conventions. Never move existing code into this layout unless the task requests that change.
