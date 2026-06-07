# Architecture Reference

Index of layer references. Load only the layer file relevant to your current task.

- [domain.md](domain.md) — Entity, Action, Event, Repository contract, Value Object.
- [application.md](application.md) — UseCase, DTO, EventHandler.
- [infrastructure.md](infrastructure.md) — Model, Repository implementation, Provider.
- [interfaces.md](interfaces.md) — Controller, Request, Resource.
- [cross-cutting.md](cross-cutting.md) — Event flow, imports, anti-patterns.

## Paths

| Component | Path | Naming |
| --- | --- | --- |
| Entity | `Modules/{Module}/Domain/Entities/` | `{Entity}.php` |
| Action | `Modules/{Module}/Domain/Actions/` | `{Verb}{Entity}Action.php` |
| Event | `Modules/{Module}/Domain/Events/` | `{Entity}{PastTense}.php` |
| Repository contract | `Modules/{Module}/Domain/Repositories/` | `{Entity}Repository.php` |
| DTO | `Modules/{Module}/Application/DTOs/` | `{Verb}{Entity}DTO.php` |
| UseCase | `Modules/{Module}/Application/UseCases/` | `{Verb}{Entity}UseCase.php` |
| EventHandler | `Modules/{Module}/Application/EventHandlers/` | `{Entity}{PastTense}Handler.php` |
| Model | `Modules/{Module}/Infrastructure/Models/` | `{Entity}Model.php` |
| Repository impl | `Modules/{Module}/Infrastructure/Repositories/` | `{Entity}RepositoryImpl.php` |
| Provider | `Modules/{Module}/Infrastructure/Providers/` | `{Module}ServiceProvider.php` |
| Controller | `Modules/{Module}/Interfaces/Controllers/` | `{Verb}{Entity}Controller.php` |
| Request | `Modules/{Module}/Interfaces/Requests/` | `{Verb}{Entity}Request.php` |
| Resource | `Modules/{Module}/Interfaces/Resources/` | `{Entity}Resource.php` |
