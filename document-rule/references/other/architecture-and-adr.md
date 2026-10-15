# Architecture, Design, and ADRs

## Architecture / System Design

- State goals/non-goals, constraints, workload/actors, and context.
- Describe components and responsibilities, integration boundaries, data flow, and trust boundaries.
- Ground technical decisions: options, trade-offs, failure modes, scaling, observability, and security.
- Include validation/success signals when needed to determine whether the design meets its goals; do not claim checks were run unless they were.
- Include notable contracts/interfaces and a migration approach when the design affects compatibility.
- Add diagrams only when they reduce ambiguity; do not replace important prose with an inaccessible diagram.

## ADR

- **Context:** the problem and forces.
- **Decision:** a specific choice and the scope where it applies.
- **Alternatives:** options considered and their trade-offs.
- **Consequences:** benefits, costs, operational impact, and reversibility.
- **Decision status:** Proposed/Accepted/Superseded **only when supported by evidence**.

Do not present an unapproved decision as fact. If the user asks for exploration, present alternatives; if they ask only for an ADR, do not add a lengthy Implementation Plan automatically.

Templates: [Architecture](../../templates/other/architecture-design.md), [ADR](../../templates/other/adr.md).
