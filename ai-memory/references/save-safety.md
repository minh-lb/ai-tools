# Save safety and recovery

Apply these rules to the save workflow, including retries and initial note creation.

## Bind an event to its destination

Keep the event ID, original timestamp, final WorkLog path, and resolved config tuple (`project_id`, `project_name`, `obsidian_mcp_name`) together for the operation. If the config or destination changes during a save or retry, stop and report the change; do not replay the old event into another folder or server. If the original event identity or path cannot be recovered from trusted session state or matching notes, request clarification instead of inventing a replacement event.

## Concurrent writers

- Prefer one memory writer per project. In multi-agent work, delegate saves to one designated writer; other agents provide facts to it.
- When supported, use create-only writes for new notes and conditional writes against the version just read for existing notes. A failed condition requires rereading and reconciling, never an unconditional overwrite. A path occupied by a different event requires another safe filename.
- If MCP lacks these capabilities, saves must be serialized for the project. If overlapping writers are known and serialization cannot be established, stop the save and report the limitation. Reread/readback does not provide a lock and cannot guarantee safety against an unknown concurrent writer in another chat.
- If a target changed since preflight, reread it and preserve the new content. Merge only non-conflicting changes; otherwise stop and report the conflict. Never replace a shared note with an earlier snapshot or delete another event to recover from a race.

## Keep CURRENT from moving backward

After confirming the WorkLog, reread CURRENT before updating it:

- If CURRENT already points to this event, check its status, timestamp, link, and task content; skip an already-complete update.
- If it points to another event, compare the incoming WorkLog's original `created_at` with CURRENT's `event_created_at` as timezone-aware instants. CURRENT's file `created_at` and `updated_at` do not define event order.
- If CURRENT represents a newer event, preserve its pointer, status, and task summary. The older WorkLog remains historical; report that CURRENT was intentionally left at the newer event. Do not undo newer progress while completing an old retry.
- If a historical CURRENT lacks `event_created_at`, derive it only from its linked, owned WorkLog. If ordering is unknown, timestamps tie for different events, or timestamps conflict with known task order, preserve CURRENT and report a conflict instead of guessing.
- For an incoming newer event, update CURRENT while retaining unrelated content and properties. Its `event_created_at` must equal that WorkLog's original `created_at`; advance `updated_at` only on an actual edit.

Use conditional writes or serialized access for these checks too; ordering checks alone do not close the gap between a read and a write.

## Partial saves and retries

Read back the written properties and relevant content after every write, including CONTEXT. Stop on a mismatch, error, or timeout and report confirmed, unconfirmed, and pending paths; do not continue dependent writes on an unconfirmed result.

On retry, reread targets first. Match ownership, event ID, original timestamp, and task content; verify CURRENT's full link and event ordering. Skip matching writes, add only missing decisions, and preserve newer events. Conflicting content for the same event requires clarification. An already-confirmed WorkLog must not be replaced just to retry a CURRENT or DECISIONS update. Report what was recovered and what remains unresolved.
