# Architecture Reference

Index of layer references. Load only the layer file relevant to your current task.

- [domain.md](domain.md) — Entity, Action, Event, Repository contract, Value Object.
- [application.md](application.md) — UseCase, DTO, EventHandler.
- [infrastructure.md](infrastructure.md) — Model, Repository implementation, Provider.
- [interfaces.md](interfaces.md) — Controller, Request, Resource.
- [cross-cutting.md](cross-cutting.md) — Event flow, imports, anti-patterns.
- [verification.md](verification.md) — final file-set and validation checks.

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
| Value Object | `Modules/{Module}/Domain/ValueObjects/` | `{ValueObject}.php` |
| Shared `Rules` attribute | `Modules/Shared/Attributes/` | `Rules.php` |
| Shared `BaseDTO` | `Modules/Shared/DTOs/` | `BaseDTO.php` |
| Shared `ApiResponse` | `Modules/Shared/Support/Http/` | `ApiResponse.php` |
| Entity test | `tests/Unit/Modules/{Module}/Domain/Entities/` | `{Entity}Test.php` |
| Action test | `tests/Unit/Modules/{Module}/Domain/Actions/` | `{Action}ActionTest.php` |
| DTO test | `tests/Unit/Modules/{Module}/Application/DTOs/` | `{Name}DTOTest.php` |
| UseCase test | `tests/Feature/Modules/{Module}/Application/UseCases/` | `{Name}UseCaseTest.php` |
| EventHandler test | `tests/Unit/Modules/{Module}/Application/EventHandlers/` | `{EventName}HandlerTest.php` |
| Controller test | `tests/Feature/Modules/{Module}/Interfaces/Controllers/` | `{Name}ControllerTest.php` |

## Templates

Template files follow `templates/{Component}.template`. Load only the templates needed for the current task.

| Component | Template |
| --- | --- |
| Entity | `Entity.template` |
| Value Object | `ValueObject.template` |
| Action | `Action.template` |
| DTO | `DTO.template` |
| UseCase | `UseCase.template` |
| Infrastructure model | `Model.template` |
| Infrastructure provider | `Provider.template` |
| Repository interface | `RepositoryInterface.template` |
| Repository implementation | `RepositoryImplementation.template` |
| Domain event | `DomainEvent.template` |
| Event handler | `EventHandler.template` |
| Controller | `Controller.template` |
| Request | `Request.template` |
| Resource | `Resource.template` |
| Rules attribute | `RulesAttribute.template` |
| Base DTO | `BaseDTO.template` |
| ApiResponse | `ApiResponse.template` |
| Entity test | `EntityTest.template` |
| Action test | `ActionTest.template` |
| DTO test | `DTOTest.template` |
| UseCase test | `UseCaseTest.template` |
| EventHandler test | `EventHandlerTest.template` |
| Controller test | `ControllerTest.template` |
