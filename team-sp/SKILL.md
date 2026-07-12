---
name: team-sp
description: Boot a superpowers-native agent team (Planner + Leader + Coder). Planner explores intent and creates spec+plan using brainstorming+writing-plans. Leader executes plan using executing-plans. Coder implements via Codex with verification. Use only when the user explicitly asks for "team-sp".
---

# CC Team SP

Boot a superpowers-native multi-agent team. Planner runs full planning workflow (brainstorming → writing-plans), Leader orchestrates execution (executing-plans), Coder implements via Codex with verification-before-completion. Reviewer is on-demand via Codex lanes with Claude subagent fallback for high-risk blocks.

## Activation

Use only when the user explicitly asks for `team-sp`.

Do not auto-apply to ordinary coding, debugging, or single-agent tasks.
Use `team-mini` for quick tasks with clear specs. Use `team-full` for TDD workflows.

## When to Use team-sp

| Signal | Use |
|---|---|
| Task scope or requirements are unclear | team-sp |
| Multi-file, multi-system changes | team-sp |
| Task would benefit from structured spec before implementation | team-sp |
| Task is a quick fix with clear spec | team-mini |
| Task requires TDD with test-first discipline | team-full |

## Boot Sequence

`/team-sp` only boots the team. It does NOT start any task. The user provides the task after boot.

When invoked:

1. Read `agents/planner.md`, `agents/leader.md`, `agents/coder.md`, and `agents/reviewer.md` in full.
2. Use `TeamCreate` to create the team (e.g. `team_name: "team-sp"`).
3. Spawn the **Leader** agent via `Agent` tool:
   - `team_name: "team-sp"`, `name: "Leader"`, `run_in_background: true`
   - Prompt: full content of `agents/leader.md` + appended constraint:
     > **CRITICAL**: You coordinate only. NEVER implement code (no Edit/Write/Bash for implementation). NEVER plan — delegate planning to Planner. Relay all Planner ↔ user communication.
4. Spawn the **Planner** agent via `Agent` tool:
   - `team_name: "team-sp"`, `name: "Planner"`, `run_in_background: true`
   - Prompt: full content of `agents/planner.md` + appended constraint:
     > **CRITICAL**: You plan only. NEVER implement code. ALL user communication must go through Leader via `SendMessage({ to: "Leader", ... })`. You are silent after Phase 1b is complete.
5. Spawn the **Coder** agent via `Agent` tool:
   - `team_name: "team-sp"`, `name: "Coder"`, `run_in_background: true`
   - Prompt: full content of `agents/coder.md` + appended constraint:
     > **EXECUTION RULE**: Attempt all code changes via `Agent({ subagent_type: "codex:codex-rescue", ... })`. NEVER call `Skill({ skill: "codex:rescue" })` — it does not work in background agents. Retry once on failure, then fall back to Edit/Write/Bash. Always run the inline verification checklist (defined in your system prompt) before sending results to Leader — do NOT invoke any Skill tool for verification.
6. Report to user:
   ```
   CC Team SP booted.
   - Planner: ready — planning + spec, active Phase 1 only
   - Leader:  ready — coordinates, never writes code
   - Coder:   ready — Codex implementation + verification
   - Reviewer: on-demand — Codex lanes, Claude subagent if Block+high-risk
   Provide your task to begin.
   ```
7. Wait for the user to provide a task.
8. When user provides task, forward to Leader:
   ```
   SendMessage({ to: "Leader", message: "<user task verbatim>" })
   ```
   Then enter relay loop: display Leader output to user, forward user replies to Leader.

## Relay Loop

After forwarding the task, operate as a relay between Leader and the user:
- When Leader sends output (questions relayed from Planner, design/plan for approval, status, final report): display it verbatim to the user.
- When user replies: forward to Leader via `SendMessage({ to: "Leader", message: "<reply>" })`.
- **Exit relay loop** when Leader's message ends with `TASK COMPLETE.` on its own line — display the message, then stop relaying.

## Model

All agents inherit the session model — do not set `model` on any Agent call.

## Read Order

Before booting agents, read in this order:
1. `agents/planner.md` — Planner system prompt (Phase 1 workflow)
2. `agents/leader.md` — Leader system prompt (relay + executing-plans)
3. `agents/coder.md` — Coder system prompt (Codex + verification)
4. `agents/reviewer.md` — Review lanes + hybrid escalation

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- `codex:codex-rescue` subagent type is available.
- superpowers skills available: `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `requesting-code-review`.
- If `TeamCreate` unavailable: Claude acts as all agents sequentially, states the limitation.
- If superpowers skills unavailable: Planner proceeds with inline planning (no skill invocation), states the gap in final report.

## Stop Conditions

Escalate to user when:
- Spec too ambiguous after 3 clarification rounds
- User rejects all proposed approaches after 2 re-proposals
- Plan not approved after 3 revisions
- Repair cycle fails twice on same slice
- Destructive action without explicit approval
- Codex + fallback both fail
- Review finds systemic design issue requiring spec revision

## Completion Criteria

- Planner produced approved design doc + implementation plan.
- All plan tasks implemented and validated by Coder.
- Verification-before-completion ran on every slice.
- Review lanes used when multi-file or high-risk.
- Leader performed final diff review and reported to user.
- User reviews changes and commits manually — agents do NOT commit.
