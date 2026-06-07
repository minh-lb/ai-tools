# Claude Code Adapter

@AGENTS.md is the source of truth for shared agent behavior, context loading, workflow selection, and output format.

Claude Code specifics only:

- When running `/autopilot`, load the matching action file from `.agents/skills/autopilot/actions/`, plus only the template/reference files explicitly required by that action, and respect its Prerequisites section.
- Do not create or modify files outside the task scope. If unsure whether a file is in scope, ask.
- Do not add Claude attribution to commit messages.
