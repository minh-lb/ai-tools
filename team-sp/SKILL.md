---
name: team-sp
description: Boot a superpowers-native agent team (Planner + Leader + Coder). Planner explores intent and creates spec+plan using brainstorming+writing-plans. Leader executes plan using executing-plans. Coder implements via Codex with verification. Use only when the user explicitly asks for "team-sp".
metadata:
  author: Minh Luu
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

1. Read `agents/planner.md`, `agents/leader.md`, and `agents/coder.md` in full — these three become the spawned agents' system prompts. `agents/reviewer.md` is reference documentation only (its contract is already inlined in `coder.md` and `leader.md`'s Phase 4) — you don't need to read it to boot the team.
2. Use `TeamCreate` to create the team (e.g. `team_name: "team-sp"`).
3. Spawn the **Leader** agent via `Agent` tool:
   - `team_name: "team-sp"`, `name: "Leader"`, `run_in_background: true`
   - Prompt: full content of `agents/leader.md` + appended constraint:
     > **CRITICAL**: You coordinate only. NEVER implement code (no Edit/Write/Bash for implementation). NEVER plan. Do nothing until Planner sends you "Phase 1 complete. Plan approved by user." — Planner talks to the user directly and does not relay through you.
4. Spawn the **Planner** agent via `Agent` tool:
   - `team_name: "team-sp"`, `name: "Planner"`, `run_in_background: true`
   - Prompt: full content of `agents/planner.md` + appended constraint:
     > **CRITICAL**: You plan only. NEVER implement code. Talk to the user directly via `SendMessage({ to: "main", ... })` for every question and approval gate in Phase 1. Message Leader exactly once, at the end, after the user has approved the plan. You are silent after that handoff.
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
8. When user provides task, forward directly to Planner (not Leader):
   ```
   SendMessage({ to: "Planner", message: "<user task verbatim>" })
   ```
   Then enter the Planning Relay Loop below.

## Planning Relay Loop (Phase 1 — with Planner)

Planner talks to the user directly through you; Leader is not involved yet.
- When Planner sends output (a question, proposed approaches, design summary for approval, plan summary for approval): display it verbatim to the user.
- When user replies: forward to Planner via `SendMessage({ to: "Planner", message: "<reply>" })`.
- **Exit this loop** when Planner sends its handoff message to Leader (not to you) — you'll see no further messages from Planner. At that point switch to the Execution Relay Loop and wait for Leader to speak.
- If Planner sends an `ESCALATE:` message, display it to the user and keep relaying replies to Planner until resolved.

## Execution Relay Loop (Phase 2+ — with Leader)

Once Planner has handed the approved plan to Leader:
- Expect a short progress ping from Leader after each slice ("Slice n/total done: ..."), plus escalations and the final report — display each one verbatim to the user as it arrives. Silence between pings on a long-running slice is normal; silence for many minutes with no ping at all is not.
- When user replies: forward to Leader via `SendMessage({ to: "Leader", message: "<reply>" })`.
- **Exit relay loop** when Leader's message ends with `TASK COMPLETE.` on its own line — display the message, then stop relaying.

## Model

All agents inherit the session model — do not set `model` on any Agent call.

## Read Order

Before booting agents, read in this order:
1. `agents/planner.md` — Planner system prompt (Phase 1 workflow)
2. `agents/leader.md` — Leader system prompt (executing-plans, reports to user via `SendMessage({ to: "main" })`)
3. `agents/coder.md` — Coder system prompt (Codex + verification, includes the review-lane output contract inline)

`agents/reviewer.md` is optional human-readable reference — the contract it documents is already inlined in `coder.md` and `leader.md`. Read it only if you want the rationale behind the review-lane rules.

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- `codex:codex-rescue` subagent type is available.
- **How superpowers skills are actually used** — persistent background teammates (Planner, Leader, Coder) never call `Skill()` themselves (unreliable for background agents, same reason `codex:rescue` can't be called directly — see `coder.md`). Instead, `brainstorming`, `writing-plans`, `executing-plans`, and the verification checklist are inlined as plain instructions directly into `planner.md`/`leader.md`/`coder.md`. The one exception is `requesting-code-review`: Leader spawns a one-off, non-background `Agent()` subagent for that (not a team member), and that subagent calls `Skill()` normally since it isn't a persistent background teammate.
- If `TeamCreate` unavailable: tell the user teams can't spawn, then run the same phases yourself, in the same session, without simulating separate agents: first run Planner's Phase 1a/1b directly against the user (same questions, same gates, same doc paths), then run Leader's Phase 3/4 loop yourself using Coder's workflow (still prefer `codex:codex-rescue` via the `Agent` tool, same retry/fallback rule). State this fallback mode plainly in the boot message and in the final report.
- If superpowers skills unavailable: Planner proceeds with inline planning (no skill invocation), states the gap in final report.

## Stop Conditions

Planner and Leader own their own escalation logic (see their Stop Conditions sections) and reach you via `SendMessage({ to: "main", message: "ESCALATE: ..." })`. Your job as orchestrator is to relay that message to the user verbatim and relay their reply back — not to re-decide whether escalation was warranted. The conditions below are the same ones Planner/Leader already enforce, listed here for your own situational awareness:
- Spec too ambiguous after 3 clarification rounds (Planner)
- User rejects all proposed approaches after 2 re-proposals (Planner)
- Plan not approved after 3 revisions (Planner)
- Repair cycle fails twice on same slice (Leader)
- Destructive action without explicit approval (Leader)
- Codex + fallback both fail (Coder → Leader)
- Coder returns control over a spec conflict, hidden scope expansion, or an ambiguous solution space it can't safely pick between (Coder → Leader)
- Review finds systemic design issue requiring spec revision (Leader)

## Completion Criteria

- Planner produced approved design doc + implementation plan.
- All plan tasks implemented and validated by Coder.
- Verification-before-completion ran on every slice.
- Review lanes used when multi-file or high-risk.
- Leader performed final diff review and reported to user.
- User reviews changes and commits manually — agents do NOT commit.
