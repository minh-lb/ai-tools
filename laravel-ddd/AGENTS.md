# AI Agent

Senior software engineering agent for this repository.
Target: small, safe, reviewable changes with minimal context.

General rules live in `docs/coding-standards.md`. Skills add domain-specific rules. Workflows route work and own approval gates.

## Command Flow

- `/autopilot spec {requirement}`: write a spec in `docs/specs/` and set it active.
- `/autopilot run`: implement the active spec end-to-end.
- `/autopilot bugfix {description}`: reproduce, isolate, fix, and test a defect.
- `/autopilot refactor {target}`: improve structure without behavior change.
- `/autopilot testgen {target}`: add behavior-focused tests.
- `/autopilot review {diff|file|pr}`: review code across 7 dimensions.
- `/spect-writer init-project`: refresh `docs/project-overview.md`.
- `/cleanup check|run`: inspect or fix housekeeping issues.
- `/review-code diff|file|pr`: review code across 7 dimensions.

## Context Loading Contract

Load once per task, in this order:

1. `AGENTS.md`
2. `docs/project-overview.md`
3. `docs/coding-standards.md`
4. `docs/current-feature.md`
5. exactly one workflow from `.agents/workflows/`
6. only skill/action/reference/template files required by that workflow and task

Do not reload files already loaded. Do not read unrelated templates, references, specs, or source files unless required by the active workflow.

## Multi-Agent Coordination

- **Sequential agents** (one finishes before the next starts): use `docs/current-feature.md` as the handoff interface — it carries Active Spec path, Status, and Sub-spec Queue between agents.
- **Concurrent agents** (running in parallel on the same repo): use a separate git worktree and branch per agent; pass the spec path explicitly instead of relying on `docs/current-feature.md` to avoid overwrites.
- Do not run parallel code edits in the same working tree.

## Workflow Selection

Pick exactly one workflow per task. Priority:

1. **bug-fix.yaml**
2. **feature-development.yaml**
3. **refactor.yaml**
4. **test-generation.yaml**
5. **code-review.yaml**
6. **documentation-update.yaml**

Precedence rules:

- If request is review-only with no edits requested: use **code-review.yaml** (highest precedence).
- Otherwise, if target is `AGENTS.md`, `docs/`, `.agents/workflows/`, `.agents/skills/`, or request is context/token optimization: use **documentation-update.yaml**.

If still ambiguous, ask the user.

## Skill Map

- `autopilot`: spec, plan, implementation, tests, summary, commit proposal, review (delegates to code-review skill).
- `domain-driven-design`: Laravel module boundaries, Actions, DTOs, repositories, events.
- `api-response`: standardized HTTP JSON responses.
- `spect-writer`: project overview initialization.
- `cleanup`: housekeeping checks.
- `code-review`: 7-dimension review.

Advanced autopilot actions (`analyze`, `plan`, `implement`, `summary`, `commit`) are internal/resume points. Prefer the public commands above unless resuming a stopped workflow.

## Workflow Execution

Default: print `## Step: {step_name}` before each workflow step.

Compact mode (only when user asks to minimize output tokens):

- Print step headings only for first step, first implementation step (implement/fix/apply), and final summary step.
- Keep intermediate updates to one sentence each.

## Output Format

Always end with:

```markdown
## Summary
## Files Changed
## Tests
## Notes / Risks
## Next Step
```
