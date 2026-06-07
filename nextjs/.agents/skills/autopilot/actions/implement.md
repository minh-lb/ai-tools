# Implement Action

## Prerequisites

- Active spec must exist in `docs/current-feature.md`. If missing, run `spec` first or ask the user.
- An approved Implement Plan must exist. If missing, run `plan` first or ask the user.

## Steps

1. Read active spec and approved Implement Plan.
2. Create a feature/fix branch when: (a) the user explicitly requests it, (b) the current branch is `main` or `master`, or (c) an open PR already exists on the current branch targeting main. Otherwise implement on the current branch.
3. Set `docs/current-feature.md` status to `In Progress` now, before the first file edit.
4. Implement in dependency order following `docs/coding-standards.md` for all code rules.
5. If the active plan creates, renames, or modifies files in any of these paths (`app/`, `containers/`, `components/`, `services/`, `config/`, `types/`, `utils/`, `constants/`, `styles/`), load `nextjs-coding/rules/README.md` to map each new file to its rule and template; use the matching template from `nextjs-coding/templates/` as the starting point. Exception: files under `containers/**/components/` or `components/**` must go through `react-component-generator` regardless — do not use the bare container component template directly. Load `nextjs-coding/references/nextjs-delivery-checklist.md` for pre-finish validation.
6. If the goal involves UI, apply `frontend-coding-rules`, `docs/design.md` (when it exists and the task has visual decisions), `docs/design-extended.md` (only when needed), and `docs/visual-acceptance.md` when present. Follow `UI.DESIGN_SOURCE_PRECEDENCE`, keep screen-level design sources as the primary reference when provided, verify required viewports/states, and use `react-component-generator` for new components.
7. Write/update behavior tests for changed code following `coding-standards.md` Test Rules.
8. Run `npm run lint` when configured; fix violations before proceeding.
9. Run `npm run typecheck` when configured; otherwise run `tsc --noEmit` when TypeScript is configured. Fix errors before proceeding.
10. Run new and related tests when a test runner is configured. For automated tests, set `EXTERNAL_API=mock` unless the active spec explicitly requires real/sandbox API validation. Fix failures before proceeding.
11. For changed user-facing flows, generate/update E2E tests from `docs/specs` `Test Cases` first (prioritize P0/P1), then run E2E tests when Playwright (or an existing E2E runner) is configured.
12. Run `npm run build`. Fix root causes up to 3 attempts. Stop and report if still failing.
13. Remove debug code and confirm the diff is scoped to the spec.
