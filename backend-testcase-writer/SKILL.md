---
name: backend-testcase-writer
description: Write detailed backend testcase documents for API endpoints, services, repositories, and workers/consumers in any backend project.
argument-hint: <target — endpoint, service, repository, or worker>
---

# Backend Testcase Writer

Create a backend testcase document for `$ARGUMENTS`. Do not write test code unless explicitly asked.

If `$ARGUMENTS` is ambiguous, read the codebase to derive scope; if still unclear, ask one targeted question. Never invent behavior not grounded in code, spec, or explicit requirement.

## Layer Identification

| Layer | Signals |
| --- | --- |
| **API** | endpoint, route, handler, controller, HTTP method, REST, GraphQL, RPC |
| **Service** | service, use case, domain logic, orchestration, command handler |
| **Repository** | repository, store, DAO, persistence, query builder, data adapter |
| **Worker** | queue consumer, cron job, event handler, background job, message processor |

Multi-layer targets: one `## {Layer}` section per layer; do not mix column sets.

## 8 Categories

Use these names verbatim in the `Category` field of every case.

| Category | Covers |
| --- | --- |
| **Happy Path** | Success flow; valid input; all dependencies healthy |
| **Input Validation** | Schema, type, format, range, required-field checks |
| **Authorization** | Who can act; who is explicitly denied |
| **Business Rule** | Domain constraints, state transitions, invariants |
| **Not Found / Conflict** | Missing resource, duplicate key, version mismatch |
| **Concurrent Access** | Parallel writes, optimistic lock failures, duplicate delivery |
| **External Dependency** | DB timeout, third-party failure, broker down |
| **Side Effect Consistency** | Events, emails, audit logs, downstream state |

### Applicability by Layer

| Category | API | Service | Repository | Worker |
| --- | --- | --- | --- | --- |
| Happy Path | ✓ | ✓ | ✓ | ✓ |
| Input Validation | ✓ | ✓ | — | ✓ |
| Authorization | ✓ | ✓ | — | — |
| Business Rule | — | ✓ | — | ✓ |
| Not Found / Conflict | ✓ | ✓ | ✓ | ✓ |
| Concurrent Access | — | — | ✓ | ✓ |
| External Dependency | — | ✓ | ✓ | ✓ |
| Side Effect Consistency | ✓ | ✓ | — | ✓ |

## Priority

| Priority | When |
| --- | --- |
| **High** | Data loss, wrong business outcome, security breach, or main flow blocked |
| **Medium** | Degraded UX or incorrect response; no integrity risk |
| **Low** | Defensive edge case or cosmetic correctness |

## Workflow

1. Identify layer → read the matching template:
   - API → `templates/api-testcase.template.md`
   - Service → `templates/service-testcase.template.md`
   - Repository → `templates/repo-testcase.template.md`
   - Worker → `templates/worker-testcase.template.md`
2. Read minimum sources: spec/requirement → relevant code → API schema/contract → README. Stop when all applicable categories are coverable. Reference only paths that exist.
3. Write one case per behavior starting from Happy Path. Follow the template structure. Preconditions must state HOW to obtain tokens/roles/seed data, not just who the caller is.
4. Unconfirmed behavior → `## Open Questions`. Never guess.
5. Check the Quality Bar before writing the file.

## Mandatory Cases by Layer

Skip only if the feature provably does not apply; note the skip in `## Open Questions`.

### API
- One case per HTTP method
- Missing required field + invalid type
- Unauthenticated (401) + forbidden (403) if auth exists
- One case per documented error status (400, 404, 409, 422, 500)
- Side Effect Consistency case if downstream work is triggered

### Service
- Valid + invalid case per documented state transition
- External Dependency failure for each external system called
- Idempotency case if documented as idempotent
- Side Effect Consistency if events or downstream work are emitted
- Case where persistence succeeds but event publishing fails, if both in scope

### Repository
- Not Found for every query by ID or unique key
- Constraint violation for every unique field
- Concurrent Access / optimistic lock failure for every update
- Transaction rollback if the operation spans multiple writes
- External Dependency failure (DB down or timeout)

### Worker
- Malformed message / invalid payload
- Duplicate message delivery (idempotency)
- Retry exhaustion → dead-letter
- External Dependency failure for each system called
- Side Effect Consistency: output matches consumed input

## Output

**Location:** existing convention (`docs/testcases/`, `test/docs/`, `tests/specs/`); default `docs/testcases/{slug}.md`.

**Slug:** `{feature}-{layer}-testcases.md`

### Table Format

All layers use one unified column set:

`| ID | Category | Priority | Preconditions | Steps | Expected Result |`

- **Preconditions** — key state before execution. Auth entries must state HOW to obtain credentials, e.g. `USER-A token via POST /auth/login`.
- **Steps** — numbered, executable. Use `<br>` for line breaks. Action verbs for do-steps (`Send`, `Call`, `Insert`); `Verify:` prefix for check-steps.
- **Expected Result** — one-sentence aggregate outcome.
- **IDs** — sequential per file (`TC-001`, `TC-002`…), stable, do not renumber.
- **Shared Preconditions** section — include when ≥3 cases share identical setup; omit otherwise.

## Quality Bar

- Every Step is executable without asking for more context
- Auth Preconditions specify HOW to obtain the required token or role
- All mandatory cases present, or absences documented in Open Questions
- No duplicates: same trigger + same setup + same expected
- Category uses only the 8 standard names verbatim
