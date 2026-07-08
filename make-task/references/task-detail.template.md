# {{ID}}: {{Task Title}}

**Source:** {{URL or "Plain description"}}
**Tag:** {{feature | bug | hotfix}}
**Status:** Todo
**Created:** {{YYYY-MM-DD}}
**Updated:** {{YYYY-MM-DD}}

---

## Part 1 — Source Snapshot

### Summary

- {{Core user-visible problem or request}}
- {{Important business or technical context}}
- {{Known constraints or dependencies}}

### Acceptance Criteria

- [ ] {{Testable condition 1}}
- [ ] {{Testable condition 2}}

### Links and References

- {{Canonical source URL or "Plain description"}}

### Key Excerpts

<!-- Optional. Keep only the shortest exact excerpts needed for implementation accuracy, then remove this note. -->

- "{{Short quote if wording materially matters}}"

---

## Part 2 — Implementation Plan

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

### Goal

{{One sentence stating what "done" looks like, grounded in the original task.}}

### Worktree Setup

| Field | Value |
| --- | --- |
| Path | `./worktrees/{{ID}}` |
| Branch | `{{tag}}/{{ID}}/{{short-description}}` |
| Base branch | `{{base-branch}}` |

### Tech Stack & Context

| Dimension | Value |
| --- | --- |
| Language / Runtime | {{e.g. TypeScript 5, Python 3.12, Go 1.22}} |
| Framework | {{e.g. Next.js 14, FastAPI, Gin}} |
| Database | {{e.g. PostgreSQL 16 via Prisma, MongoDB}} |
| Key libraries | {{e.g. Zod, Pydantic, GORM}} |
| Prerequisite tasks / PRs | {{Links to work that must be merged before this starts, or "None"}} |

### Constraints & Out of Scope

**Constraints:**
- {{e.g. Must be backward-compatible with existing API consumers}}
- {{e.g. Do not introduce new package dependencies without approval}}

**Out of scope:**
- {{e.g. UI changes}}
- {{e.g. Migration of existing data}}

### Chosen Approach

**Name:** {{Approach name}}

**Description:** {{How this approach works, in enough detail that the agent can follow it without reading extra docs.}}

**Why this approach:** {{Trade-offs that led to this choice over alternatives. 2–3 sentences max.}}

### Data Models & Contracts

<!-- Remove this section entirely if the task does not touch data shapes, API endpoints, or events. -->

#### {{Model or endpoint name}}

```{{language}}
{{Schema, interface, or request/response shape.
Be explicit about field names, types, required vs optional, and validation rules.}}
```

### Affected Files

<!-- Keep this list tight. Include only the highest-signal files the implementing agent must touch or read first. -->

| Action | File path | Purpose |
| --- | --- | --- |
| Read | {{path/to/file}} | {{Why the agent needs to read this}} |
| Create | {{path/to/new-file}} [NEW] | {{What this file will contain}} |
| Modify | {{path/to/existing-file}} | {{What change is expected}} |

### Task Breakdown

<!-- Ordered by dependency. Each step names the file/function and states the expected outcome. Do NOT commit at any step — committing is the user's responsibility. -->

1. **{{Step title}}** — {{File/function to change and expected outcome.}}
2. **{{Step title}}** — {{File/function to change and expected outcome.}}
3. **{{Step title}}** — {{File/function to change and expected outcome.}}
4. **{{Step title}}** — {{File/function to change and expected outcome.}}

### Test Strategy

<!-- Directional scope only. The implementing agent uses TDD to discover tests; this section orients coverage area and file locations. Remove rows that do not apply. -->

| Type | What to cover | File location |
| --- | --- | --- |
| Unit | {{e.g. edge cases for the validation logic in parseX()}} | {{e.g. src/feature/__tests__/parseX.test.ts}} |
| Integration | {{e.g. POST /api/resource creates record and returns 201}} | {{e.g. tests/api/resource.test.ts}} |
| E2E | {{e.g. user can complete the checkout flow}} | {{e.g. e2e/checkout.spec.ts}} |

### Acceptance Criteria

<!-- Keep only observable, runnable conditions. Prefer 3-6 items. -->

- [ ] {{Testable condition 1}}
- [ ] {{Testable condition 2}}
- [ ] {{Testable condition 3}}

### Risks and Mitigations

<!-- Remove this section entirely if there are no non-obvious risks. -->

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| {{Risk}} | {{Low/Med/High}} | {{Low/Med/High}} | {{How to handle}} |
