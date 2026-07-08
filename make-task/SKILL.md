---
name: make-task
description: Create a structured task file from a Jira/Trello/Notion URL or plain description, or update the status of an existing task.
argument-hint: <task URL or plain description> | <ID> --status "<status>"
---

# Make Task

## Usage

> **Invocation prefix:** `/make-task` in Claude Code · `$make-task` in Codex.
>
> Examples below use `/make-task`; in Codex, replace that prefix with `$make-task`.

| Mode | Syntax | Example |
| --- | --- | --- |
| **Create** | `/make-task <URL or description>` | `/make-task https://linear.app/team/ENG-42` |
| **Update status** | `/make-task <ID> --status "<status>"` | `/make-task ENG-42 --status "In Progress"` |

---

## Mode Detection

Parse the user-supplied skill argument string before doing anything else. In Claude Code this is typically exposed as `$ARGUMENTS`; in Codex, use the current harness's provided argument text.

- If the argument string is empty → print the usage table and stop.
- If the argument string matches the pattern `<word> --status <value>` (i.e. a single token followed by `--status`) → run **Update Mode**.
- Otherwise → run **Create Mode**.

---

## Create Mode

### Step 1 — Resolve the Task

#### 1a. If the argument string is a URL

Detect the source platform from the domain and fetch accordingly:

| Platform | Detection | How to fetch |
| --- | --- | --- |
| **Jira** | `atlassian.net` | Use an installed Atlassian connector/MCP tool if available; otherwise ask the user to paste the canonical ticket body |
| **Trello** | `trello.com` | Use an installed Trello connector/MCP tool if available. If only the REST API is available, use `api.trello.com/1/cards/<id>?key=<key>&token=<token>`. If credentials are unavailable, ask the user to paste the card content |
| **Notion** | `notion.so` or `notion.site` | Use an installed Notion connector/MCP tool if available; otherwise ask the user to paste the page content |
| **Linear** | `linear.app` | Use an installed Linear connector/MCP tool if available; otherwise ask the user to paste the issue body |
| **GitHub Issue** | `github.com/.*/issues/` | Prefer an installed GitHub connector/MCP tool. If unavailable and `gh` is installed, run `gh issue view <number> --repo <owner>/<repo>` via shell. Otherwise ask the user to paste the issue content |
| **Other URL** | any other domain | Use the current harness's web-fetch/browse capability if available; otherwise use `curl -L <url>` via shell. Extract only the human-readable task content and ignore navigation, scripts, ads, and comments |

#### 1b. If the argument string is a plain description

Use the description as-is. The task ID will be derived in Step 2.

#### 1c. Clarification rule

If the source is ambiguous or the fetched content is too sparse to plan from, ask **one** targeted question before continuing. Never invent requirements.

---

### Step 2 — Derive the Task ID

| Source | ID format | Example |
| --- | --- | --- |
| Jira | Ticket key as-is | `PROJ-123` |
| Trello | Card short ID prefixed with `TRL-` | `TRL-42` |
| Notion | Page title slugified, prefixed with `NTN-` | `NTN-login-flow` |
| Linear | Issue identifier as-is | `ENG-456` |
| GitHub Issue | `GH-<owner>-<repo>-<number>` | `GH-acme-myapp-88` |
| Plain description | `TASK-<YYYYMMDD>-<seq>` — 3-digit zero-padded sequence, increment if `docs/tasks/` already has files for today | `TASK-20260708-001` |

---

### Step 3 — Create `docs/tasks/<ID>.md`

First, check if `docs/tasks/<ID>.md` already exists. If it does, stop and ask the user: "Task `<ID>` already exists at `docs/tasks/<ID>.md`. Overwrite it? (yes/no)" — only continue if the user confirms.

Create `docs/tasks/` if it does not exist. Write the fully filled file to `docs/tasks/<ID>.md` in one pass using the structure and derivation table below — do not create the file empty first.

The file must follow this structure (in order):
1. Header block: `# <ID>: <Task Title>`, then `**Source:**`, `**Tag:**`, `**Status:** Todo`, `**Created:**`, `**Updated:**`
2. Horizontal rule, then `## Part 1 — Source Snapshot` containing four subsections: `### Summary` (3–6 bullets of the task), `### Acceptance Criteria` (checkboxes from the source ticket), `### Links and References` (canonical URL + key links), and `### Key Excerpts` (optional — remove silently if not needed)
3. Horizontal rule, then `## Part 2 — Implementation Plan` starting with the implementing-agent blockquote below, followed by sections: Goal, Worktree Setup, Tech Stack & Context, Constraints & Out of Scope, Chosen Approach, Data Models & Contracts (optional), Affected Files, Task Breakdown, Test Strategy, Acceptance Criteria, Risks and Mitigations (optional)

#### Implementing-agent blockquote

Write this blockquote verbatim at the top of Part 2, substituting `{{ID}}`, `{{tag}}`, `{{short-description}}`, and `{{base-branch}}` with the actual values derived in Steps 2–3:

```markdown
> **Implementing agent — before you start:**
>
> **Skill invocation prefix:** use the current harness syntax (`/skill-name` in Claude Code · `$skill-name` in Codex).
>
> 0. **Set up the git worktree first — before writing any code:**
>    - Use the current harness's installed worktree helper if available; otherwise run `git worktree add ./worktrees/{{ID}} -b {{tag}}/{{ID}}/{{short-description}} {{base-branch}}` directly.
>    - Path: `./worktrees/{{ID}}`
>    - Branch: `{{tag}}/{{ID}}/{{short-description}}` branched from `{{base-branch}}`.
>    - **All code changes must be made inside this worktree. Never implement in the main workspace.**
>    - After the worktree is ready, run `/make-task {{ID}} --status "In Progress"` (Claude Code) or `$make-task {{ID}} --status "In Progress"` (Codex) to mark the task as started.
> 1. Execute this plan with the current harness's planning or subagent workflow if available; otherwise follow it in a single-agent loop.
> 2. For each task in the breakdown, follow TDD: write the test first, watch it fail, then write the minimal code to pass. Use **Test Strategy** below as directional scope, not a rigid list.
> 3. Before claiming any task or the whole plan is done, run the current harness's verification workflow if available; otherwise run the equivalent local checks manually — evidence before assertions, always.
> 4. When all Acceptance Criteria pass: report completion to the user and stop. **Do NOT update status, do NOT commit, do NOT push** — these are the user's responsibility.
```

Fill every placeholder from evidence in the task content or the codebase. Rules:

- **Never leave a placeholder unfilled.** For table rows (Tech Stack), write `N/A` if a value cannot be derived. For narrative fields (Goal, Chosen Approach), always write a real value — `N/A` is not acceptable there.
- **Remove optional sections** (Data Models, Risks) silently when they do not apply — no comment, no trace.
- **Header fields** — set `Created` and `Updated` to today's date; `Status` stays `Todo`; derive `Tag` as `hotfix` for urgent production fixes, `bug` for defect reports, `feature` for everything else.
- **Part 1** — keep it compact. Use the four subsections from the template: `### Summary` (3–6 bullets), `### Acceptance Criteria` (checkboxes from the source ticket), `### Links and References` (canonical URL + key links), `### Key Excerpts` (optional — remove silently if no excerpt is needed). Preserve source meaning without copying boilerplate.
- **Token discipline** — prefer a task file that stays under roughly 120 lines and avoids repeating information already present elsewhere. Keep:
  - **Affected Files** to the most relevant 5-10 entries unless more are truly necessary
  - **Task Breakdown** to 4-8 concrete steps
  - **Test Strategy** to the minimal set of rows that meaningfully guides coverage
- **Part 2** — derive each section as follows:

| Section | Where to look |
| --- | --- |
| Goal | Task description + acceptance criteria |
| Worktree Setup | Path = `./worktrees/<ID>`; Branch = `<tag>/<ID>/<short-description>` where short-description is 2–4 words slugified from the task title; Base branch = run `git remote show origin` and read the `HEAD branch:` line; fallback: run `git branch -l main master` and use whichever exists; default to `main` if undetectable — fill in the actual branch name, not the literal string |
| Tech Stack & Context | `package.json`, `go.mod`, `pyproject.toml`, `Cargo.toml`, or equivalent manifest files. If no manifest is found, prompt the user with: "I couldn't detect the tech stack — please specify language, framework, and database." |
| Constraints & Out of Scope | Task scope, existing API surface, repo conventions, and anything the ticket explicitly excludes |
| Chosen Approach | Simplest approach that satisfies the task; read existing patterns in the codebase before deciding |
| Data Models & Contracts | Task spec, existing schema files, migration files, or OpenAPI/proto definitions |
| Affected Files | Trace imports and call sites in the codebase; mark new files as `[NEW]`; order by dependency |
| Task Breakdown | Bite-sized steps — zero-context engineer, TDD, DRY, YAGNI; each step names the file/function and expected outcome. Do not include commit markers — committing is the user's responsibility |
| Test Strategy | Match the project's existing test structure; treat as directional scope — implementing agent uses TDD to discover tests, this section orients coverage and file locations |
| Acceptance Criteria | Derive from task acceptance criteria or infer from the goal; each item must be observable and runnable |
| Risks and Mitigations | Non-obvious risks only; omit section silently if none apply |

---

### Step 4 — Register in `docs/task-overview.md`

If `docs/task-overview.md` does not exist, create it with the following content verbatim:

```markdown
# Task Overview

This file is maintained by the `make-task` skill. New rows are added automatically — do not add rows manually. Status updates by implementing agents are expected and welcome.

## Status Legend

| Status | Meaning |
| --- | --- |
| `Todo` | Task created, not started |
| `In Progress` | Work has begun |
| `In Review` | Under code or peer review |
| `Testing` | Under QA or user acceptance testing |
| `Done` | Accepted and closed |
| `Blocked` | Waiting on an external dependency |
| `Cancelled` | No longer being pursued |

---

## Tasks

| ID | Title | Status | Updated At | File |
| --- | --- | --- | --- | --- |
```

If `docs/task-overview.md` already exists, check whether a row for `<ID>` already exists. If it does, skip adding a duplicate row (the file was already created in Step 3 under user confirmation).

Otherwise, add one row for the new task. Do not reorder or remove existing rows.

| Column | Value |
| --- | --- |
| ID | Derived task ID |
| Title | Task title |
| Status | `Todo` |
| Updated At | Today's date (`YYYY-MM-DD`) |
| File | Relative Markdown link to `docs/tasks/<ID>.md` |

---

### Create Output

After both files are written, print:

```
✓ Task <ID> created
  Detail  : docs/tasks/<ID>.md
  Overview: docs/task-overview.md
```

Do not commit files unless the user explicitly asks.

---

## Update Mode

### Step U1 — Parse Arguments

Extract from the user-supplied skill argument string:
- `<ID>` — the token before `--status`, trimmed.
- `<status>` — everything after `--status`, trimmed. Strip surrounding quotes if present; quotes are optional.

Validate `<status>` (case-sensitive) against the allowed values below. If invalid, print the allowed list and stop.

| Allowed status |
| --- |
| `Todo` |
| `In Progress` |
| `In Review` |
| `Testing` |
| `Done` |
| `Blocked` |
| `Cancelled` |

---

### Step U2 — Preflight checks

Run all checks before modifying any file:

1. Verify `docs/tasks/<ID>.md` exists. If not, list all files in `docs/tasks/` and tell the user which IDs are available, then stop.
2. Verify `docs/task-overview.md` exists. If not, tell the user the overview file is missing and stop.
3. Verify `docs/task-overview.md` has a row whose ID cell matches `<ID>`. If not, tell the user the row is missing and stop.

Only proceed to U3 if all three checks pass.

---

### Step U3 — Apply updates

Update both files atomically — complete both before reporting success:

1. In `docs/tasks/<ID>.md`: read and store `**Status:**` as `<old status>`, then replace it with the new status; replace `**Updated:**` with today's date.
2. In `docs/task-overview.md`: replace the `Status` cell of the matching row with the new status; replace `Updated At` with today's date.

---

### Update Output

After both files are updated, print:

```
✓ Task <ID> updated
  Status  : <old status> → <new status>
  Detail  : docs/tasks/<ID>.md
  Overview: docs/task-overview.md
```

Do not commit files unless the user explicitly asks.

---

## Error Handling

| Situation | Action |
| --- | --- |
| Fetch fails (network, auth) | Inform the user, ask them to paste the content manually |
| MCP tool not authenticated | Guide the user to authenticate; fall back to manual paste |
| Trello API key missing | Prompt the user to provide key and token, or paste the card manually |
| Task already exists (create) | Step 3 prompts the user to confirm overwrite; never silently overwrite |
| `docs/tasks/<ID>.md` not found (update) | List available IDs from `docs/tasks/` and stop — handled in Step U2 preflight |
| `docs/task-overview.md` not found (update) | Tell the user the file is missing and stop — handled in Step U2 preflight |
| Overview row not found for `<ID>` (update) | Tell the user the row is missing and stop — handled in Step U2 preflight |
| Invalid status value (update) | Print allowed status values and stop |
| The argument string is empty | Print usage table and stop |
