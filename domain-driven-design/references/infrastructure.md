# Infrastructure Layer

Contains: Models, Repository implementations, Providers, messaging adapters, external clients.

## Responsibilities

- `Model`: Eloquent persistence shape only. Not a Domain Entity.
- `Repository impl`: bridges Domain contracts to Eloquent persistence.
- `Provider`: binds contracts to infrastructure implementations.

## Constraints

- No business rules.
- Eloquent models live only in `Infrastructure/Models`.
- One `ServiceProvider` per module. Add one `$this->app->bind()` per entity repository contract — do not create separate providers per entity.
- Register service providers in `bootstrap/providers.php` (Laravel 11+) or `config/app.php`.
- Repository implementations must map full entity state explicitly. Do not leave `save()` persisting only identifiers once real fields exist.

## Query-Side Extensions

Read-only operations (list, search, paginate) add query methods to the repository contract (`findAll()`, `findByCriteria()`). Lean queries with no business rules may go Controller → Repository directly, bypassing the UseCase. Queries that require business-level filtering or aggregation go through a dedicated ReadModel or query service in the Application layer.
