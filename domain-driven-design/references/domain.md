# Domain Layer

Use this layer to express domain behavior and invariants when the target project separates domain concerns from framework and persistence details.

## Possible responsibilities

- **Entity / aggregate:** domain identity, state transitions, and invariants.
- **Domain operation:** a business action or service that coordinates the domain rules it owns.
- **Domain event:** an immutable record of a meaningful fact that occurred.
- **Repository contract:** persistence behavior needed by the domain/application boundary, implemented through an adapter.
- **Value object:** a value with domain meaning and enforced invariants, when that improves correctness and clarity.

These roles are not a required class-per-concept checklist. Use only the abstractions needed for the requested behavior and established architecture.

## Boundaries

Keep domain rules independent of HTTP request objects, Eloquent models, facades, and concrete infrastructure when the repository's architecture provides these layers. A domain operation may accept primitives, value objects, or domain objects; do not pass transport DTOs into the domain unless that is the project's explicit design.

## Testing

Test domain invariants and state transitions with focused tests. Use project conventions for object construction and collaborators; do not add mocks or framework setup when the behavior is pure.

## Aggregate design

- Identify the aggregate root and which invariants must hold immediately after every operation. Only the root should expose state-changing operations that protect those invariants; avoid public setters that bypass checks.
- Decide aggregate size from business consistency needs, not table relationships. Reference other aggregates by identity where appropriate. A transaction around one aggregate does not imply all cross-aggregate facts are instantly consistent.
- Use ubiquitous language from approved requirements for commands, methods, state, and events. If two contexts use the same word differently, document the distinction instead of sharing a mutable entity type.
- A domain service/action is useful for a business rule without a natural entity owner. Domain actions should accept domain values/objects and return a meaningful result; they should not fetch, save, dispatch jobs, or manage transactions.
- Invariant violations must fail explicitly without partial mutation. Mutable or immutable entities are both valid; follow the project convention and test the actual transition semantics.

Read [modeling.md](modeling.md) for decisions about roots, boundaries, and domain terminology.
