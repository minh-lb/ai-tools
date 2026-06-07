# Plan Action

## Prerequisites

- An active spec must exist in `docs/current-feature.md` with non-empty Goals, Requirements, and Business Rules. If missing, run `spec` or `analyze` first.

Create or refine the `Implement Plan` from the active spec.

**Scope constraint:** May only modify the `Implement Plan` and `Test Plan` sections of the spec file. Must not change `Goals`, `Requirements`, `Business Rules`, or `Out of Scope` sections. If analysis reveals a conflict with those sections, stop and report the conflict to the user before continuing.

Include:

- Ordered rollout steps and file paths.
- Dependency order and technical decisions.
- Test plan: unit tests (Vitest for utilities/actions), lint check (`npm run lint`), typecheck (`npm run typecheck`), build check (`npm run build`), and browser/UI verification for user-facing changes.
- Test case mapping: convert spec `Test Cases` (prioritize P0/P1 first) into concrete test targets/commands.
- Risks or unknowns that affect implementation.

Atomicity (`SPEC.ATOMIC_STEPS`): each step targets exactly one production file. Include the paired test file only when it directly verifies that production file. Per step, include exact file path, one-line technical decision, dependency, and verification. If steps exceed 7 (8 or more), stop and restructure the active spec as an epic before continuing.

For Next.js work, follow this dependency order:
`config/env.ts → types → services/api-client.ts → services/<name>.service.ts → services/mockApi/<name>.mock.ts → containers (types/actions/controller/components/index) → app/routes → tests`

For UI work, include the expected component source (Tailwind composition or CSS Module), required states, accessibility checks, responsive viewports, and how `UI.VISUAL_VERIFY` will be satisfied.

Proceed directly to implementation by default. Ask `Proceed with implementation? (yes/no/adjust)` only when there is missing context, high-risk/destructive impact, or the user explicitly requested a review gate.
