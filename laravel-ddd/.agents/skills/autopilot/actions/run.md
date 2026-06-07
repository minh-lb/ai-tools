# Run Action

Pipeline: `analyze -> plan -> implement -> test/fix -> summary -> gate(commit approval when required)`.

Gate policy comes from the active workflow (`GATE.WORKFLOW_OWNERSHIP`).

After the pipeline completes for a **simple spec** (non-epic), set `docs/current-feature.md` Status to `Complete`.

## Epic Detection

Before starting the pipeline, read `docs/current-feature.md`:

- If **Active Spec** points to an `*-epic.md` file: find the first `Active` sub-spec in the Sub-spec Queue and run the pipeline against that sub-spec only. Do not implement the epic file itself.
- After a sub-spec completes: update its status to `Complete` in `docs/current-feature.md`, set the next sub-spec to `Active`, and stop. Do not auto-advance to the next sub-spec without user confirmation.
- If the Sub-spec Queue is `N/A` or empty: the epic breakdown has not been confirmed — stop and ask the user to run `/autopilot spec` to generate sub-specs first.
- If all sub-specs are `Complete`: update `docs/current-feature.md` Status to `Complete` and report the epic as done to the user. Do not move to History — that happens at commit time.

## Stop Conditions

- No active spec and no requirement provided.
- Active spec is an epic but Sub-spec Queue is empty or has no `Active` entry.
- Tests still fail after 3 root-cause fix attempts.
- Git diff includes unrelated or unsafe changes.

## Resume

If stopped, resume with the next action: `plan`, `implement`, `summary`, or `commit`.
