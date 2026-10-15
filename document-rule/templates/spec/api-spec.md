---
id: "<unique-task-id-or-uuid>"
title: "<Endpoint or API group> — API Specification"
type: api-specification
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Endpoint / API Group> — API Specification

> **Document status:** `draft` | **Source/Version:** <...>

## Purpose and Scope

<What capability, who uses it, and what is excluded.>

## Endpoint

- Method and path: `<METHOD /path>`
- Auth/permission: <...>
- Content type / headers: <only required headers>

## Request Contract

| Field | Type | Required | Nullable | Validation |
|---|---|---|---|---|
| <field> | <type> | Yes/No | Yes/No | <constraints> |

## Success Response

- HTTP status: `<status>`
- Fields: <names, types, meanings>

```json
{"example":"replace with a valid verified or clearly illustrative payload"}
```

## Error Contract

| Condition | HTTP | Domain code | Response / side effect |
|---|---|---|---|
| <invalid case> | <status> | <code> | <...> |

## Semantics (if relevant)

<Idempotency, retry, ordering, consistency, versioning, deprecation.>

## Acceptance / Contract Tests

| AC | Given / When / Then |
|---|---|
| AC-001 | <...> |

## Open Questions (if any)

- <...>
