# Interfaces Layer

Contains: Controllers, Requests, Resources, Listeners.

## Responsibilities

- `Controller`: FormRequest validation -> `DTO::fromArray($request->validated())` -> UseCase call -> `ApiResponse` return. (`LARAVEL.CTRL_THIN`, `LARAVEL.API_RESPONSE_ONLY`)
- `Request`: FormRequest may call `Application/DTOs/*DTO::rules()` for validation. Controller passes `$request->validated()` to `DTO::fromArray()`.
- `Resource`: shapes API output.

## Constraints

- No business rules, direct repository calls, or Eloquent queries.
- For response conventions and examples, load `api-response` skill only when HTTP JSON output is being touched.
