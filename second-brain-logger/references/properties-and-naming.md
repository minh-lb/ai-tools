# Naming, Obsidian Properties, and search

## File name and stable identity

Vault-relative path: `Projects/<project-name>/logs/YYYY-MM-DD-HHMMSS-<descriptive-slug>.md`.

- Include short, truthful task topic; lowercase ASCII kebab-case for the filename slug. Preserve Unicode and spaces in the **project folder name**, not in a generated slug.
- Append `-02`, `-03`, etc. on collision **using atomic create-only**. Never replace a different log.
- `log_id` equals the final **filename stem**, including collision suffix. It must not change when the same log is updated.
- One log per substantive work item **and writer/run**; retries in the same run update its log safely, while a different agent/run writes a separate log. `task_id` can match across multiple logs; it is not a unique log identifier.
- Obtain time and UTC offset from a reliable runtime clock. `created` and `date` must agree on local calendar date. If time cannot be determined, report why a log could not be created instead of inventing it.

## Frontmatter contract

All properties are flat YAML (not nested). Keep types stable within the Vault.

| Property | Type | Required | Meaning |
|---|---|---|---|
| `type` | text | yes | `log` |
| `log_id` | text | yes | unique file stem |
| `project` | text | yes | exact project folder name |
| `title` | text | yes | precise work description |
| `date` | date | yes | `YYYY-MM-DD` |
| `created` | datetime | yes | ISO 8601 with known offset |
| `status` | text | yes | `in_progress`, `completed`, `partial`, `failed`, `aborted` |
| `result` | text | yes | `pending`, `success`, `partial`, `failure`, `unverified` |
| `category` | text | yes | `bugfix`, `feature`, `refactor`, `investigation`, `maintenance`, `other` |
| `agent` | text | yes | real runtime name, or `unknown` |
| `autonomous_decisions` | checkbox | yes | `true` only if autonomous decision is recorded |
| `tags` | list of tags | yes | `ai-log` plus up to four grounded topic tags |
| `task_id` | text | optional | actual existing task identifier |
| `session_id` | text | optional | actual writer/run/session identifier |
| `model` | text | optional | actual model identifier |
| `components` | list | optional | modules relevant to diagnosis |
| `files_changed` | list | optional | actual changed repo-relative files |

Omit unknown *optional* fields. Use literal YAML booleans for checkbox values, string values quoted where YAML could interpret punctuation/numbers, and no duplicate keys. List items are simple strings; redact secrets/PII in both Properties and body. Use status `partial` for partially completed work and result `unverified` when success lacks adequate evidence. In-progress notes have `status: in_progress` and `result: pending`.

## Search scope

Use the MCP search API when available, **scope to** `Projects/<project-name>/logs/` and validate returned paths. Match title, symptom, task ID, relevant components and tags. A search result is a candidate, not proof of a correct diagnosis.

For Obsidian native Search, examples (quote multiword values where needed):

- `[type:log] [project:my-backend]`
- `[autonomous_decisions:true]`
- `path:"Projects/my-backend/logs/" redirect`
- `tag:#authentication`

Use full-root Obsidian wikilinks for notes referenced in memory, e.g. `[[Projects/my-backend/logs/2026-10-19-092500-fix-login-redirect]]` (omit `.md`). Short paths relative only to the `logs/` directory can resolve ambiguously in a multi-project Vault.
