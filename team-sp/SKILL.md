---
name: team-sp
description: Boot a Claude Code + Codex agent team using TeamCreate. Creates the Leader agent and waits for the user to provide a task before running anything. Use only when the user explicitly asks for "team-sp".
---

# CC Team

Boot a coordinated Claude Code + Codex agent team. Once booted, the Leader agent runs the full workflow autonomously — planning, delegating to Codex, reviewing results — without requiring user intervention at each step.

## Activation

Use only when the user explicitly asks for `team-sp` or describes wanting a Claude Code + Codex team workflow.

Do not auto-apply to ordinary coding, debugging, or single-agent tasks.

## Boot Sequence

`/team-sp` only boots the team. It does NOT start any task. The user provides the task after boot.

When invoked:

1. Read `references/leader.md`, `references/coder.md`, and `references/reviewer.md` in full.
2. Use `TeamCreate` to create the team (e.g. `team_name: "team-sp"`).
3. Spawn the **Leader agent** via `Agent` tool (`team_name`, `name: "Leader"`, `model: "sonnet"`, `run_in_background: true`). Prompt must include:
   - Full content of `references/leader.md`
   - Full content of `references/reviewer.md` (review input/output contracts)
   - Appended delegation rule:
     > **CRITICAL — Delegation Rule**: You MUST NOT implement code yourself using Edit, Write, or Bash. All code changes MUST be delegated to the **Coder** teammate via `SendMessage({ to: "Coder", message: "<assignment markdown>" })`. Wait for Coder to reply with results before inspecting the diff. If you are about to write code directly, stop and send to Coder instead.
4. Spawn the **Coder agent** via `Agent` tool (`team_name`, `name: "Coder"`, `model: "sonnet"`, `run_in_background: true`). Prompt must include:
   - Full content of `references/coder.md`
   - Appended execution rule:
     > **EXECUTION RULE**: You receive implementation assignments from the Leader via message. For each assignment: (1) attempt via `Agent({ subagent_type: "codex:codex-rescue", description: "Codex slice", prompt: "<assignment>" })` — NEVER call `Skill({ skill: "codex:rescue" })` which does not work in background subagents and will fail silently or hang; (2) if Codex fails, retry once with a revised prompt; (3) if Codex fails a second time, fall back to implementing directly using Edit/Write/Bash — you have permission to do this as a last resort only; (4) send the result summary back to Leader via `SendMessage({ to: "Leader", message: "<summary>" })`. Always report whether the result came from Codex or from fallback implementation.
5. Report to the user:
   ```
   CC Team booted.
   - Leader (sonnet): ready — plans, delegates, never writes code
   - Coder (sonnet): relays to Codex, retries on failure, falls back to native tools after 2 failed attempts
   - Review lanes: triggered automatically by Leader via Codex when risk warrants it
   Provide your task to begin.
   ```
6. Wait for the user to provide a task. Do not proceed until the user gives one.
7. When the user provides a task, forward it to Leader:
   ```
   SendMessage({ to: "Leader", message: "<user task verbatim>" })
   ```
   Then step back completely — do NOT implement anything. Leader runs the full workflow autonomously per `references/leader.md`.

## Agent Model Assignments

Each agent MUST be spawned with its designated model. Do not omit or override these:

| Agent  | Model    | Reason                                                                      |
|--------|----------|-----------------------------------------------------------------------------|
| Leader | `sonnet` | Orchestration, planning, multi-file reasoning                               |
| Coder  | `sonnet` | Retry logic, error recovery, fallback implementation — needs reasoning capacity |

Note: There is no persistent Reviewer agent. Review is handled via Codex review lanes (`codex:review`, `codex:adversarial-review`) triggered by Leader through Coder.

## Model Normalization

The Agent tool accepts only shorthand aliases: `sonnet`, `opus`, `haiku`, `fable`.

Before passing any model to Agent, normalize full model IDs to the correct alias:

| Full model ID (and variants)                                         | Alias    |
|----------------------------------------------------------------------|----------|
| `claude-sonnet-4-6`, `claude-sonnet-4-5`, `claude-sonnet-*`         | `sonnet` |
| `claude-opus-4-8`, `claude-opus-4-7`, `claude-opus-*`               | `opus`   |
| `claude-haiku-4-5*`, `claude-haiku-*`                               | `haiku`  |
| `claude-fable-5`, `claude-fable-*`                                   | `fable`  |

Rules:
- Strip the `claude-` prefix, then take the model family name (`sonnet`, `opus`, `haiku`, `fable`).
- If the model string is already a valid alias, use it as-is.
- If the model cannot be mapped (unknown family), omit the `model` parameter and let the Agent inherit the session model.
- Never pass full model IDs (e.g., `claude-sonnet-4-6`) directly to the Agent tool — the call will fail with an enum validation error.

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- `codex:codex-rescue` subagent type is available (Coder invokes it via `Agent` tool, NOT via `Skill`).
- If `TeamCreate` is unavailable, Claude acts as Leader directly without creating a team and states the limitation plainly.

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
