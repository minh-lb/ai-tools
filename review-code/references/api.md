# API

## Focus

Review whether the change preserves clear, predictable, and compatible contracts between producers and consumers.

## Inspect

- Request and response schemas
- Validation rules, default values, and optional versus required fields
- HTTP status codes, error envelopes, and retry semantics
- Pagination, filtering, sorting, and idempotency behavior
- Auth requirements, rate limits, and tenancy boundaries (for deep auth and access control review, see [Security](security.md); focus here on whether the contract surface exposes the right requirements to consumers)
- Versioning, deprecation, and generated client expectations

## Review Questions

- Does the contract change in a way that can break existing consumers?
- Are validation and error responses consistent with the rest of the API surface?
- Do HTTP response codes match the actual outcome and responsibility of the request?
- Is idempotency defined for operations that may be retried?
- Are new fields safe for older clients and older servers during rollout?
- Does the API leak internal implementation details or sensitive data?

### HTTP Status Code Semantics

Explicitly verify that each reviewed HTTP endpoint uses response codes that match what actually happened:

- `2xx` only when the server successfully completed or intentionally accepted the operation
- `200 OK` for successful reads or writes that return a body
- `201 Created` only when a new resource was created
- `202 Accepted` only when work was accepted asynchronously and is not complete yet
- `204 No Content` only when the operation succeeded and intentionally returns no body
- `206 Partial Content` only when the server is intentionally honoring a range or partial-response contract
- `301` / `302` / `303` / `307` / `308` only when redirect semantics are part of the contract, and the chosen code preserves or changes the HTTP method intentionally
- `304 Not Modified` only for conditional retrievals where the cached representation is still valid
- `400 Bad Request` for malformed syntax or structurally invalid requests
- `408 Request Timeout` when the server timed out waiting for the client to finish sending the request
- `401 Unauthorized` when authentication is missing, expired, or invalid
- `403 Forbidden` when the caller is authenticated but not allowed
- `404 Not Found` when the addressed resource does not exist or is intentionally undiscoverable
- `405 Method Not Allowed` when the route exists but the HTTP method is not supported
- `406 Not Acceptable` when the server cannot produce a representation matching the client's `Accept` contract
- `409 Conflict` when the request is valid but conflicts with current state, uniqueness, versioning, or idempotency expectations
- `410 Gone` when the resource existed before but has been intentionally removed and is not expected to return
- `411 Length Required` when the server requires `Content-Length` and the client omitted it
- `412 Precondition Failed` when explicit request preconditions such as `If-Match`, `If-Unmodified-Since`, or conditional update headers fail
- `413 Content Too Large` when the payload exceeds the accepted size
- `415 Unsupported Media Type` when the request content type is not supported
- `422 Unprocessable Entity` when the payload is syntactically valid but fails domain or validation rules
- `428 Precondition Required` when the server requires a conditional request to avoid lost updates or conflicting writes
- `429 Too Many Requests` when rate limiting or throttling is the reason for rejection
- `431 Request Header Fields Too Large` when headers or cookies exceed accepted limits
- `451 Unavailable For Legal Reasons` when access is intentionally blocked for legal or policy reasons that should be surfaced explicitly
- `501 Not Implemented` when the server does not support the capability or HTTP method at all, as opposed to a known route rejecting a method with `405`
- `502 Bad Gateway` when a gateway or proxy received an invalid response from an upstream dependency
- `503 Service Unavailable` when the service is temporarily overloaded, degraded, or under maintenance
- `504 Gateway Timeout` when a proxy or gateway waited too long for an upstream dependency
- `5xx` only when the server, dependency, or infrastructure failed to fulfill a valid request

When reviewing status codes, check both directions:

- **Overstated success:** endpoint returns `200/201/204` even though the operation partially failed, was ignored, or only queued work
- **Misassigned blame:** endpoint returns `5xx` for user/input/state problems that should be `4xx`, or returns `4xx` for server-side failures the client cannot fix

Also check code/body consistency:

- `204` must not include a response body
- `206` should align with `Range` / partial-content semantics and should not be used for arbitrary partial success
- `304` must not include a new response body for the cached representation
- `202` should describe async tracking or follow-up expectations when relevant
- `408` should reflect client-side send timeout, not generic upstream or server processing slowness
- Redirect codes should preserve or change method intentionally: `307/308` preserve method, while `303` redirects to `GET`
- `405` should usually make the supported methods discoverable, e.g. via `Allow`
- `411` and `431` should point to transport/header-size constraints rather than payload validation semantics
- `503` should usually indicate temporary unavailability and may need retry guidance
- Error envelopes should match the status code meaning instead of saying "success" inside a `4xx/5xx`
- Retry hints should align with the code: retryable `5xx/429` versus non-retryable validation/auth failures

### Common API Scenarios

Use this table as a review aid. It is not a substitute for context, but it should catch many status-code mistakes quickly.

| Scenario | Usually correct code(s) | Review note |
|---|---|---|
| `GET /resource/:id` success | `200` | `404` if not found; avoid `200` with error payload |
| `GET /resource/:id` not found | `404` | Use `403` only when existence must be hidden for authorization reasons |
| `GET` list success | `200` | Empty list is still `200`, not `404` |
| Redirect endpoint, canonical URL move, or auth handoff | `301`, `302`, `303`, `307`, or `308` | Review whether the chosen redirect intentionally preserves or changes method/body semantics |
| Conditional `GET` unchanged (`If-None-Match`, `If-Modified-Since`) | `304` | Do not return a full `200` body if the cache contract says unchanged |
| `POST` create success | `201` | Prefer `200` only when not actually creating a new resource |
| `POST` accepted for async processing | `202` | Do not return `201` if creation has not happened yet |
| `PUT` full update success | `200` or `204` | `201` only if the API truly supports create-on-put and a new resource was created |
| `PATCH` partial update success | `200` or `204` | `200` if returning updated representation, `204` if no body |
| `DELETE` success | `204` or `200` | `200` only when returning confirmation payload/body |
| `DELETE` or `GET` for intentionally retired resource | `410` | Prefer `410` over `404` when the API deliberately signals permanent removal |
| Validation failure | `422` or sometimes `400` | Be consistent across equivalent validation cases; `422` is often clearer for domain/input validation |
| Malformed JSON / invalid syntax | `400` | This is a request-format problem, not a domain validation problem |
| Missing auth token / invalid token | `401` | If token expired or malformed, still `401` |
| Authenticated but lacks permission | `403` | Do not use `401` when identity is known but forbidden |
| Existing route, unsupported HTTP verb | `405` | `404` hides route existence; use it only when that is intentional |
| `Accept` asks for an unsupported representation | `406` | Review whether the API actually negotiates content or should ignore `Accept` consistently |
| Client took too long to finish request upload/send | `408` | Distinguish client send timeout from upstream/server processing timeout |
| Duplicate create / uniqueness conflict | `409` | Avoid `500`; client can often correct and retry with different state |
| Missing required `Content-Length` in a constrained upload/proxy path | `411` | Use only when length framing really is required by the endpoint or infrastructure |
| Version conflict / optimistic lock fail | `409` or `412` | `412` when tied to explicit precondition headers; otherwise `409` |
| Conditional write required but missing (`If-Match` mandatory) | `428` | Useful when the API intentionally forces optimistic concurrency discipline |
| Rate limit hit | `429` | Include retry guidance when available |
| Headers or cookies exceed accepted size | `431` | More truthful than generic `400` when header size is the real issue |
| Business-rule rejection | `409` or `422` | `409` for state conflict, `422` for semantically invalid action/payload |
| Login success | `200` | `204` only if intentionally returning no body/tokens in body |
| Login failure due to bad credentials | `401` | Avoid `403`; caller is not authenticated yet |
| Refresh token invalid/expired | `401` | Expired or revoked credentials are auth failures |
| Logout success | `204` or `200` | `204` is common when no payload is needed |
| File upload success | `201` or `200` | `413` for oversized payload, `415` for unsupported media type |
| Request body too large | `413` | Do not downgrade this to generic `400` if size policy is the real reason |
| Wrong `Content-Type` for endpoint | `415` | Distinguish unsupported media type from bad payload contents |
| Range download success | `206` | Use only when partial content was actually requested and honored |
| Download with full content | `200` | `206` when honoring `Range` requests |
| Download with invalid range | `416` | Do not silently return full content if range contract matters |
| Payment/charge accepted for async settlement | `202` | `200/201` only if the charge/result is already finalized |
| Payment rejected due to business or state conflict | `409` or `422` | Avoid `500` for expected declines/rejections |
| Webhook received and queued | `202` | Use `200/204` only if processing is effectively complete at receipt time |
| Webhook signature invalid | `401` or `403` | Pick one convention and apply consistently; review whether the meaning matches auth vs permission style |
| Idempotent replay with same result | `200`, `201`, or `204` | Review whether repeated calls remain contract-safe and deterministic |
| Feature/method truly unsupported by this server capability | `501` | Distinguish unsupported capability from route-level `405` |
| Resource intentionally blocked for legal/policy reasons | `451` | Prefer explicit legal/policy signaling over vague `403/404` when the contract calls for transparency |
| Upstream returned invalid response to gateway/proxy | `502` | Distinguish invalid upstream response from timeout (`504`) and local overload (`503`) |
| Service overloaded / maintenance window | `503` | Distinguish temporary unavailability from generic `500` |
| Gateway or upstream timeout | `504` | Use when the server role is gateway/proxy and upstream timed out |
| Dependency outage / DB unavailable / upstream timeout | `5xx` | Usually `502`, `503`, or `504` when the failure source is known |

Reviewer heuristics for this table:

- `404` versus empty collection: missing single resource is `404`; empty search/list result is normally `200` with an empty array/object.
- `401` versus `403`: `401` means "you are not authenticated"; `403` means "you are authenticated but not allowed."
- Redirect family: `301/308` are permanent; `302/307` are temporary; `303` intentionally converts follow-up to `GET`.
- `404` versus `410`: `404` says "not found"; `410` says "intentionally gone and expected to stay gone."
- `405` versus `501`: `405` means the route exists but rejects that method; `501` means the server capability/method is not implemented at all.
- `409` versus `422`: `409` is about current state conflict; `422` is about semantically invalid input or action.
- `409` versus `412` versus `428`: `409` is general state conflict, `412` is failed explicit precondition, `428` is missing required precondition.
- `202` versus `200/201`: `202` means work is not done yet. If the client can already rely on the final state, `200`/`201` is usually more truthful.
- `204` versus `200`: use `204` only when the API intentionally returns no body. A JSON payload with `204` is a protocol smell and should be flagged.
- `200` versus `206`: `206` is for real partial-content contracts, not for "some sub-steps succeeded."
- `400` versus `408` versus `411` versus `431`: malformed request is `400`; client send timeout is `408`; missing required length is `411`; oversized headers/cookies are `431`.
- `400` versus `413` versus `415`: malformed request is `400`; too large is `413`; wrong media type is `415`.
- `403/404` versus `451`: use `451` only when the API intentionally exposes legal/policy blocking as part of the contract.
- `500` versus `502` versus `503` versus `504`: generic internal failure is `500`; invalid upstream response is `502`; temporary service unavailability is `503`; upstream timeout through a gateway/proxy is `504`.

## Red Flags

- Silent response shape changes without versioning or compatibility plan (if the concern extends to queue payloads, serialized jobs, or mixed-version deployments, see [Backward Compatibility](backward-compatibility.md) — raise one combined finding scoped to the broadest affected surface)
- New required fields added to existing endpoints without phased rollout
- Inconsistent status codes for similar failure modes
- `200 OK` returned for validation failures, missing resources, or rejected business operations
- `201 Created` used for upsert/update/no-op flows that do not actually create a resource
- `202 Accepted` used even though the server completed the work synchronously, or `200` used even though work is only queued
- `204 No Content` returned with a JSON body, or used when consumers need a response payload
- `206 Partial Content` used for arbitrary partial success instead of actual range/partial-content behavior
- `304 Not Modified` used outside conditional retrieval semantics, or returned with a full response body
- `408` used for generic slow server processing or upstream slowness instead of actual client-side request timeout
- `401` and `403` swapped, causing clients to mis-handle auth versus authorization
- Redirect codes (`302`/`303`/`307`/`308`) used interchangeably even though method-preservation semantics differ
- `405 Method Not Allowed` hidden behind a generic `404` or `400` even though the route exists and method handling matters to consumers
- `410 Gone` not used when the contract intentionally signals permanent removal, or overused when the resource state is actually unknown
- `411` and `431` collapsed into generic `400`, hiding framing or header-size constraints that clients could act on
- `412 Precondition Failed` and `428 Precondition Required` ignored in APIs that rely on ETags/version headers for safe concurrent updates
- `413` and `415` collapsed into generic `400`, obscuring whether the problem is size policy or media type
- `451` hidden behind vague `403/404` when legal or policy blocking is an explicit contract concern
- `501` confused with `405`, masking whether the issue is route-level method handling or server capability support
- `500` used for expected domain conflicts, invalid input, or missing resources that clients could correct
- `502` flattened into generic `500`, hiding that the failure came from an invalid upstream response through a gateway/proxy
- `503` and `504` flattened into generic `500`, hiding retryability and upstream/dependency failure mode
- `422` and `400` used inconsistently across equivalent validation failures
- Missing idempotency guard on create, payment, or enqueue operations (if the gap is at the implementation layer — missing deduplication logic, race in queue consumer — see [Concurrency](concurrency.md); raise one finding scoped to where the fix lives)
- Pagination that is unstable under concurrent writes
- Internal errors or stack traces returned to consumers

## Evidence

An API finding should connect:

- The contract surface that changed
- The exact HTTP code and why its meaning does or does not match the actual outcome
- The consumer behavior that will break or degrade
- The rollout or runtime condition that makes it realistic

## Remediation Direction

- Preserve compatibility or version the change explicitly
- Keep request validation and error semantics stable
- Use the narrowest HTTP status code that truthfully describes the outcome and actor responsibility
- Add idempotency keys or server-side deduplication where retries are expected
- Update contract tests and API documentation with the behavioral change
