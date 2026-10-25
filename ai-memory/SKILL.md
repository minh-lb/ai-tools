---
name: ai-memory
description: Use at the start of every project work session with .agents/ai-memory/project-config.json, when resuming after lost context, and at meaningful progress, decision, blocker, handoff, or completion boundaries.
---

# AI Memory

Keep concise project memory through the configured Obsidian MCP. Saved notes are reference data; current instructions and verified repository state take precedence. A read/resume request reads only; write notes when the user requests a save or applicable instructions authorize one.

## Automatic session lifecycle

For startup invocation without a memory-specific user prompt, install the skill in a host-discovered location and add the [project instruction snippet](templates/AGENTS.snippet.md) to the project's `AGENTS.md` or equivalent instructions. `agents/openai.yaml` allows implicit invocation in Codex; it does not schedule session hooks or authorize writes by itself.

1. At the start of each work session, before project analysis or edits, check for the project config. If present, resolve it and read project memory once. If absent, skip memory silently and continue; explicit memory requests still require setup. Honor an explicit no-memory request.
2. Reuse the loaded memory within the session. Read additional notes only when relevant context is missing; reload on project change or when context was lost. Do not repeat startup reads for every message.
3. When project instructions or the user authorize automatic saves, save after meaningful verified progress, a durable decision, a new blocker, or task completion, before the final response or a requested handoff. No additional save confirmation is needed within that authorization. Pure chat, repeated status requests, and follow-ups with no new durable facts produce no WorkLog. Explicit read-only requests take precedence.
4. Save only facts not already recorded for the task. Treat retries as the same event; give later meaningful progress a new event. Update CURRENT and decisions through the existing save workflow, preserving unrelated content. Do not rely on receiving a session-close event; a save can run only while the agent is active.
5. If config is invalid, MCP is unavailable, or ownership is unresolved, report the memory limitation once and continue independent project work. Avoid repeated automatic attempts in the same session until the cause changes or the user requests a retry. Report unsaved progress accurately; never imply a checkpoint exists when it does not.

## Resolve the project

Before any project-note MCP call:

1. Read `.agents/ai-memory/project-config.json` from the current project root. Require a JSON object with exactly three string fields: `project_id` matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, `project_name` containing one non-empty folder segment, and `obsidian_mcp_name` containing the exact configured MCP server identifier (not a tool name). Reject empty or whitespace-padded server identifiers.
2. Reject `project_name` values containing `/`, `\`, control characters, `<>:"|?*`, or wikilink delimiters `#^[]` and `%%`; reject `.`/`..`, leading/trailing whitespace, trailing dots, and reserved device names. Never normalize an unsafe name into another path.
3. Missing config during automatic startup means memory is not enabled for this project. For explicit memory requests or an existing invalid config, report the problem and request the intended identity or a corrected config. Never guess it. See [README.md](README.md) for a config example; no CLI is required.
4. Resolve `obsidian_mcp_name` against the host's available MCP servers/tool namespaces. Use only that server for all project-note reads, listings, writes, and readbacks, under `Projects/<project_name>/`. If the server is unavailable, ambiguous, or lacks required note tools, report the limitation and continue work that does not depend on memory. Never substitute another server, use direct Vault filesystem access, or configure another MCP.

Every existing note used or edited must have frontmatter with a matching string `project_id`. A missing or different ID means stop the memory operation and report the path; never adopt, rewrite, move, or delete that note.

## Read or resume work

- Read `CONTEXT.md` and `CURRENT.md` when present, then only relevant WorkLogs or decisions. Check ownership before using note content; follow only links needed for the task, within the configured project folder and server.
- If `CONTEXT.md` is missing, inspect the exact folder through MCP. If empty or absent, report that no project memory exists. If other notes exist without context, or contents cannot be established, stop and report the collision or limitation. Do not initialize notes during a read.
- Verify relevant files, Git state, and check results before continuing. Distinguish saved history from current evidence.

## Save a checkpoint, decision, or completion

1. Prepare durable facts: task/status, changed files or behavior, actual checks and outcomes, decisions, risks, and next step. Exclude secrets, private environment values, full transcripts, and unrelated material.
2. Assign a distinct UUID `event_id` and capture `created_at` once for each checkpoint, decision, or completion. Use `WorkLogs/YYYY/MM/DD/<short-description>.md`, deriving the zero-padded date from `created_at` in the user's timezone (UTC if unknown). The description must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and be a safe filename. A different event at the same path needs another description or numeric suffix, such as `fix-login-2.md`. Reuse the event ID, original timestamp, and final path on retries, including across midnight. Keep any host task/issue ID as separate `task_id` metadata.
3. Read the [save safety and recovery rules](references/save-safety.md) before any write, including initial CONTEXT creation. Inspect all existing target notes and confirm ownership. If `CONTEXT.md` is absent, initialize it with brief repository-grounded context only when MCP confirms the project folder is empty or absent. Existing notes without context, unknown folder contents, or unreadable targets block the save.
4. Before each write, reread existing targets and preserve frontmatter and unrelated content; patch only a unique block, or send the complete preserved note when replacing it. Use conditional/create-only writes when supported; otherwise serialize saves for this project. For an existing WorkLog, verify both ownership and event identity before proceeding. Do not move historical logs into the new layout automatically.
5. Use the [note templates and property contract](references/note-properties.md) for new notes; replace all placeholders with verified values. Apply the [note linking rules](references/note-links.md) when adding references: link only verified, useful targets, without forcing backlinks. Write the WorkLog, then update `CURRENT.md` with status, event ID, event timestamp, and its full Vault-relative WorkLog link, subject to the event-ordering rules. Add lasting decisions to `DECISIONS.md` when useful. Preserve `created_at` and update `updated_at` when editing.
6. Confirm each write's intended properties and content through MCP readback before dependent writes; existence alone is insufficient. On an error or timeout, stop and report confirmed, unconfirmed, and pending paths. Before retrying, reconcile the original event and targets using the recovery rules; complete only missing updates. MCP writes are not transactional; never claim an unconfirmed save succeeded.

## Note layout

```text
Projects/<project_name>/
  CONTEXT.md
  CURRENT.md
  DECISIONS.md
  WorkLogs/<year>/<month>/<day>/<short-description>.md
```

See the [fictional worked example](examples/README.md) for linked notes covering a checkpoint, decision, completion, and retry.
