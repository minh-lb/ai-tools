---
name: cc-team-mini
description: Boot a Claude Code + Codex agent team using TeamCreate. Creates the Leader agent and waits for the user to provide a task before running anything. Use only when the user explicitly asks for "cc-team-mini".
---

# CC Team

Boot a coordinated Claude Code + Codex agent team. Once booted, the Leader agent runs the full workflow autonomously — planning, delegating to Codex, reviewing results — without requiring user intervention at each step.

## Activation

Use only when the user explicitly asks for `cc-team-mini` or describes wanting a Claude Code + Codex team workflow.

Do not auto-apply to ordinary coding, debugging, or single-agent tasks.

## Boot Sequence

`/cc-team-mini` only boots the team. It does NOT start any task. The user provides the task after boot.

When invoked:

1. Use `TeamCreate` to create the **Leader agent** — loaded with `references/leader.md` as its system context.
2. Report to the user that the team is ready and waiting for a task:
   ```
   CC Team booted.
   - Leader: ready
   - Coder (Codex): on-demand via /codex:rescue
   - Reviewer: created when task risk is Medium or High
   Provide your task to begin.
   ```
3. Wait for the user to provide a task. Do not proceed until the user gives one.

## Task Execution (after boot)

When the user provides a task, the Leader agent runs autonomously:

1. Classify risk: `Low` / `Medium` / `High`.
2. If `Medium` or `High`: use `TeamCreate` or `SendMessage` to add the **Reviewer agent** — loaded with `references/reviewer.md`.
3. Build the plan and present it to the user (kickoff gate). For `High` risk, wait for explicit approval.
4. For each slice — run automatically without stopping:
   - Invoke `/codex:rescue` (no user prompt needed between slices).
   - Automatically trigger review lanes when conditions are met.
   - Escalate to the user only at stop conditions or after 2 failed repair attempts.
5. Report final result to the user.

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- Codex surfaces are available: `/codex:rescue`, optional `/codex:review`, optional `/codex:adversarial-review`.
- If `TeamCreate` is unavailable, Claude acts as Leader directly without creating a team and states the limitation plainly.

## Read Order

1. Read `references/leader.md` — full autonomous workflow for the Leader agent.
2. Read `references/coder.md` — Codex context; pass relevant sections in each `/codex:rescue` handoff.
3. Read `references/reviewer.md` — context for the Reviewer agent or Codex review lanes.

## Stop Conditions

The team escalates to the user instead of continuing when:

- the spec is too ambiguous to split into a safe scope
- the change requires destructive or irreversible actions without explicit approval
- Codex cannot validate the risky path in any meaningful way
- repeated review findings indicate the design is wrong, not just the implementation
- a required command surface is unavailable and no safe fallback exists

## Completion Criteria

- Team was created with the right agents for the risk level.
- The plan matched the strongest available source of truth.
- Each slice was implemented and validated by Codex automatically.
- Review lanes were used when risk justified them.
- Leader performed the final diff review before reporting to the user.
