# AI Agents

Reusable AI-agent workflow kit for spec-first development.

## Quick Start

```bash
bash init.sh
```

This links `.agents/skills` to `.claude/skills`. Codex reads `AGENTS.md` and repo files directly.

Then use:

- `/spect-writer init-project` to fill `docs/project-overview.md`.
- `/autopilot spec {requirement}` to create a reviewed spec.
- `/autopilot run` to implement the active spec.
- `/autopilot bugfix|refactor|testgen` for focused maintenance tasks.
- `/cleanup check|run` for housekeeping.

## Layout

- `AGENTS.md`: root rules and context loading contract.
- `.agents/workflows/`: one workflow selected per task.
- `.agents/skills/`: reusable skills and templates loaded on demand.
- `docs/`: compact project context and generated specs.
