# Coding Rules: API Design

> Language-agnostic. Applies to any HTTP API surface (REST controllers, route handlers, API resources) regardless of framework.

## 0. Naming and URL conventions

- URLs are noun-based resource paths, plural for collections: `/orders`, `/orders/{id}`, `/orders/{id}/items` — not verbs in the path (`/getOrders`, `/createOrder`).
- HTTP method carries the verb: `GET` read, `POST` create, `PUT`/`PATCH` update, `DELETE` remove. An action that doesn't map to CRUD is a sub-resource or a nested verb-noun, not a query-string flag: `POST /orders/{id}/cancel`, not `POST /orders/{id}?action=cancel`.
- Path segments and query params: kebab-case or lowercase (`/order-items`, `?sort_by=` or `?sortBy=` — pick one convention and apply it consistently across the whole API, don't mix per endpoint).
- Nesting reflects real ownership, not arbitrary depth: `/orders/{id}/items` is fine; `/customers/{id}/orders/{id}/items/{id}/history` is a sign to flatten or introduce a dedicated resource.
- IDs in paths are stable identifiers (numeric ID, UUID, slug) — never mutable, PII-bearing, or internal-only values (email, sequential DB row exposed as-is when that leaks ordering/volume).
- JSON body/response keys use one consistent case convention (`camelCase` or `snake_case`) for the whole API — don't mix per endpoint or per nesting level.
- Boolean fields and query flags read as a predicate (`isActive`, `hasItems`, `?includeDeleted=true`), not ambiguous nouns (`active`, `deleted`).

## 1. Contract stability

- Never change a response shape, field type, or field meaning on an existing endpoint without versioning or an explicit compatibility plan. Additive fields are safe; renamed/removed/retyped fields are not.
- New fields on existing endpoints: optional with a safe default, not required — old clients must keep working unmodified.
- Preserve request validation rules and error-response shape consistently across an API surface; don't invent a one-off error format for a single endpoint.
- Don't leak internal implementation details (stack traces, internal IDs, internal error messages) in responses.
- Error responses use one consistent envelope across the whole API surface: a machine-readable `code`, a human-readable `message`, and an optional `details`/`errors` array for field-level validation failures. Don't return bare strings, inconsistent key names (`error` vs `message` vs `msg`), or a shape that differs per endpoint.

## 2. HTTP status codes — use the narrowest one that's actually true

Pick the code that matches both the outcome and who's responsible (client vs server), not just "closest 2xx/4xx/5xx that renders correctly."

| Case | Code | Notes |
|---|---|---|
| `GET` resource found | `200` | `404` if missing — never `200` with an error payload |
| `GET` list, including empty | `200` | Empty list is still `200`, not `404` |
| `POST` creates a resource | `201` | `200` only if nothing was actually created |
| `POST`/work accepted but not finished yet | `202` | Don't return `201`/`200` before the work is actually done |
| `PUT` full replace | `200` (body) or `204` (no body) | `201` only if create-on-put actually created something |
| `PATCH` partial update | `200` (body) or `204` (no body) | |
| `DELETE` | `204` (no body) or `200` (confirmation body) | |
| Resource permanently retired | `410` | Prefer over `404` when removal is intentional and permanent |
| Validation failure (semantically invalid input) | `422` | Keep consistent with `400` usage across the API |
| Malformed syntax (bad JSON, etc.) | `400` | Request-format problem, not domain validation |
| Missing/invalid/expired auth | `401` | Identity itself is the problem |
| Authenticated but not permitted | `403` | Never `401` here — identity is known |
| Route exists, method unsupported | `405` | Include `Allow` header with supported methods |
| State conflict (uniqueness, version) | `409` | |
| Failed explicit precondition (`If-Match`, etc.) | `412` | |
| Required precondition missing | `428` | |
| Rate limited | `429` | Include `Retry-After` header |
| Conditional `GET` unchanged | `304` | No body; requires `ETag`/`Last-Modified` support |
| `Accept` cannot be satisfied | `406` | Only relevant if the endpoint actually negotiates representations |
| Redirect | `301`/`302`/`303`/`307`/`308` | `301`/`308` permanent, `302`/`307` temporary; `307`/`308` preserve method+body, `303` forces `GET`, `301`/`302` are ambiguous on method — pick deliberately |
| Payload too large | `413` | Don't collapse into generic `400` |
| Unsupported content type | `415` | Don't collapse into generic `400` |
| Capability not implemented at all | `501` | Distinct from `405` (route exists, wrong method) |
| Upstream/dependency failure via gateway | `502`/`503`/`504` | Distinguish invalid response / overload / timeout — don't flatten to generic `500` |

Rules of thumb:
- `401` = "who are you," `403` = "I know who you are, you can't do this."
- `404` vs `410`: unknown vs intentionally-and-permanently gone.
- `409` vs `422`: conflict with current state vs semantically invalid input/action.
- `202` vs `200`/`201`: work not finished yet vs client can rely on final state now.
- `204` must never carry a JSON body. `206` is only for real `Range` semantics, never "partial success."

## 3. Idempotency

- `PUT`/`DELETE` must be idempotent: repeating the same request produces the same end state, not duplicate side effects.
- Create/payment/enqueue endpoints that may be retried by the client (timeouts, at-least-once delivery) need an idempotency key or server-side dedup — don't rely on the caller never retrying.

## 4. Auth, tenancy, rate limiting

- Every query that reads/writes tenant- or owner-scoped data MUST be scoped server-side (current user/tenant ID applied in the query itself), never by trusting a client-supplied ID with no ownership check. A resource ID in the URL/body is not authorization.
- Public-facing endpoints (and any endpoint doing expensive work — search, export, auth attempts) MUST have rate limiting. Don't ship a new public endpoint with no limit and add one later "if it becomes a problem."
- `429`/`503` responses SHOULD include a `Retry-After` header (or equivalent field in the error envelope) so clients can back off correctly instead of hammering immediately.

## 5. Conditional requests / caching

- Cacheable `GET` endpoints SHOULD support `ETag`/`Last-Modified` and honor `If-None-Match`/`If-Modified-Since` with `304` — don't recompute and return a full `200` body when the client's cached copy is still valid.
- `304` responses MUST NOT include a body.

## 6. Pagination, filtering, sorting

- Any list endpoint returning unbounded data must paginate. Default and max page-size limits, not "return everything."
- Cursor-based pagination for data that mutates concurrently; offset-based pagination is unstable under concurrent writes and should be flagged when used for such data.
- Filtering/sorting parameters are validated the same way as any other input — reject unknown/invalid values explicitly rather than silently ignoring them.

## 7. Versioning and deprecation

- Breaking change to a public/consumed endpoint → new version (path, header, or media-type versioning per project convention), not an in-place mutation of the old contract.
- Deprecating a field/endpoint: mark it deprecated in docs/schema first, keep it functional through a stated window, then remove — don't delete without a transition period for external consumers.

## Anti-patterns (MUST NOT)

- `200`/`201`/`204` returned when the operation actually failed, was rejected, or was only queued.
- `500` used for expected domain conditions (validation failure, missing resource, business-rule conflict) that the client can correct.
- `401`/`403` swapped.
- New required field added to an existing endpoint's request or response.
- List endpoint with no pagination limit.
- Retryable operation (payment, create, enqueue) with no idempotency key or dedup.
- Tenant/owner-scoped query filtered only by a client-supplied ID with no server-side ownership check.
- New public or expensive endpoint shipped with no rate limiting.
- Error response shape that differs endpoint-to-endpoint (bare string here, `{error}` there, `{code,message}` elsewhere).
- `304` response with a body, or a cacheable `GET` that never returns `304` because `ETag`/conditional headers aren't implemented.
