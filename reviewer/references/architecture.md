# Architecture

## Focus

Review whether the in-scope code (and, in `git-diff` mode, the proposed change) solves the stated problem with a simple, coherent design that preserves clear boundaries, ownership, and extensibility rather than introducing unnecessary coupling, hidden dependencies, speculative abstractions, or domain drift.

## Inspect

- Layer boundaries between transport, domain, persistence, and infrastructure
- Module ownership and dependency direction
- Domain modeling, invariants, and composition points
- Reuse versus duplication of core business rules, existing components/utilities, and already-declared platform/framework capabilities
- Whether abstractions or extension points solve a current, evidenced need rather than a speculative future possibility
- Whether component interactions and ownership fit the behavior and failure boundaries
- For web UI, ownership boundaries between routes/pages, components, client state, data-fetching/cache layers, and server/client-rendered code
- Feature flags, extension hooks, and configuration boundaries
- Placement of cross-cutting concerns such as auth, logging, caching, and retries

## Review Questions

- Does the solution satisfy the actual user/business intent without solving an imagined future problem?
- Is there a materially simpler design that preserves the required behavior and safety?
- Is the new logic implemented in the right layer, and do the participating components have clear ownership?
- Does UI state have a single clear source of truth, or is server state copied into multiple stores/components that can drift?
- Are route/page components, reusable UI components, data-fetching, and domain policy separated in a way that matches the actual feature and test boundaries?
- Are client/server rendering boundaries and serialization contracts explicit, with no server-only dependency or secret pulled into browser code?
- Does the change duplicate a business rule that already exists elsewhere?
- Are abstractions helping reduce coupling, or hiding concrete behavior that should stay explicit?
- Does the code introduce hidden runtime dependencies or global state?
- Will the next related feature be easier or harder to implement after this change?
- Is the feature/custom mechanism required by stated intent, or is it duplicating behavior already present in this codebase?
- Can the language standard library, platform/browser API, or framework-native capability solve this instead of custom code?
- Is a suitable dependency already declared in the project? If a new package is proposed, is it necessary and worth its security, maintenance, license, compatibility, and runtime costs?
- What is the smallest complete design? Would one clear call suffice, or would it hide important behavior and safety boundaries?

## Red Flags

- Controller, route, or UI layer taking on domain or persistence responsibilities
- Frontend components duplicating server policy, owning unrelated data fetching/navigation/persistence concerns, or spreading one state transition across competing stores
- Business rules split across multiple services without a clear source of truth
- Circular dependencies or imports that violate intended layering
- New shared utility that mixes unrelated concerns
- Generic abstraction, extension point, or configuration added only for hypothetical future use
- New custom implementation that duplicates a suitable project component, declared dependency, standard-library function, or native platform/framework feature
- New dependency added for convenience when an existing, appropriate facility already meets the requirement
- Broad refactor or added subsystem unrelated to the requirement and not justified by a concrete risk
- Feature-specific shortcuts that bypass existing validation or domain flows
- Configuration or environment assumptions leaking into domain code
- Server-only modules, credentials, or privileged data crossing an unclear client/server component boundary

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
- Give each UI feature/state transition a clear owner; keep reusable components focused and data-fetching/server-client boundaries explicit
- Prefer existing project/platform facilities when they meet the requirement; add an abstraction or dependency only to close an evidenced gap
