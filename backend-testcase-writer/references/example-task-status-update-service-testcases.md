# TaskStatusService Test Cases

## Shared Preconditions

- Task `TASK-1001` exists with `status: in_progress`.
- Task `TASK-1002` exists with `status: done`.
- `ACTOR-OWNER` has `task:write` permission on both tasks.
- `ACTOR-VIEWER` has `task:read` only; no write permission.
- All external dependencies healthy unless otherwise stated.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)* | 1. Call `updateStatus("TASK-1001", "done", ACTOR-OWNER)`<br>2. Verify: return `{ id: "TASK-1001", status: "done", updatedAt: <ts> }`<br>3. Verify DB: `status = done`, `updatedAt` refreshed; `title`, `assignee`, `dueDate` unchanged<br>4. Verify: event `TaskStatusChanged` emitted with `{ taskId: "TASK-1001", from: "in_progress", to: "done" }` | Status updated; return, DB, and event consistent. |
| TC-002 | Business Rule | High | *(see Shared Preconditions)*; `TASK-1002` in `done` — reverse transition disallowed. | 1. Call `updateStatus("TASK-1002", "in_progress", ACTOR-OWNER)`<br>2. Verify: throws `InvalidTransitionError`<br>3. Verify DB: `TASK-1002` still has `status = done`<br>4. Verify: no event emitted | Transition rejected with domain error; no state change. |
| TC-003 | Not Found / Conflict | High | No task with ID `TASK-9999` in DB. | 1. Call `updateStatus("TASK-9999", "done", ACTOR-OWNER)`<br>2. Verify: throws `TaskNotFoundError`<br>3. Verify DB: no write occurred<br>4. Verify: no event emitted | Not-found error returned; no state change. |
| TC-004 | Authorization | High | `ACTOR-VIEWER` has read-only access — no write permission. | 1. Call `updateStatus("TASK-1001", "done", ACTOR-VIEWER)`<br>2. Verify: throws `AuthorizationError`<br>3. Verify DB: no write occurred<br>4. Verify: no event emitted | Authorization error returned; no state change. |
| TC-005 | Input Validation | Medium | *(see Shared Preconditions)* | 1. Call `updateStatus("TASK-1001", "INVALID_STATUS", ACTOR-OWNER)`<br>2. Verify: throws `ValidationError`<br>3. Verify DB: no write occurred<br>4. Verify: no event emitted | Validation error returned; no state change. |
| TC-006 | Business Rule | Medium | `TASK-1001` already has `status: in_progress`. | 1. Call `updateStatus("TASK-1001", "in_progress", ACTOR-OWNER)`<br>2. Verify: returns documented no-op result or `AlreadyInStateError` per contract<br>3. Verify DB: no duplicate write<br>4. Verify: no duplicate event emitted | No-op or documented error; no duplicate write or event. |
| TC-007 | External Dependency | Medium | *(see Shared Preconditions)*; DB unavailable. | 1. Call `updateStatus("TASK-1001", "done", ACTOR-OWNER)`<br>2. Verify: throws `PersistenceError`<br>3. Verify DB: no partial write committed<br>4. Verify: no event emitted — must not fire before persistence commits | Persistence error returned; no partial state; no orphan event. |
| TC-008 | Side Effect Consistency | Medium | *(see Shared Preconditions)* | 1. Call `updateStatus("TASK-1001", "done", ACTOR-OWNER)`<br>2. Note return `status`<br>3. Read `TASK-1001` from DB; note `status`<br>4. Read emitted `TaskStatusChanged`; note `to` field<br>5. Verify: return `status` = DB `status` = event `to` = `"done"` — no divergence | Return value, DB, and event fully consistent. |

## Open Questions

- Is same-status update a no-op, conflict, or `AlreadyInState` result?
- Is event publishing transactional (outbox) or best-effort fire-and-forget?
- Is authorization enforced inside this service or guaranteed by the caller?
