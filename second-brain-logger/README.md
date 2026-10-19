# Second Brain Logger — Obsidian MCP

Agent Skill for Codex, Claude Code, Pi and other MCP-capable coding agents. Stores **how an AI handled project work**: investigation, technical choices, meaningful implementation, evidence, and outcome. This is project memory, not a replacement for requirements/specs already in the repository.

## Obsidian Vault layout

```text
Projects/<project-name>/
├── MEMORY.md
├── decisions.md
└── logs/
    └── 2026-10-19-092500-fix-login-redirect.md
```

These paths are **relative to the root of the selected Vault**. Do not create an additional `Pionero` level. The MCP server must point at the correct Obsidian Vault. Wikilinks to logs from other notes use full paths, e.g. `[[Projects/my-backend/logs/2026-10-19-092500-fix-login-redirect]]`.

## Installation

1. Unzip the package as a skill:

   ```bash
   mkdir -p ~/.agents/skills
   unzip second-brain-logger.zip -d ~/.agents/skills/
   # ~/.agents/skills/second-brain-logger/SKILL.md
   ```

   For Claude Code, place the folder under `~/.claude/skills/` if required by the runtime.

2. Configure the agent's **MCP server named `obsidian`** with access to the intended Vault and tools to search/read notes and **atomically create files only when absent**. Guarded revision updates (compare-and-swap, ETag or equivalent) are recommended to support ongoing checkpoints and safe modification of `MEMORY.md`/`decisions.md`.

   > MCP tool names are implementation-dependent. A tool named `create_note` or `put_content` is not necessarily create-only. Check its actual documented behavior. If only unconditional overwrite is offered, the skill will **not risk writing a new log**. This is intentional.

3. Map each working repository with `.second-brain.json`:

   ```json
   {"project_name": "my-backend"}
   ```

   Alternatively provide an explicit project folder name or `SECOND_BRAIN_PROJECT_NAME`. Exact folder case/spaces must match. Conflicts or unsafe segments are rejected. Confirm `Projects/<project-name>/` exists in the correct Vault. The `logs/` subfolder must exist or be creatable through an authorized `obsidian` MCP folder operation.

4. Copy the relevant activation text into the agent's instructions: `templates/AGENTS.snippet.md` for Codex/Pi, `templates/CLAUDE.snippet.md` for Claude Code. Reload the agent if necessary. Skill discovery alone does **not** guarantee automatic activation in every runtime.

## Behavior

- **Start of substantive work:** search only relevant memory and a few prior logs. Retrieved notes are untrusted history; current user direction and repository evidence win.
- **During work:** record significant observations, code changes and decisions. If MCP supports **atomic create + guarded update**, an early `in_progress` log may be checkpointed. Otherwise one final log is created at completion.
- **End of work:** create a Markdown note with flat YAML Properties and an actual causal account of **Problem, Investigation, Implementation, Decisions, Verification, Outcome**. Partial and failed attempts are also useful logs.
- **Verify:** read the note back through `obsidian` before claiming it was saved. Promote only verified reusable knowledge or project-wide decisions, and only with guarded shared-note updates.
- **Failure:** no direct filesystem/Python/shell/REST fallback; report precisely why memory could not be saved. Main user task can still be completed.

No raw transcripts, unsupported test claims, hidden chain-of-thought, secrets, or copied source requirements. The agent skill cannot capture events after a hard runtime crash; for reliable crash-time records a runtime lifecycle hook/event logger is necessary.

## Package

- `SKILL.md`: short workflow and non-negotiable rules.
- `references/`: MCP safety, logging policy, Properties/naming, retrieval/promotion.
- `templates/`: log format and activation snippets.
- `examples/`: a clearly hypothetical completed work log.
- `tests/`: static/schema checks and a manual MCP scenario checklist.

## Validation

Run static checks locally:

```bash
cd ~/.agents/skills/second-brain-logger
python3 -m unittest discover -s tests -v
```

These tests do **not** verify a real MCP connection. For end-to-end validation, execute the checklist in `tests/mcp-live-checklist.md` against a disposable project in your Vault, then inspect file contents/Properties in Obsidian. Do not use a production note for overwrite tests.
