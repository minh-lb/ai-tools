---
name: autopilot
description: "Spec-first AI development pipeline covering requirement, spec, plan, implementation, tests, and optional commit."
---

# Autopilot

Execute `$ARGUMENTS`.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load only `actions/{command}.md` for the command being executed.
- Load `templates/spec-template.md` or `templates/epic-template.md` only when running `spec`.
- Load additional skills/references only when the active action explicitly requires them.

## Commands

- `spec`: create `docs/specs/{kebab-name}.md` from a requirement and set it active.
- `run`: analyze -> plan -> implement (including tests/fixes) -> summary -> commit approval.
  - Skill preload policy for `run` is defined in `actions/run.md`.
- `bugfix`: reproduce -> root cause -> regression test -> fix -> verify.
- `refactor`: baseline -> plan -> change structure -> verify no behavior change.
- `testgen`: inspect behavior -> add useful tests -> run relevant suite.

Advanced actions: `analyze`, `plan`, `implement`, `summary`, `commit`. Read only the matching file in `actions/` when needed.

## Shared Rules

- All shared rule IDs and code rules are in `docs/coding-standards.md`. Do not duplicate them in actions.
- Source of truth for current work: active spec in `docs/current-feature.md` and files under `docs/specs/`.
- Use skill loading rules from each action file and keep loading scoped (`AGENT.SCOPED_READS`).
- New folders/files created by this skill must follow `AGENT.KEBAB_CASE_PATHS`.
- Commit always follows `COMMIT.APPROVAL`.
- Each advanced action has a Prerequisites section — check it before executing steps.
