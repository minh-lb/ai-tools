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

1. Use `TeamCreate` to create the **Leader agent** with model `sonnet` — loaded with `references/leader.md` as its system context.
2. Report to the user that the team is ready and waiting for a task:
   ```
   CC Team booted.
   - Leader (sonnet): ready
   - Coder (Codex): on-demand via /codex:rescue
   - Review lanes: /codex:review and /codex:adversarial-review, triggered by risk level
   Provide your task to begin.
   ```
3. Wait for the user to provide a task. Do not proceed until the user gives one.

## Task Execution (after boot)

When the user provides a task, the Leader agent runs autonomously:

1. Classify risk: `Low` / `Medium` / `High`.
2. Build the plan and present it to the user (kickoff gate). For `High` risk, wait for explicit approval. For `Low` / `Medium`, proceed automatically.
3. For each slice — run automatically without stopping:
   - Invoke `/codex:rescue` (no user prompt needed between slices).
   - Automatically trigger review lanes when conditions are met.
   - Escalate to the user only at stop conditions or after 2 failed repair attempts.
4. Report final result to the user.

## Role Model Assignments

Each Claude agent role has an explicit model assignment. These are **fixed** — do not change them at runtime.

| Role   | Model    | Notes                                      |
|--------|----------|--------------------------------------------|
| Leader | `sonnet` | Planning, coordination, diff review        |

Codex (Coder and review lanes) is an external system — model selection is not applicable.

## Model Normalization

The Agent tool accepts only shorthand aliases: `sonnet`, `opus`, `haiku`, `fable`.

Before passing any model to Agent, normalize full model IDs to the correct alias:

| Full model ID (and variants)                                              | Alias    |
|---------------------------------------------------------------------------|----------|
| `claude-sonnet-4-6`, `claude-sonnet-4-5`, `claude-sonnet-*`              | `sonnet` |
| `claude-opus-4-8`, `claude-opus-4-7`, `claude-opus-*`                    | `opus`   |
| `claude-haiku-4-5-20251001`, `claude-haiku-4-5`, `claude-haiku-*`        | `haiku`  |
| `claude-fable-5`, `claude-fable-*`                                        | `fable`  |

Rules:
- Strip the `claude-` prefix, then take the model family name (`sonnet`, `opus`, `haiku`, `fable`).
- If the model string is already a valid alias, use it as-is.
- If the model cannot be mapped (unknown family), omit the `model` parameter and let the Agent inherit the session model.
- Never pass full model IDs (e.g., `claude-sonnet-4-6`) directly to the Agent tool — the call will fail with an enum validation error.

## Model Enforcement (STRICT)

The model assigned to each role in the "Role Model Assignments" table above is **mandatory**. Do not deviate from it for any reason.

**Prohibited:**
- Upgrading a role's model (e.g., changing `sonnet` → `opus` to "improve quality")
- Downgrading a role's model (e.g., changing `sonnet` → `haiku` to "save cost")
- Substituting a different model family when the assigned model "seems slow"
- Omitting the `model` parameter for a role that has an explicit assignment

**Required behavior:**
- Pass the exact alias from the table above when creating the Leader agent. No exceptions.
- Never override a defined model based on perceived task complexity, cost, or performance — those decisions were made when the skill was authored, not at runtime.

## Runtime Assumptions

- `TeamCreate` and `SendMessage` are available.
- Codex surfaces are available: `/codex:rescue`, optional `/codex:review`, optional `/codex:adversarial-review`.
- If `TeamCreate` is unavailable, Claude acts as Leader directly without creating a team and states the limitation plainly.

## Read Order

1. Read `references/leader.md` — full autonomous workflow for the Leader agent.
2. Read `references/coder.md` — Codex context; pass relevant sections in each `/codex:rescue` handoff.
3. Read `references/reviewer.md` — criteria for triggering Codex review lanes.

## Stop Conditions

The team escalates to the user instead of continuing when:

- the spec is too ambiguous to split into a safe scope
- the change requires destructive or irreversible actions without explicit approval
- Codex cannot validate the risky path in any meaningful way
- repeated review findings indicate the design is wrong, not just the implementation
- a required command surface is unavailable and no safe fallback exists

## Completion Criteria

- Leader was created with model `sonnet` as defined.
- The plan matched the strongest available source of truth.
- Each slice was implemented and validated by Codex automatically.
- Review lanes were invoked when risk justified them.
- Leader performed the final diff review before reporting to the user.
