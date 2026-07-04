# {Endpoint} Test Cases

## Shared Preconditions

- Resource `{ID-A}` exists with `status: {state}`, owned by `USER-A`.
- USER-A token: obtained via `POST /auth/login` with USER-A credentials; has `{scope}` scope.
- USER-B token: obtained via `POST /auth/login` with USER-B credentials; no permission on this resource.
- Remove this section if fewer than 3 cases share this setup.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)* | 1. Send `{METHOD} /{path}` with `Authorization: Bearer <USER-A-token>` and valid payload<br>2. Verify: response status `200`/`201`<br>3. Verify: response body `{ field: "value", ... }`<br>4. Verify DB: record persisted with correct fields<br>5. Verify: `{EventName}` emitted with correct payload | Request succeeds; state persisted; side effects triggered. |
| TC-002 | Input Validation | High | USER-A token available. | 1. Send `{METHOD} /{path}` with `Authorization: Bearer <USER-A-token>` and payload missing `{required_field}`<br>2. Verify: response status `400`/`422`<br>3. Verify: response body identifies `{required_field}` as offending field<br>4. Verify DB: no write occurred | Request rejected; no state change. |
| TC-003 | Authorization | High | No authentication token. | 1. Send `{METHOD} /{path}` without `Authorization` header<br>2. Verify: response status `401`<br>3. Verify: response body contains unauthenticated error code<br>4. Verify DB: no read or write occurred | Request rejected with 401; no data access. |
| TC-004 | Authorization | High | USER-B token: obtained via `POST /auth/login`; no ownership of `{ID-A}`. | 1. Send `{METHOD} /{path}` with `Authorization: Bearer <USER-B-token>` and valid payload<br>2. Verify: response status `403`<br>3. Verify: response body contains forbidden error code<br>4. Verify DB: no write occurred | Request rejected with 403; resource state unchanged. |
| TC-005 | Not Found / Conflict | High | USER-A token available. No resource with requested ID exists in DB. | 1. Send `{METHOD} /{path}/{non-existent-id}` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `404`<br>3. Verify: response body contains not-found error code<br>4. Verify DB: no write occurred | Request rejected with 404; no state change. |
| TC-006 | Business Rule | High | *(see Shared Preconditions)* — resource `{ID-A}` is in a state that disallows this operation. | 1. Send `{METHOD} /{path}/{ID-A}` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `409`/`422`<br>3. Verify: response body contains documented error code<br>4. Verify DB: no write occurred | Request rejected with business rule error; no state change. |
| TC-007 | Side Effect Consistency | Medium | *(see Shared Preconditions)* | 1. Send `{METHOD} /{path}` with `Authorization: Bearer <USER-A-token>` and valid payload<br>2. Verify: response status `200`/`201`<br>3. Read persisted record from DB; compare fields with response body<br>4. Verify: `{EventName}` payload fields match response body — no divergence | Response, DB state, and event payload all reflect the same final state. |
| TC-008 | External Dependency | Medium | DB unavailable. USER-A token available. | 1. Send `{METHOD} /{path}` with `Authorization: Bearer <USER-A-token>` and valid payload<br>2. Verify: response status `500`/`503`<br>3. Verify DB: no partial write occurred<br>4. Verify: no event emitted | Request fails with server error; no state change. |

## Open Questions

- Remove this section if there is nothing unresolved.
- What HTTP status for invalid state transitions — `409` or `422`?
- Are there rate limits on this endpoint?
