# <Endpoint / API Group> — API Specification

> **Status:** Draft | **Source/Version:** <...>

## Purpose & Scope

<What capability, who uses it, what is excluded.>

## Endpoint

- Method & path: `<METHOD /path>`
- Auth/permission: <...>
- Content type / headers: <only required headers>

## Request Contract

| Field | Type | Required | Nullable | Validation |
|---|---|---|---|---|
| <field> | <type> | Yes/No | Yes/No | <constraints> |

## Success Response

- Status: `<status>`
- Fields: <names, types, meanings>

```json
{"example":"replace with valid verified or illustrative payload"}
```

## Error Contract

| Condition | HTTP | Domain code | Response / side effect |
|---|---|---|---|
| <invalid case> | <status> | <code> | <...> |

## Semantics (nếu liên quan)

<Idempotency, retry, ordering, consistency, versioning, deprecation.>

## Acceptance / Contract Tests

| AC | Given / When / Then |
|---|---|
| AC-001 | <...> |

## Open Questions (nếu còn)

- <...>
