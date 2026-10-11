# Team Mini

Boot a coordinated Claude Code/Codex team and wait for the user to provide a task. Booting alone does not start work. Use this only when the user explicitly asks for team coordination; ordinary complex coding tasks do not automatically require a team.

## Usage

```text
/team-mini
→ Team ready. Send the task when ready.

<task and relevant requirements>
```

The host's actual tools determine which roles can start. The skill must report unavailable Codex, team, messaging, or review capabilities accurately and must not claim a persistent team or independent review that did not run.

## Roles

| Role | Responsibility |
|---|---|
| Leader | Coordinates scope, acceptance, handoffs, integration, and final review; does not implement while a Coder is assigned. |
| Coder | Implements one bounded assignment, uses Codex only if an adapter is confirmed available/authorized, otherwise reports or uses a safe agreed fallback. |
| Independent reviewer | Optional review pass through an available authorized tool; not a persistent team member by default. |

## Workflow

```text
Boot → report actual capabilities → wait for task
  → clarify material unknowns and identify acceptance evidence
  → plan bounded work when useful; pause at required consent gates
  → implement and validate through available authorized tools
  → inspect the diff; request independent review only when available and useful
  → report exact changes, checks, and remaining risk
```

Continue routine slices without unnecessary interruptions, but pause when requirements conflict, a material design choice is unresolved, validation cannot establish safety, or an external/destructive/irreversible action needs approval. No task automatically authorizes a commit, push, PR/MR, deployment, or other external side effect.

## Examples

```text
/team-mini

Please coordinate a small team to review and implement the checkout retry fix. Preserve the API contract, run the relevant tests, and do not commit or push.
```

```text
/team-mini

Coordinate a migration plan for the invoice data. Do not run the migration or change production data; show the plan and risks first.
```

Use the requested project/model/tools only when available and permitted. Do not copy example constraints into real work.

## When not to use

- The user has not requested multi-agent coordination.
- A small task is better handled directly.
- The required team/subagent capability is unavailable; explain this and ask whether single-agent work is acceptable.

## Files

- `SKILL.md` — activation, boot, workflow, and safety boundaries.
- `references/leader.md` — coordinator responsibilities and handoff process.
- `references/coder.md` — bounded implementation and capability fallback.
- `references/reviewer.md` — optional independent review contract; load only when used.
- `agents/openai.yaml` — discovery metadata.
