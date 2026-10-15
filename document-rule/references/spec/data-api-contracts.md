# Data Contracts and API Specifications

## When to include them

Include an API/schema only when the document specifies an interface or the change clearly depends on that contract. If the user asks only for business rules, avoid unnecessary DTO details.

## API checklist

1. Method, path, caller, authentication/authorization.
2. Request: field, type, required, nullable, validation, format, and default (if any).
3. Success: HTTP status, schema/fields, and side effects.
4. Error: HTTP status, domain code, schema, and side effects.
5. Retry/idempotency, pagination/filter/sort/rate limits **only when relevant**.
6. Backwards compatibility/deprecation when modifying a contract already in use.

## Data checklist

- Entity ID, field/type, nullability, state, and invariants.
- For mutations: which fields **change**, which do **not**, and when the change commits; derived fields/events when relevant.
- For reads: source and consistency/visibility when required by the behavior.
- Field names, error codes, and enums must be consistent across the Specification, examples, and acceptance criteria.

Do **not** choose `401/403/404/409`, UUIDs, timestamp formats, database indexes, or JSON schemas without verifying the existing system. Label fictional examples; when a material decision is missing, record an `Open Question`.

Use the [API Specification template](../../templates/spec/api-spec.md).
