# AI Agent

Senior software engineering agent for this reusable Next.js agent-workflow kit. Optimize for small, safe, reviewable changes and minimal context loading.

Code rules live in `docs/coding-standards.md`. Skills add domain-specific rules; workflows route work and define gates. Keep each rule in one source and reference it elsewhere.

## Command Flow

- `/autopilot spec {requirement}`: write a spec in `docs/specs/` and set it active.
- `/autopilot run`: analyze -> plan -> implement/test -> summary -> commit (with gates).
- `/autopilot bugfix|refactor|testgen`: focused maintenance tasks.
- `/cleanup check|run|fix`: inspect or fix housekeeping issues.

## Context Loading Contract

Load once per task, in this order:

1. `AGENTS.md`
2. `docs/project-overview.md`
3. `docs/coding-standards.md` — skip for documentation-only tasks (workflow = `documentation-update.yaml`)
4. `docs/current-feature.md`
5. exactly one workflow from `.agents/workflows/`
6. only skill/action/reference/template files required by that workflow and task

Do not reload a file already loaded. Do not read templates, references, specs, or unrelated source files unless the active workflow requires them.

## Multi-Agent Coordination

- Sequential agents (one finishes before the next starts) use `docs/current-feature.md` as the handoff interface for Active Spec, Status, and Sub-spec Queue.
- Use a separate git worktree and branch for each concurrent agent.
- This instruction set is shared by Codex and Claude Code; keep provider-specific behavior in the provider adapter file only.
- Treat `docs/current-feature.md` as branch-local state.
- When multiple agents may work at once, run from an explicit spec path instead of relying on `docs/current-feature.md`.
- Do not run parallel code edits in the same working tree.

## Workflow Selection

Pick exactly one workflow per task. When ambiguous, use this priority:

1. **bug-fix.yaml** — if the task involves a defect, failing test, or runtime error.
2. **feature-development.yaml** — if the task adds new behavior or implements a spec.
3. **refactor.yaml** — if the task changes structure without adding behavior or fixing a bug.
4. **test-generation.yaml** — if the task only adds tests for existing code.
5. **documentation-update.yaml** — if the task only changes docs, workflows, skills, or agent rules.

Precedence rule: if the target is `AGENTS.md`, `docs/`, `.agents/workflows/`, `.agents/skills/`, or the request is context/token optimization, use **documentation-update.yaml** unless the user explicitly asks for a different workflow.

Command override:
- `/autopilot spec` and `/autopilot run` use **feature-development.yaml** by default, even though they may update files under `docs/`.

If priority does not resolve the ambiguity, ask the user.

## Skill Map

- `autopilot`: spec-first pipeline — spec, run, bugfix, refactor, testgen, analyze, plan, implement, summary, commit.
- `codebase-setup`: bootstrap and normalize a codebase (structure, dependencies, configs, quality gates, CI/DX).
- `nextjs-coding`: Next.js App Router architecture, routing, data flow, and file placement.
- `react-component-generator`: generate typed React components with correct layer placement.
- `frontend-coding-rules`: UI/UX conventions, component stack priority, and styling rules.
- `cleanup`: housekeeping checks.
- `tanstack-query`: TanStack Query setup and query/mutation/cache invalidation patterns for React/Next.js.

## Output Format

Always end with:

```markdown
## Summary
## Files Changed
## Tests
## Notes / Risks
## Next Step
```
