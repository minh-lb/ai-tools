# POST /tasks/{id}/complete Test Cases

## Shared Preconditions

- Task `TASK-1001` exists with `status: in_progress`, owned by `USER-A`.
- Task `TASK-1002` exists with `status: done`, owned by `USER-A`.
- USER-A token: obtained via `POST /auth/login` with USER-A credentials; has `task:write` scope.
- USER-B token: obtained via `POST /auth/login` with USER-B credentials; has `task:write` scope but does not own `TASK-1001`.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)* | 1. Send `POST /tasks/TASK-1001/complete` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `200`<br>3. Verify: response body `{ "id": "TASK-1001", "status": "done", "completedAt": "<timestamp>" }`<br>4. Verify DB: `status = done`, `completedAt` populated<br>5. Verify: event `task.completed` emitted with `{ "taskId": "TASK-1001", "status": "done" }` | Task marked done; response, DB, and event consistent. |
| TC-002 | Authorization | High | No authentication token. | 1. Send `POST /tasks/TASK-1001/complete` without `Authorization` header<br>2. Verify: response status `401`<br>3. Verify: response body contains `code: "UNAUTHENTICATED"`<br>4. Verify DB: no read or write on `TASK-1001` | Request rejected with 401; no data access. |
| TC-003 | Authorization | High | USER-B token: obtained via `POST /auth/login` with USER-B credentials; USER-B does not own `TASK-1001`. | 1. Send `POST /tasks/TASK-1001/complete` with `Authorization: Bearer <USER-B-token>`<br>2. Verify: response status `403`<br>3. Verify: response body contains `code: "FORBIDDEN"`<br>4. Verify DB: no write on `TASK-1001`<br>5. Verify: no event emitted | Request rejected with 403; task state unchanged. |
| TC-004 | Not Found / Conflict | High | USER-A token available. No task with ID `TASK-9999` in DB. | 1. Send `POST /tasks/TASK-9999/complete` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `404`<br>3. Verify: response body contains `code: "NOT_FOUND"`<br>4. Verify DB: no write occurred | Request rejected with 404; no state change. |
| TC-005 | Business Rule | High | *(see Shared Preconditions)*; `TASK-1002` already has `status: done`. | 1. Send `POST /tasks/TASK-1002/complete` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `409`<br>3. Verify: response body contains `code: "INVALID_TRANSITION"` with `from: "done"`<br>4. Verify DB: no write on `TASK-1002`<br>5. Verify: no event emitted | Request rejected with 409; no state change; no duplicate event. |
| TC-006 | Side Effect Consistency | Medium | *(see Shared Preconditions)* | 1. Send `POST /tasks/TASK-1001/complete` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `200`<br>3. Read task `TASK-1001` from DB; compare `status` and `completedAt` with response body<br>4. Read emitted `task.completed` event; verify `status` and `taskId` match response body — no field divergence | Response, DB, and event all reflect the same final state. |
| TC-007 | External Dependency | Medium | DB unavailable. USER-A token available. | 1. Send `POST /tasks/TASK-1001/complete` with `Authorization: Bearer <USER-A-token>`<br>2. Verify: response status `503`<br>3. Verify DB: no partial write occurred<br>4. Verify: no event emitted | Request fails with server error; no state change. |

## Open Questions

- Does this endpoint accept a request body, or is it a parameterless trigger?
- HTTP status for invalid state transition — `409` or `422`?
- Is `task.completed` synchronous (before response) or asynchronous?
