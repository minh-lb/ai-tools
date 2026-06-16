---
name: agent-team
description: Opt-in multi-agent coordination skill for a leader/coder/reviewer workflow. Use only when the user explicitly asks for "agent-team"; do not auto-trigger for ordinary coding, debugging, or review tasks.
---

## On invocation — do this immediately

1. Call `TeamCreate` with team name `ai_team`.
2. If `TeamCreate` fails, stop and tell the user the orchestration layer is unavailable. Do not proceed.
3. Spawn the three teammates in parallel using the Agent tool — each with `team_name: "ai_team"` and **`model: "sonnet"`** (the model declared in their frontmatter):
   - `name: "leader"`, prompt: read ./references/leader.md (relative to this skill's base directory), follow the bootstrap protocol (handshake coder then reviewer), then wait for task assignments.
   - `name: "coder"`, prompt: read ./references/coder.md (relative to this skill's base directory), acknowledge any handshake from leader, then wait for assignments.
   - `name: "reviewer"`, prompt: read ./references/reviewer.md (relative to this skill's base directory), acknowledge any handshake from leader, then wait for assignments.
4. Wait for `leader` to confirm bootstrap complete (both coder and reviewer acknowledged).
5. Send the user's task to `leader` via `SendMessage`.
6. Wait for `leader`'s response and relay it to the user.

Do not ask the user for confirmation before calling `TeamCreate`. Do not explain what you are about to do. Just do it.

## Runtime Contract
- `TeamCreate` and `SendMessage` must be available. If either is missing or fails, stop immediately and escalate to the user.
- The handshake between agents is required **once per teammate per session**, not once per task. If an agent was already handshaked in this conversation, subsequent assignments proceed directly.

### Workflow
- All communication between teammates happens via `SendMessage`. Do not spawn new subagents.
- All coordination routes through `leader`. `coder` and `reviewer` do not communicate directly with each other.
- Start lean: `leader` wakes `coder` only when implementation is needed. `leader` wakes `reviewer` only when review is required by the risk rules.
- Keep every handoff concise. Send only the active objective, relevant files or diff, risk level, and the next decision needed. Do not forward the full thread — ever. For escalations, summarize each cycle in ≤3 bullets and state the current blocking condition. Raw message history is never forwarded.

**Standard flow:**
1. `leader` receives the request, builds a plan, and assigns the task to `coder`
2. `coder` implements and reports the result back to `leader`
3. `leader` evaluates the result from `coder`; if the task qualifies for reviewer bypass, `leader` finalizes it, otherwise assigns it to `reviewer`
4. `reviewer` reviews and returns a verdict to `leader`:
   - `Approve` / `Approve with concerns`: `leader` checks for remaining tasks — continues with the next task if any, otherwise stops and reports to the user
   - `Revise`: `leader` analyzes the findings, repackages them into a clear new assignment, and sends it back to `coder` — do not forward findings verbatim
   - `Block`: `leader` stops the cycle and escalates to the user with full context

**Revision cycle limit:**
- Maximum **3 `Revise` verdicts** per task or phase.
- If `reviewer` issues a third `Revise`, `leader` stops the loop and escalates to the user with: what was attempted, what failed each cycle, and what decision or clarification is needed.
- If `coder` and `reviewer` disagree on the same point after one revision, `leader` escalates immediately instead of looping again. "Same point" means a finding targeting the same file, function, or behavior — regardless of phrasing. This escalation is independent of the 3-Revise ceiling.

**Review gate rules:**
- `reviewer` is mandatory for `Medium`, `High`, or `Critical` risk work.
- `reviewer` is also mandatory for any `Low` risk change that touches more than one file, changes a contract, affects shared data flow, auth, deployment behavior, or compatibility assumptions.
- `leader` may bypass `reviewer` only when all bypass conditions in `leader.md` Reviewer Bypass Rule are met (canonical source). Do not duplicate or paraphrase those conditions here.

**Final report (when task is complete):**
`leader` reports to the user:
- What was changed and why
- What was validated and how
- Any `Approve with concerns` findings and their risk level
- Residual risk or open questions

**Stop condition handling:**
- If `coder` or `reviewer` hits a stop condition mid-task, report immediately to `leader` with the reason and current state
- `leader` decides: Resume, Discard partial work, or Escalate to the user
- If transport fails, times out, or returns inconsistent state, `leader` retries once with a minimal payload; if it fails again, `leader` escalates instead of continuing with a degraded workflow
