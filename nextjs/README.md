# AI Agents

Reusable AI-agent workflow kit for spec-first Next.js development.

## Quick Start

```bash
bash init.sh
```

This links `.agents/skills` to `.claude/skills` and `.codex/skills`.

Then use:

- `/autopilot spec {requirement}` to create a quick spec and set it active.
- `/autopilot run` to implement the active spec end-to-end.
- `/autopilot bugfix|refactor|testgen` for focused maintenance tasks.
- `/cleanup check|run|fix` for housekeeping.

## Layout

- `AGENTS.md`: root rules and context loading contract.
- `CLAUDE.md`: Claude Code specific instructions (references AGENTS.md).
- `.agents/workflows/`: one workflow selected per task.
- `.agents/skills/`: reusable skills and templates loaded on demand.
- `docs/`: compact project context and generated specs.
