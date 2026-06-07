---
name: autopilot
description: "Spec-first AI dev pipeline: requirement -> spec -> plan -> implementation -> tests -> optional commit."
argument-hint: spec|run|bugfix|refactor|testgen|review|analyze|plan|implement|summary|commit
---

# Autopilot

Execute `$ARGUMENTS`.

## Commands

- `spec`: create `docs/specs/{name}.md` and set active spec.
- `run`: analyze -> plan -> implement -> test/fix -> summary -> gate(commit approval when required).
- `bugfix`: reproduce -> root cause -> regression test -> fix -> verify -> summarize.
- `review`: delegate to `code-review` skill; load `.agents/skills/code-review/SKILL.md`.
- `refactor`: baseline -> plan -> structure change -> verify no behavior change -> summarize.
- `testgen`: inspect behavior -> add tests -> run relevant suite -> summarize.

Advanced/internal resume actions: `analyze`, `plan`, `implement`, `summary`, `commit`.
Load only the matching file in `actions/` when needed.

## Shared Rules

- Use `docs/coding-standards.md` as shared rule source.
- Source of truth for current work: `docs/current-feature.md` and `docs/specs/`.
- Load `domain-driven-design` only for backend/module architecture.
- Load `api-response` only for HTTP JSON responses.
- Approval gates are workflow-owned (`GATE.WORKFLOW_OWNERSHIP`).
