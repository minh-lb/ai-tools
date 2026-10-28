---
name: coding-rule
description: Use when implementing, debugging, or refactoring software, or making code naming and design decisions, including PHP, JavaScript, TypeScript, React, Next.js, Laravel, NestJS, and APIs.
metadata:
  author: Minh Luu
---

# Coding Rule

Deliver correct, secure, maintainable code with the smallest complete change. Follow applicable host/repository instructions and explicit user requirements; use these defaults where they leave room for judgment. Existing defects are not conventions to copy.

## Working loop

1. Establish the intended behavior and acceptance conditions. Inspect relevant code, callers, tests, supported versions, and safe verification commands. Preserve unrelated work and public contracts unless the task requires changing them.
2. Before adding behavior or structure, check: required now → suitable existing solution → standard library → native platform/framework feature → installed dependency → new code/dependency. Prefer a direct call over a forwarding wrapper; justify new dependencies by compatibility, maintenance, security, license, and runtime cost. Apply this internally, not as a user questionnaire.
3. Implement a cohesive solution covering relevant boundaries and failures. Keep state ownership and side effects explicit. Preserve validation, authorization, error handling, accessibility, and data integrity; remove redundant controls only after verifying equivalent protection at the owning boundary. Avoid speculative abstractions, universal size/coverage limits, and unrelated cleanup.
4. Verify changed behavior and meaningful failure paths with safe, focused checks; broaden for affected integrations. Review the final diff. Report the change, actual commands/results, skipped checks, and unresolved risks. Never infer runtime correctness from compilation alone.

Scale effort to impact. A mechanical rename needs caller/import checks and relevant static checks, not a design audit. A reproducible bug needs a regression check where feasible. Public behavior, security, persistence, and compatibility changes need explicit rationale and relevant boundary/concurrency evidence. Ask only when a missing decision blocks correct work. Diagnose failed checks before retrying; stop the affected action when authorization or environment prevents verification and report the limit.

## Read on demand

For mechanical edits, this core is sufficient. Otherwise select references by the **decision being changed**, not the file extension. Read only matching sections, once per task unless they change. Links inside references are optional follow-ups under the same rule; do not recursively load the library or restate its checklists in the response.

| Decision | Bundled reference |
|---|---|
| Naming defaults not settled by project/contract | [Naming](references/naming-conventions.md) |
| Responsibility, abstraction, inheritance, SOLID | [Code structure](references/code-structure-and-clean-code.md) |
| JS/TS types, values, modules, async | [JavaScript/TypeScript](references/javascript-typescript.md) |
| PHP types, values, resources, errors | [PHP](references/php.md) |
| React components, hooks, effects, state | [React](references/react.md) |
| Next.js router, rendering, server/client, caching, actions | [Next.js](references/nextjs.md) |
| Laravel requests, Eloquent, policies, jobs | [Laravel](references/laravel.md) |
| NestJS modules, DI, DTOs, guards, lifecycle | [NestJS](references/nestjs.md) |
| Interaction, forms, accessibility | [Frontend](references/frontend.md) |
| Browser performance diagnosis or optimization | [Frontend performance](references/frontend-performance.md) |
| Service/worker behavior, retries, side effects | [Backend](references/backend.md) |
| API contract; REST only for resource-oriented HTTP | [API/REST](references/api-and-rest.md) |
| Queries, transactions, schema, migrations | [Database](references/database-sql.md) |
| Trust, access, untrusted input/output, files, secrets | [Security](references/security.md) |
| Test design or verification strategy | [Testing](references/testing-and-quality.md) |
| Resilience, configuration, IaC, containers, shell | [Operations](references/reliability-and-operations.md) |

Cross-layer changes need each affected boundary: client validation cannot establish server authorization, and a response cannot prove persisted state. For an unlisted stack, apply the core and relevant surface guidance using that stack's idioms.

This folder is self-contained: no other skill, personal notes, MCP, or fixed tool is required. External documentation is needed only to resolve version-sensitive APIs or uncertainty; use authoritative sources matching the installed version, disclose unavailable verification, and avoid guessing. The optional [source index](references/standards-basis.md) is background, not a startup dependency. Loading a skill does not install session hooks or grant permission to commit, publish, deploy, or mutate external systems.
