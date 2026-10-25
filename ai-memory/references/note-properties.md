# Note templates and properties

Use these templates when creating notes:

| Note | Template | `note_type` |
|---|---|---|
| `CONTEXT.md` | [Context](../templates/context.md) | `context` |
| `CURRENT.md` | [Current work](../templates/current.md) | `current` |
| `DECISIONS.md` | [Decisions](../templates/decisions.md) | `decisions` |
| `WorkLogs/YYYY/MM/DD/<short-description>.md` | [WorkLog](../templates/worklog.md) | `worklog` |

## Required properties

Every new note has these YAML frontmatter properties:

| Property | Value |
|---|---|
| `project_id` | Stable identity from project config; must match before using or editing the note. |
| `project_name` | Folder name from project config. |
| `note_type` | One of the values in the template table. |
| `title` | Short human-readable title. |
| `created_at` | Original creation timestamp in ISO 8601 format with timezone offset or `Z`. |
| `updated_at` | Last edit timestamp in the same format; initially equals `created_at`. |
| `status` | `active` for context/decisions; `in-progress`, `blocked`, or `completed` for current/worklog. |

Additional required properties by note type:

| Note | Property | Value |
|---|---|---|
| Current, WorkLog | `event_id` | UUID of the checkpoint, decision, or completion represented by the note. CURRENT points to the latest saved event. |
| Current | `event_created_at` | Original `created_at` of the linked WorkLog, with timezone. Used to order events; CURRENT's own `created_at` is the file's creation time. |
| Current, WorkLog | `task_id` | Host task/issue ID as a string; YAML `null` when unavailable. |
| Current | `worklog` | Quoted Obsidian wikilink to the saved WorkLog, including the full Vault-relative path and `.md` extension. |
| WorkLog | `event_type` | `checkpoint`, `decision`, or `completion`. |

`obsidian_mcp_name` belongs only in project config; it selects the server, not note ownership.

## Filling and updating templates

- Replace every `{{placeholder}}` before saving. Serialize property values as valid YAML strings, escaping quotes, backslashes, and newlines; do not paste raw user text into frontmatter.
- When a host task/issue ID exists, replace `task_id: null` with its quoted string. Otherwise keep unquoted `null`. Resolve all body placeholders to concise, verified content; use “None” when a section has no applicable content.
- Set `event_type: completion` only when the task actually completed, with `status: completed`. A blocked task uses a checkpoint with `status: blocked`; a decision may leave the task `in-progress`.
- For WorkLogs, derive `YYYY/MM/DD` from the original `created_at` in the user's timezone (UTC if unknown). Use four-digit years and two-digit months/days. For example, `2026-10-25T23:59:00+07:00` belongs in `WorkLogs/2026/10/25/`, even when retried the next day.
- Preserve existing `created_at`, custom properties, unrelated sections, and earlier decisions. Update `updated_at` on actual changes. Historical notes may lack newer properties: verify ownership first and add only values supported by evidence during an authorized edit; do not invent creation dates or migrate paths.
- Each decision entry records the event ID, date, outcome, rationale, and full WorkLog link. Before appending on a retry, check whether that event's decision is already present.
- Fill the optional `Related notes` section with selective, verified links using the [note linking rules](note-links.md). Omit the section or use “None” if no extra link is useful. The required CURRENT `worklog` property and each decision's source WorkLog link remain required; do not duplicate them solely to fill this section.
- Apply the [save safety rules](save-safety.md) before updating shared notes or retrying interrupted writes.
