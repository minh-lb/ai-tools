---
name: nextjs-coding
description: Build and refactor Next.js App Router features in the current repository. Use when tasks involve creating or updating routes (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route groups), wiring providers, adding feature logic, integrating shared utilities and services, or mapping code into the repository's Target architecture. Include automation E2E tests for real user flows using Playwright. Treat the Target architecture as the default source of truth for new code placement and only deviate when the user or an explicit local convention requires it.
---

# Next.js Coding

Implement Next.js App Router code for the target repository.

Use this skill as a thin orchestrator:
- `rules/` defines path-level constraints.
- `templates/` provides starter files.
- Load only what the changed files require.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Always load `rules/README.md` before creating/moving files.
- Load only rule files that match changed paths.
- Load `references/nextjs-delivery-checklist.md` when validating architecture flow, naming constraints, or final delivery checklist.
- Load `references/error-handling-patterns.md` when the task involves API errors, form errors, mutation side effects, or error UI states.
- Load `references/server-vs-client-decision.md` when unsure whether a component or file should be a Server Component or Client Component.

## Workflow

1. Detect layout:
- Determine App Router root (`src/app` or `app`) and set `<source-root>`.
- Match local import alias/path style before editing.

2. Map files before editing:
- Use `rules/README.md` as the path -> rule -> template index.
- Load only rule files for changed paths.
- Reuse template files for newly created paths when applicable.

3. Apply architecture flow:
- Keep route files thin; place orchestration in containers/controllers.
- Keep transport and source switching in services.
- Data flow baseline: `app page -> container index -> controller -> service -> api-client/mock`.

4. Delegate component creation:
- For components under `containers/**/components` or `components/**`, apply `react-component-generator`.

5. Container extension (when container already exists):
- Read the existing `index.tsx` and `controller.ts` before editing — do not replace them.
- Add new state/queries/mutations to the existing `useController`; extend the return type.
- Add new props/UI sections to the existing `index.tsx`; do not change unrelated sections.
- New sub-components go under `containers/<name>/components/` via `react-component-generator`.
- If the container has a `types/index.ts`, add new DTO re-exports there rather than importing directly from the service in the view.

6. Verify:
- Run relevant tests/build checks.
- For user-facing UI, apply `frontend-coding-rules`, `docs/design.md`, and `docs/visual-acceptance.md` when present. Load `docs/design-extended.md` only when detailed density/spacing/component-default/motion guidance is required.

## Guardrails

- Never mix Pages Router (`pages/`) with this architecture.
- Never split App Router across both `app/` and `src/app/`.
- Never put business orchestration in route `page.tsx`.
- Never call external APIs directly from pages/components.
- Never scatter `EXTERNAL_API` checks outside service source-switch points.
- Never create components in target component folders without `react-component-generator`.

## Detailed Reference

- Load `references/nextjs-delivery-checklist.md` for architecture tree, naming constraints, detailed guardrails, and pre-finish checklist.
- `agents/openai.yaml` — OpenAI agent adapter config for this skill (provider-specific, not loaded by default).
