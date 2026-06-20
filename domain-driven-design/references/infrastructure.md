# Infrastructure Layer

Contains: Models, Repository implementations, Providers, messaging adapters, external clients.

## Responsibilities

- `Model`: Eloquent persistence shape only. Not a Domain Entity.
- `Repository impl`: bridges Domain contracts to Eloquent persistence.
- `Provider`: binds contracts to infrastructure implementations.

## Constraints

- No business rules.
- Eloquent models live only in `Infrastructure/Models`.
- Register service providers in `bootstrap/providers.php` (Laravel 11+) or `config/app.php`.
