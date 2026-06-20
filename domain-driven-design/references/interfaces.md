# Interfaces Layer

Contains: Controllers, Requests, Resources, Listeners.

## Responsibilities

- `Controller`: FormRequest validation -> `DTO::fromArray($request->validated())` -> UseCase call -> Resource-backed `JsonResponse`.
- `Request`: FormRequest may call `Application/DTOs/*DTO::rules()` for validation. Controller passes `$request->validated()` to `DTO::fromArray()`.
- `Resource`: shapes API output.

## Routes

Register module routes in `Modules/{Module}/routes/api.php` and boot them from the module ServiceProvider:

```php
public function boot(): void
{
    $this->loadRoutesFrom(__DIR__ . '/../../routes/api.php');
}
```

Each single-action Controller maps to one route. Group routes under a module-specific prefix and apply shared middleware (auth, throttle) at the group level.

## Testing

- Controller feature tests: POST valid payload → `assertCreated()`, assert `ApiResponse` JSON shape (`success`, `code`, `data`).
- Controller feature tests: POST invalid/missing payload → `assertUnprocessable()`, assert `success: false`.
- Request validation: no separate unit test needed — `{Name}DTO::rules()` is the single source of truth, covered by DTO unit test and Controller feature test.
- Use `Event::fake()` in feature tests to assert domain events are dispatched without side effects.

## Constraints

- No business rules, direct repository calls, or Eloquent queries.
- Use `ApiResponse::success()` / `ApiResponse::problem()` from `Modules\Shared\Support\Http\ApiResponse` for all JSON responses. Generate from `templates/ApiResponse.template` if not already present in the target codebase.
