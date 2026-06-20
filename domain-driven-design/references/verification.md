# Verification

Use this file after generating or updating a module slice.

## File-set Checks

- DTO requested: confirm `DTO`, `BaseDTO`, and `Rules` all exist, unless compatible shared versions already exist in the target codebase.
- HTTP entrypoint requested: confirm `Controller`, `Request`, `Resource`, and `ApiResponse` all exist.
- Event consumer requested: confirm the `Domain Event` exposes an `eventId` and the `EventHandler` contains an idempotency guard before invoking the UseCase.
- Repository implementation requested: confirm it has explicit `toDomain()` and `toPersistence()` mappings for all current entity fields.

## Validation Checklist

- All template placeholders are replaced with real class names, table names, response codes, and field mappings. Test-specific placeholders: `{api_route}` → actual route URI (e.g. `/api/orders`), `{table}` → Eloquent table name.
- Domain layer imports no HTTP, Eloquent, facades, or concrete infrastructure.
- Each UseCase calls one Action and does not touch repositories directly.
- Each DTO property has a `#[Rules]` attribute and `fromArray()` covers every constructor argument.
- Controller output is shaped by a Resource, not inline array mapping, and returned via `ApiResponse::success()` / `ApiResponse::problem()`.
- Event handlers skip duplicate deliveries before invoking their UseCase.
- Repository `save()` persists actual entity state, not just identifiers.
- Tests exist for every generated slice: Entity/Action unit tests, DTO unit test, UseCase integration test, Controller feature test, EventHandler idempotency test when applicable.

