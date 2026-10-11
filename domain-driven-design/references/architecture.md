# Architecture Reference

Use this as an index for the supplied Laravel module examples. The paths, filenames, and template catalog below describe one possible layout; inspect and follow the target repository before generating files.

## Layer references

- [domain.md](domain.md) — domain behavior, invariants, events, and repository boundaries.
- [application.md](application.md) — use-case orchestration, DTOs, and event consumers.
- [infrastructure.md](infrastructure.md) — persistence adapters, external clients, and dependency wiring.
- [interfaces.md](interfaces.md) — HTTP/controllers, validation, resources, and routes.
- [cross-cutting.md](cross-cutting.md) — module boundaries, event delivery, and idempotency.
- [verification.md](verification.md) — final consistency and validation checks.

## Example template layout

| Component | Example path | Example naming |
|---|---|---|
| Entity | `Modules/{Module}/Domain/Entities/` | `{Entity}.php` |
| Action | `Modules/{Module}/Domain/Actions/` | `{Verb}{Entity}Action.php` |
| Event | `Modules/{Module}/Domain/Events/` | `{Entity}{PastTense}.php` |
| Repository contract | `Modules/{Module}/Domain/Repositories/` | `{Entity}Repository.php` |
| DTO | `Modules/{Module}/Application/DTOs/` | `{Verb}{Entity}DTO.php` |
| Use case | `Modules/{Module}/Application/UseCases/` | `{Verb}{Entity}UseCase.php` |
| Event handler | `Modules/{Module}/Application/EventHandlers/` | `{Entity}{PastTense}Handler.php` |
| Model | `Modules/{Module}/Infrastructure/Models/` | `{Entity}Model.php` |
| Repository adapter | `Modules/{Module}/Infrastructure/Repositories/` | `{Entity}RepositoryImpl.php` |
| Provider | `Modules/{Module}/Infrastructure/Providers/` | `{Module}ServiceProvider.php` |
| Controller | `Modules/{Module}/Interfaces/Controllers/` | `{Verb}{Entity}Controller.php` |
| Request | `Modules/{Module}/Interfaces/Requests/` | `{Verb}{Entity}Request.php` |
| Resource | `Modules/{Module}/Interfaces/Resources/` | `{Entity}Resource.php` |
| Optional validation attribute/base DTO/response helper | `Modules/Shared/` | Only if project convention or requirement justifies it |

Test locations also vary by project. Use the existing suite's organization and naming instead of moving tests to the example paths.

## Templates

Template files are `templates/{Component}.template`. Load only those needed and remove unused files. `ApiResponse`, `BaseDTO`, and `RulesAttribute` are optional examples; they are not required for a DTO or HTTP endpoint. Follow the existing response envelope and validation mechanism.
