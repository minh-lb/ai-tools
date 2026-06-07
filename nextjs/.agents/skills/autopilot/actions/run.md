# Run Action

Pipeline: `analyze -> plan -> implement (including tests) -> summary -> commit approval`.

Gate policy and skill loading conditions come from the active workflow (`GATE.WORKFLOW_OWNERSHIP`). Load `.agents/workflows/feature-development.yaml` as the active workflow unless the user's active task maps to a different workflow type. Follow its `context` section for which skills to load on demand.

## Epic Detection

Before starting the pipeline, read `docs/current-feature.md`:

- If **Active Spec** points to an `*-epic.md` file: find the first `Active` sub-spec in the Sub-spec Queue and run the pipeline against that sub-spec only. Do not implement the epic file itself.
- After a sub-spec completes: the completing agent must update its status to `Complete` in `docs/current-feature.md`, then stop and ask for user confirmation before setting the next sub-spec to `Active`. Only the agent that just finished a sub-spec may advance the queue.
- If the Sub-spec Queue is `N/A` or empty: the epic breakdown has not been confirmed; stop and ask the user to run `/autopilot spec` to generate sub-specs first.
- If all sub-specs are `Complete`: update `docs/current-feature.md` Status to `Complete` and report the epic as done. Do not move it to History; that happens at commit time.

## Stop Conditions

- No active spec and no requirement provided.
- `docs/current-feature.md` status is `Not Started` (spec has not been written yet; ask the user to run `/autopilot spec` first).
- Active spec is an epic but Sub-spec Queue is empty or has no `Active` entry.
- Active spec has missing or empty required sections (Goals, Requirements, Business Rules, Implement Plan, Test Plan, or Out of Scope) — ask the user to complete the spec before proceeding.
- Lint, typecheck, tests, or `npm run build` still fail after 3 root-cause fix attempts.
- Git diff includes unrelated or unsafe changes.
- An external dependency (API, database, infrastructure) is required but unreachable after basic troubleshooting — stop and report the blocker clearly rather than implementing against a broken environment.

## Resume

If stopped, resume with the next action: `plan`, `implement`, `summary`, or `commit`.
