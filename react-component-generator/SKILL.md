---
name: react-component-generator
description: Create or refactor small-to-medium React components for the current repository. Use when the user asks for a component or UI block; always create `index.tsx`, and add `controller.ts` or `style.module.css` only when the component actually needs logic separation or scoped CSS. When creating a component, always create/update Unit/Component Test files. Place every component under `components/**`.
---

# React Component Generator

Generate component files that match current repository conventions.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load `coding-rules/references/reactjs.md` and `coding-rules/references/javascript-typescript.md` before generating — they're the authoritative React/TS rule source this skill's own references only paraphrase a subset of.
- Load `references/component-authoring-reference.md` for naming/import/testing conventions.
- Load `references/props-controller-pattern.md` only when component props + controller wiring is non-trivial.
- Load `references/component-delivery-checklist.md` when doing final self-check/reporting for component delivery quality.

## Scope

Use this skill for component-level create/refactor tasks.
Do not use for route architecture or repo-wide setup work.

## Cross-Skill Rules

- Server/client boundary: default a new file to Server Component; add `'use client'` only when the file needs state, effects, refs, browser APIs, or event handlers.
- `coding-rules/references/reactjs.md` and `coding-rules/references/javascript-typescript.md` are authoritative for code shape inside the files this skill generates (e.g. no `React.FC`, no `IProps` naming, destructure props in the signature, guard-clause loading/error states, mandatory error handling, Error Boundaries around data-heavy widgets). They do NOT override this skill's file-layout decisions — the `index.tsx`/`controller.ts`/`style.module.css` folder-per-component convention, the literal filename `index.tsx` (vs. coding-rules' generic `PascalCase.tsx` guidance), and the resulting `export default` on every component (vs. `javascript-typescript.md` §3's general "named exports over default" preference — default export is what makes the `index.tsx`-per-folder layout ergonomic to import) are this skill's own, deliberate, flagged deviations and stay as-is.

## Execution workflow

1. Collect minimal input:
- component name and responsibility (infer when safe).
- environment facts that change codegen decisions: React major version (`package.json`), whether the React Compiler is enabled (`babel-plugin-react-compiler` dependency or `experimental.reactCompiler`/framework config), and the test runner (Vitest vs Jest, from `package.json`/`vitest.config.*`/`jest.config.*`). Infer from repo files; don't ask the user unless genuinely ambiguous.

2. Resolve folder:
- place every component under `components/**` (new folder: `components/<kebab-case-name>/`). Do not place components under `containers/**`.

3. Decide files and choose the matching template:
- No controller, no CSS module → `templates/index.tsx`
- No controller, WITH CSS module → `templates/index.tsx` + `templates/style.module.css`
- With controller, no CSS module → `templates/index-with-controller.tsx` + `templates/controller.ts`
- With controller AND CSS module → `templates/index-with-all.tsx` + `templates/controller.ts` + `templates/style.module.css`
- Always create/update a test file for new components, named `index.test.tsx` by default — but if nearby components already use `index.spec.tsx`, match that suffix instead.
- Add `controller.ts` only when the component uses hooks (`useState`, `useEffect`, `useContext`, `useQuery`, `useMutation`, or any custom hook). Omit for purely presentational components.
- Add `style.module.css` only when Tailwind is insufficient.

4. Apply primitive/styling gate:
- Tailwind CSS first, CSS Module only when Tailwind is insufficient.

5. Split when too large (per `coding-rules/references/reactjs.md` §1: one component per file, split at >~200-300 lines or complex render logic):
- Small sub-component used only by this component → keep inline in `index.tsx`.
- Sub-component too large/complex to stay inline (whether private or reused) → extract to its own sibling component: a new `components/<kebab-case-name>/` folder with its own `index.tsx` (and `controller.ts`/`style.module.css` if it needs them) — re-run this workflow for it. Don't nest it inside the parent's folder and don't use a flat `PascalCase.tsx` file.
- Complex non-trivial logic inside the render → extract to a custom hook in `controller.ts` (or a dedicated hook file if reused elsewhere), not left inline in JSX.

6. Generate and validate:
- Use templates where applicable.
- Ensure no placeholders remain and behavior tests cover owned states/interactions.

## On-demand references (load only when needed)

- `references/component-authoring-reference.md` for naming/props/controller/import/testing conventions and quick examples.
- `references/props-controller-pattern.md` when props-controller wiring is non-trivial.
- `references/component-delivery-checklist.md` for full execution checklist and self-check gates.
- `agents/openai.yaml` — OpenAI agent adapter config for this skill (provider-specific, not loaded by default).
