# {RepositoryName} Test Cases

## Shared Preconditions

- Record `{RECORD-A}`: `{ id: "{ID-A}", {unique_field}: "{value-A}", status: "{state}" }` seeded before each case.
- Remove this section if fewer than 3 cases share this setup.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)* | 1. Call `findById("{ID-A}")`<br>2. Verify: return not null<br>3. Verify: all fields correctly mapped — `{ id: "{ID-A}", {field}: "{value}", ... }`<br>4. Verify DB: no write occurred | Record returned with all fields; no side effect. |
| TC-002 | Not Found / Conflict | High | No record with requested ID in DB. | 1. Call `findById("NON-EXISTENT")`<br>2. Verify: return null or documented not-found result<br>3. Verify DB: no write occurred | Not-found result returned; no state change. |
| TC-003 | Happy Path | High | No record with `{unique_field}: "{new-value}"` in DB. | 1. Call `save({ {unique_field}: "{new-value}", {field}: "{value}" })`<br>2. Verify: return contains generated `id` and all provided fields<br>3. Verify DB: new row created; `createdAt` populated; no other row affected | New record persisted; generated ID returned. |
| TC-004 | Not Found / Conflict | High | *(see Shared Preconditions)*; record with `{unique_field}: "{value-A}"` already exists. | 1. Call `save({ {unique_field}: "{value-A}", {field}: "{other-value}" })`<br>2. Verify: throws `{ConstraintViolationError}` or documented conflict result<br>3. Verify DB: no new row created | Constraint violation returned; no write committed. |
| TC-005 | Happy Path | High | *(see Shared Preconditions)*; `{RECORD-A}` has `{other_field}: "{original-value}"`. | 1. Call `update("{ID-A}", { status: "{new-state}" })`<br>2. Verify: return `status = {new-state}`, `updatedAt` refreshed<br>3. Verify DB: `status = {new-state}`, `updatedAt` refreshed; `{other_field}` unchanged | Only targeted fields updated; unrelated fields preserved. |
| TC-006 | Concurrent Access | High | *(see Shared Preconditions)*; `{RECORD-A}` has `version: 1`. | 1. Call `update("{ID-A}", { status: "{state-1}" }, version: 1)` — first writer commits<br>2. Call `update("{ID-A}", { status: "{state-2}" }, version: 1)` — second writer uses same stale version<br>3. Verify: second call throws `{OptimisticLockError}` or conflict result<br>4. Verify DB: `status = {state-1}`, `version = 2` | First write committed; second write rejected with optimistic lock failure. |
| TC-007 | External Dependency | Medium | DB connection unavailable. | 1. Call any query or command<br>2. Verify: throws connection error or timeout<br>3. Verify DB: no change | Connection error returned; no state change. |

## Open Questions

- Remove this section if there is nothing unresolved.
- Is optimistic locking via `version`, `updated_at`, or another mechanism?
- Does `findAll` support pagination? What is the default limit/ordering?
