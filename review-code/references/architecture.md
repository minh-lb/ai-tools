# Architecture

## Focus

Review whether the change preserves clear boundaries, ownership, and extensibility rather than introducing coupling, hidden dependencies, or domain drift.

## Inspect

- Layer boundaries between transport, domain, persistence, and infrastructure
- Module ownership and dependency direction
- Domain modeling, invariants, and composition points
- Reuse versus duplication of core business rules
- Feature flags, extension hooks, and configuration boundaries
- Placement of cross-cutting concerns such as auth, logging, caching, and retries

## Review Questions

- Is the new logic implemented in the right layer?
- Does the change duplicate a business rule that already exists elsewhere?
- Are abstractions helping reduce coupling, or hiding concrete behavior that should stay explicit?
- Does the code introduce hidden runtime dependencies or global state?
- Will the next related feature be easier or harder to implement after this change?

## Red Flags

- Controller, route, or UI layer taking on domain or persistence responsibilities
- Business rules split across multiple services without a clear source of truth
- Circular dependencies or imports that violate intended layering
- New shared utility that mixes unrelated concerns
- Feature-specific shortcuts that bypass existing validation or domain flows
- Configuration or environment assumptions leaking into domain code

## Evidence

An architecture finding should identify:

- The boundary or ownership rule being violated
- The concrete downside: duplication, inconsistency, hidden coupling, or blocked extensibility
- Why the issue is more than a style preference

## Remediation Direction

- Move logic to the layer that owns the invariant
- Consolidate duplicated rules behind a single domain boundary
- Replace implicit coupling with explicit contracts or injected dependencies
- Keep cross-cutting concerns centralized and consistent
