# {ServiceName} Test Cases

## Shared Preconditions

- Entity `{ID-A}` exists with `status: {eligible_state}`.
- Entity `{ID-B}` exists with `status: {ineligible_state}`.
- `ACTOR-OWNER` has `{permission}` on both entities.
- `ACTOR-VIEWER` has read-only access; no write permission.
- Remove this section if fewer than 3 cases share this setup.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)*; all dependencies healthy. | 1. Call `{method}("{ID-A}", "{target_state}", ACTOR-OWNER)`<br>2. Verify: return `{ id: "{ID-A}", status: "{target_state}", updatedAt: <ts> }`<br>3. Verify DB: `status = {target_state}`, `updatedAt` refreshed; other fields unchanged<br>4. Verify: `{EventName}` emitted with `{ entityId: "{ID-A}", from: "{eligible_state}", to: "{target_state}" }` | Status updated; return, DB, and event consistent. |
| TC-002 | Business Rule | High | *(see Shared Preconditions)*; `{ID-B}` in `{ineligible_state}` — reverse transition disallowed. | 1. Call `{method}("{ID-B}", "{eligible_state}", ACTOR-OWNER)`<br>2. Verify: throws `{InvalidTransitionError}` or documented error<br>3. Verify DB: `{ID-B}` state unchanged<br>4. Verify: no event emitted | Transition rejected with domain error; no state change. |
| TC-003 | Not Found / Conflict | High | No entity with requested ID in DB. | 1. Call `{method}("NON-EXISTENT", "{target_state}", ACTOR-OWNER)`<br>2. Verify: throws `{EntityNotFoundError}` or documented not-found result<br>3. Verify DB: no write occurred<br>4. Verify: no event emitted | Not-found error returned; no state change. |
| TC-004 | Authorization | High | `ACTOR-VIEWER` has read-only access — no write permission. | 1. Call `{method}("{ID-A}", "{target_state}", ACTOR-VIEWER)`<br>2. Verify: throws `{AuthorizationError}` or documented forbidden result<br>3. Verify DB: no write occurred<br>4. Verify: no event emitted | Authorization error returned; no state change. |
| TC-005 | External Dependency | Medium | *(see Shared Preconditions)*; DB unavailable. | 1. Call `{method}("{ID-A}", "{target_state}", ACTOR-OWNER)`<br>2. Verify: throws `{PersistenceError}` or documented failure<br>3. Verify DB: no partial write committed<br>4. Verify: no event emitted — must not fire before persistence commits | Persistence error returned; no partial state; no orphan event. |
| TC-006 | Side Effect Consistency | Medium | *(see Shared Preconditions)*; all dependencies healthy. | 1. Call `{method}("{ID-A}", "{target_state}", ACTOR-OWNER)`<br>2. Note return `status`<br>3. Read DB; note persisted `status`<br>4. Read emitted `{EventName}`; note `to` field<br>5. Verify: return `status` = DB `status` = event `to` — no divergence | Return value, DB, and event payload fully consistent. |

## Open Questions

- Remove this section if there is nothing unresolved.
- Is event publishing transactional (outbox) or best-effort fire-and-forget?
- Is authorization enforced inside this service or guaranteed by the caller?
