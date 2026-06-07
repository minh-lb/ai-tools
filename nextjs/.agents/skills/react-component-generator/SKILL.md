---
name: react-component-generator
description: Create or refactor small-to-medium React components for the current repository. Use when the user asks for a component or UI block; always create `index.tsx`, and add `controller.ts` or `style.module.css` only when the component actually needs logic separation or scoped CSS. When creating a component, always create/update Unit/Component Test files. Resolve the component path through `nextjs-coding` instead of assuming a fixed component root.
---

# React Component Generator

Generate component files that match current repository conventions.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load `references/component-authoring-reference.md` for naming/import/testing conventions.
- Load `references/props-controller-pattern.md` only when component props + controller wiring is non-trivial.
- Load `references/component-delivery-checklist.md` when doing final self-check/reporting for component delivery quality.

## Scope

Use this skill for component-level create/refactor tasks.
Do not use for route architecture or repo-wide setup work.

## Cross-Skill Rules

- Resolve component placement via `nextjs-coding`.
- For UI primitives/styling priorities, follow `frontend-coding-rules`.
- For user-facing UI, apply `docs/design.md` and `docs/visual-acceptance.md` when present. Load `docs/design-extended.md` only when detailed density/spacing/component-default/motion guidance is required.
- Respect Next.js client/server boundaries from `docs/coding-standards.md`.

## Execution workflow

1. Collect minimal input:
- component name and responsibility (infer when safe).

2. Resolve folder:
- Load `nextjs-coding/SKILL.md` and `nextjs-coding/rules/README.md` if not already in context — they determine correct placement.
- private container UI under `containers/**/components/`.
- reusable UI under `components/**`.

3. Decide files and choose the matching template:
- No controller, no CSS module → `templates/index.tsx`
- No controller, WITH CSS module → `templates/index.tsx` + `templates/style.module.css`
- With controller, no CSS module → `templates/index-with-controller.tsx` + `templates/controller.ts`
- With controller AND CSS module → `templates/index-with-all.tsx` + `templates/controller.ts` + `templates/style.module.css`
- Always create/update `templates/index.test.tsx` for new components.
- Add `controller.ts` only when the component uses hooks (`useState`, `useEffect`, `useQuery`, `useMutation`, or any custom hook). Omit for purely presentational components.
- Add `style.module.css` only when Tailwind is insufficient.

4. Apply primitive/styling gate:
- Follow `STYLE.STACK_PRIORITY` from `frontend-coding-rules`: Tailwind CSS first, CSS Module only when Tailwind is insufficient.

5. Generate and validate:
- Use templates where applicable.
- Ensure no placeholders remain and behavior tests cover owned states/interactions.

## On-demand references (load only when needed)

- `references/component-authoring-reference.md` for naming/props/controller/import/testing conventions and quick examples.
- `references/props-controller-pattern.md` when props-controller wiring is non-trivial.
- `references/component-delivery-checklist.md` for full execution checklist and self-check gates.
- `agents/openai.yaml` — OpenAI agent adapter config for this skill (provider-specific, not loaded by default).
