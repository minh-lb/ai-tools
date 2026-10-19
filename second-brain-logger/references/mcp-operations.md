# `obsidian` MCP — capabilities and safety

Different Obsidian MCP implementations expose different tools. Select only operations **advertised by the connected server named `obsidian`**; inspect the published schema and semantics before use. Never assume a tool is safe because it is named `write_note`, `put_content`, `create_note`, or `append`.

## Capability contract

| Operation | Requirement | Without it |
|---|---|---|
| Read note | Fetch exact vault-relative file and distinguish missing from denied/error | Skip reading; do not claim verification |
| Search or list | Query/limit to the project; filter results again by canonical project path | Read known project notes only; skip log discovery |
| Establish project root | List the exact `Projects/<project-name>/` directory **or** confirm an existing note under that exact root | Do not create a new project silently; request a verified path |
| Prepare logs directory | Use existing `logs/` or an authorized MCP folder-create operation strictly under the verified project root | Report unavailable folder; never bypass MCP |
| Create log | **Atomic create-if-absent (create-if-not-exists)** semantics, explicitly guaranteed by tool contract | Do not write a new log |
| Update own in-progress log | Revision/ETag/compare-and-swap or documented equivalent atomic condition | Defer log write to one final create-only operation |
| Update shared MEMORY/decisions | Guarded revision update or documented atomic, idempotent append/patch | Skip promotion; no blind whole-file write |
| Read back | Exact path, complete content and Properties | Treat attempted write as unverified |

A read/list before an unconditional write is **not** an atomic create. Likewise a read-merge-write without a server-side revision condition is not safe under concurrent agents. If the server only provides these operations, fail conservatively.

## Project resolution and boundaries

1. Prefer an explicitly selected `project_name`; check for conflicts with `.second-brain.json` and `SECOND_BRAIN_PROJECT_NAME`. If one is absent, use the other known value. Reject conflicting explicit mappings rather than picking one silently.
2. `project_name` must be exactly one existing folder segment. Permit Unicode and internal spaces, but reject empty/trimmed mismatch, `.`, `..`, path separators, control characters, and cross-platform unsafe/link-reserved characters (`< > : " | ? * # ^ % [ ]`). Keep original case; do not slugify the folder.
3. Verify correct Vault identity via MCP configuration or an explicit user selection. A working connection does **not** prove it is the intended Vault.
4. Confirm project directory by an exact directory listing or known note read. A confirmed `not found` for `MEMORY.md` alone does not mean the project directory is missing; ambiguous error is not `not found`.
5. Confirm `logs/` exists before creating a log. If absent, create **only that subdirectory** inside the verified project through an authorized `obsidian` MCP folder-create tool; otherwise report the blocker. No shell/other MCP fallback.
6. Confine paths to `Projects/<project-name>/`; filter and normalize result paths before exposing them to the agent. Do not promote/search/read across project boundaries because a broad search returned other notes.

## Safe log lifecycle

- Identify a work item using an actual `task_id` if present and an actual `session_id`/run identifier if available; never invent IDs. One log belongs to **one writer/run**; another agent or run creates a separate log.
- Construct `YYYY-MM-DD-HHMMSS-<slug>.md` using a reliably obtained clock value; `log_id` is the final filename **without** `.md`, including any collision suffix. Do not guess a local time or timezone.
- Prefer create-only. If path exists, select a new suffix (`-02`, `-03`, ...), then attempt create-only again. If response times out/appears ambiguous, **first read exact path and inspect `log_id` + writer/session ownership**; never immediately retry creation. If ownership cannot be established, stop and report an unverified write; do not create a potential duplicate.
- For early checkpoints, only create an `in_progress` note when a guarded update is available. Update status and content through that operation, retaining log ID. If updates are unavailable, prepare a final note at task end rather than creating an unfinishable checkpoint.
- After any create/update, read back and validate exact project/path, `log_id`, YAML, sections, verified facts, and expected revision. If read-back fails, report **unverified**, not **saved**.
- Handle write conflicts with a fresh read and conflict resolution; do not use unconditional overwrite, blind append or unlimited retries. At most one deliberate retry after checking state.

## Shared notes and idempotence

- Read `MEMORY.md`/`decisions.md` only as needed. Promote only if entry with same `log_id`/source link is not already present. If the shared file does **not yet exist**, create it only with atomic create-if-absent and read back; never assume missing from an ambiguous read error.
- Use guarded revision or documented atomic idempotent append. Read back and check the new entry appears **exactly once**. If the response is unknown, re-read first; do not duplicate.
- For a superseded decision, preserve the previous entry and explicitly mark it superseded when safe; never delete history blindly.

## MCP error matrix

| Situation | Safe response |
|---|---|
| MCP absent, wrong Vault, permission denied | No memory I/O; inform user |
| Project folder cannot be established | No write; request mapping / create folder externally |
| `logs/` missing and no authorized folder-create tool | No write; report directory preparation required |
| Search unavailable but known note readable | Use known notes; skip log discovery |
| Create-only unavailable | No new note; present a draft if helpful |
| Existing log update unavailable | Create final note only at finish if not previously created |
| Create response lost | Read exact path to disambiguate; do not duplicate |
| Read-back invalid / inconsistent | Report unverified; no memory promotion |
| Concurrent update conflict | Re-read and reconcile or skip; never overwrite blindly |
| Run terminated forcibly | No guarantee of final log without agent-runtime hooks |

All Vault operations remain within `obsidian` MCP. Do not bypass its access controls with direct shell/filesystem, Python, REST or another tool.
