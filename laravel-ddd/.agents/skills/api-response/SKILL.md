---
name: api-response
description: Consistent Laravel HTTP JSON responses via ApiResponse::success(), ::problem(), and ::validation().
---

# API Response

Use this skill only when changing HTTP JSON response behavior.
Base rule is `LARAVEL.API_RESPONSE_ONLY` in `docs/coding-standards.md`.
Use `Modules\Shared\Support\Http\ApiResponse` for controller, middleware, and exception-handler JSON.

## Success

```php
return ApiResponse::success(
    request: $request,
    data: $data, // array|null; map DTOs/resources first
    code: 'RESOURCE.ACTION_SUCCESS',
    message: null,
    status: Response::HTTP_OK,
);
```

Statuses: `200` read/update/delete, `201` create, `202` async.

## Problem

```php
return ApiResponse::problem(
    request: $request,
    status: Response::HTTP_NOT_FOUND,
    code: 'RESOURCE.NOT_FOUND',
    detail: 'Resource not found.',
);
```

Common codes: `REQUEST.INVALID` 400, `AUTH.INVALID_CREDENTIALS` 401, `PARTNER.FORBIDDEN` 403, `RESOURCE.NOT_FOUND` 404, `IDEMPOTENCY.CONFLICT` 409, `VALIDATION.FAILED` 422, `INTERNAL.ERROR` 500/503.

## Validation

FormRequest validation is auto-handled. Use `ApiResponse::validation()` only for manual middleware/handler validation.

## Checklist

- Success code format: `RESOURCE.ACTION_SUCCESS`.
- Problem code is stable and machine-readable.
- Map DTOs/entities to arrays before response.
- External failures return `INTERNAL.ERROR` unless a more specific code exists.
