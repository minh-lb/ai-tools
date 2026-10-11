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
