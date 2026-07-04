# {WorkerName} Test Cases

## Shared Preconditions

- Queue/topic `{queue-name}` available.
- Entity `{ID-A}` exists with `status: {eligible_state}` in DB.
- Idempotency store empty unless stated otherwise.
- Remove this section if fewer than 3 cases share this setup.

## Test Cases

| ID | Category | Priority | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Happy Path | High | *(see Shared Preconditions)*; all dependencies healthy. | 1. Publish `{ id: "{MSG-1}", entityId: "{ID-A}", action: "{action}", ... }` to `{queue-name}`<br>2. Verify: message consumed and acked<br>3. Verify DB: `{ID-A}` updated — `{field} = {expected-value}`<br>4. Verify: downstream `{event}` emitted with correct payload<br>5. Verify: idempotency key for `{MSG-1}` recorded | Message processed; DB updated; side effects triggered; ack committed. |
| TC-002 | Input Validation | High | *(see Shared Preconditions)* | 1. Publish message with `{required_field}` omitted to `{queue-name}`<br>2. Verify: worker rejects message without processing<br>3. Verify DB: no write occurred<br>4. Verify: no downstream action triggered<br>5. Verify: message routed to dead-letter immediately (no retry for schema errors) | Invalid message dead-lettered; no state change. |
| TC-003 | Concurrent Access | High | *(see Shared Preconditions)*; `{MSG-1}` already processed; idempotency key stored. | 1. Publish second copy of `{ id: "{MSG-1}", entityId: "{ID-A}", ... }` to `{queue-name}`<br>2. Verify: worker detects duplicate via idempotency key<br>3. Verify DB: no additional write<br>4. Verify: no additional downstream action triggered<br>5. Verify: ack committed (not requeued) | Duplicate skipped; original outcome preserved; no duplication. |
| TC-004 | Not Found / Conflict | High | No entity with `entityId` from message exists in DB. | 1. Publish `{ id: "{MSG-2}", entityId: "NON-EXISTENT", ... }` to `{queue-name}`<br>2. Verify: worker fails with not-found error<br>3. Verify DB: no write occurred<br>4. Verify: message retried N times then dead-lettered | Message dead-lettered after retries; no state change. |
| TC-005 | External Dependency | Medium | Dependency fails for first 2 attempts; recovers on 3rd. | 1. Publish valid message to `{queue-name}`<br>2. Verify: worker retries with backoff on failures<br>3. Verify: success on 3rd attempt<br>4. Verify DB: entity updated correctly<br>5. Verify: ack committed after successful attempt | Worker retries and succeeds on recovery; no duplicate side effects. |
| TC-006 | External Dependency | Medium | Dependency remains unavailable for all retry attempts. | 1. Publish valid message to `{queue-name}`<br>2. Verify: worker retries exactly `{max_retries}` times<br>3. Verify: message routed to dead-letter after exhaustion<br>4. Verify DB: no write committed | Message dead-lettered; no partial state. |
| TC-007 | Side Effect Consistency | Medium | *(see Shared Preconditions)*; all dependencies healthy. | 1. Publish `{ id: "{MSG-3}", entityId: "{ID-A}", {field}: "{value}" }` to `{queue-name}`<br>2. Verify: message processed and acked<br>3. Read downstream event payload<br>4. Verify: event `{field}` matches message `{field}`; event `entityId` matches message `entityId` | Event payload consistent with consumed message; no field divergence. |

## Open Questions

- Remove this section if there is nothing unresolved.
- Max retry count and backoff strategy before dead-lettering?
- Idempotency enforced via DB, cache, or message metadata?
- Worker commits offset before or after processing completes?
