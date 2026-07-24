---
name: react-component-generator
description: Use when the user asks to create or refactor a small-to-medium React component or UI block, for this repository's `components/**` layout.
---

# React Component Generator

Generate component files that match current repository conventions.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## References

Load each only when its trigger condition applies — don't front-load all of them.

| File | Load when | For |
|---|---|---|
| `coding-rules/references/reactjs.md` + `javascript-typescript.md` | always, before generating | authoritative React/TS rules — this skill's own references only paraphrase a subset |
| `references/component-authoring-reference.md` | naming/import/testing conventions needed | naming, props/controller shape, imports, testing conventions + quick examples |
| `references/props-controller-pattern.md` | component has both props and a controller | the mandatory props-forwarding wiring for this combination — not just for complex cases |
| `references/props-design.md` | component has ~5+ props, you're considering grouping props into an object, or the prop list exceeds ~7 | prop-count review signals, grouping/composition/union-type guidance, required pre-finish checks |
| `references/component-delivery-checklist.md` | final self-check / delivery reporting | self-check gates beyond this file's own workflow |
| `agents/openai.yaml` | provider-specific, not loaded by default | OpenAI agent adapter config |

## Scope

Use this skill for component-level create/refactor tasks.
Do not use for route architecture or repo-wide setup work.

## Cross-Skill Rules

- Server/client boundary: applies only in repos that use React Server Components (Next.js App Router or another RSC-compiling framework — see the `app/`/`next.config.*`/existing-directive detection in step 1). In those repos, default a new file to Server Component; add `'use client'` only when the file needs state, effects, refs, browser APIs, or event handlers. In non-RSC repos (Vite, CRA, plain SPA), never add `'use client'` — it's a no-op string literal there, not a real directive, and its presence would be misleading.
- `coding-rules/references/reactjs.md` and `coding-rules/references/javascript-typescript.md` are authoritative for code shape inside the files this skill generates (e.g. no `React.FC`, no `IProps` naming, destructure props in the signature, guard-clause loading/error states, mandatory error handling, Error Boundaries around data-heavy widgets). They do NOT override this skill's file-layout decisions — the `index.tsx`/`controller.ts`/`style.module.css` folder-per-component convention, the literal filename `index.tsx` (vs. coding-rules' generic `PascalCase.tsx` guidance), and the resulting `export default` on every component (vs. `javascript-typescript.md` §3's general "named exports over default" preference — default export is what makes the `index.tsx`-per-folder layout ergonomic to import) are this skill's own, deliberate, flagged deviations and stay as-is.

## Execution workflow

1. Collect minimal input:
- component name and responsibility (infer when safe).
- environment facts that change codegen decisions: React major version (`package.json`), whether the React Compiler is enabled (`babel-plugin-react-compiler` dependency or `experimental.reactCompiler`/framework config), the test runner (Vitest vs Jest, from `package.json`/`vitest.config.*`/`jest.config.*`), whether the repo uses React Server Components (Next.js `app/` directory, `next.config.*`, or `'use client'`/`'use server'` already present in nearby files) — this decides whether the Server/Client boundary rule below applies at all — and the repo's actual styling approach (Tailwind config, `styled-components`/`emotion`/`@vanilla-extract` in `package.json`, or existing `*.module.css` files in nearby components) — this decides the primitive/styling gate in step 4. Infer from repo files; don't ask the user unless genuinely ambiguous.

2. Resolve folder:
- place every component under `components/**` (new folder: `components/<kebab-case-name>/`). Do not place components under `containers/**`.

3. Decide files and choose the matching template:
- No controller, no CSS module → `templates/index.tsx`
- No controller, WITH CSS module → `templates/index.tsx` + `templates/style.module.css`
- With controller, no CSS module → `templates/index-with-controller.tsx` + `templates/controller.ts`
- With controller AND CSS module → `templates/index-with-all.tsx` + `templates/controller.ts` + `templates/style.module.css`
- Always create/update a test file for new components, named `index.test.tsx` by default — but if nearby components already use `index.spec.tsx`, match that suffix instead.
- Add `controller.ts` only when the component uses hooks (`useState`, `useEffect`, `useContext`, `useQuery`, `useMutation`, or any custom hook). Omit for purely presentational components.
- Add `style.module.css` only when step 4's styling gate resolves to CSS Modules.
- If the repo's detected styling approach is CSS-in-JS (`styled-components`, `emotion`, `@vanilla-extract`) instead of Tailwind/CSS Modules: this skill has no template for it. Skip `templates/style.module.css` entirely and author the style file(s) by hand, following the exact pattern of 1-2 nearby components (file naming, styled-component structure, import placement).
- If the component has both props and a controller, start from the controller template above and add the `Props` type + forwarding wiring per `references/props-controller-pattern.md` — neither controller template includes props by default.

4. Apply primitive/styling gate:
- Match the repo's actual styling approach detected in step 1. If the repo already has an established approach (Tailwind, `styled-components`, `emotion`, CSS Modules, etc.), use that — do not override it.
- `templates/style.module.css` only applies to the Tailwind/CSS-Modules case above; CSS-in-JS repos don't use it (see step 3).
- Only when the repo has no established styling approach yet (greenfield component, no prior signal), default to Tailwind CSS first, CSS Module only when Tailwind is insufficient.

5. Split when too large (per `coding-rules/references/reactjs.md` §1: one component per file, split at >~200-300 lines or complex render logic):
- Small sub-component used only by this component → keep inline in `index.tsx`.
- Sub-component too large/complex to stay inline (whether private or reused) → extract to its own sibling component: a new `components/<kebab-case-name>/` folder with its own `index.tsx` (and `controller.ts`/`style.module.css` if it needs them) — re-run this workflow for it. Don't nest it inside the parent's folder and don't use a flat `PascalCase.tsx` file.
- Complex non-trivial logic inside the render → extract to a custom hook in `controller.ts` (or a dedicated hook file if reused elsewhere), not left inline in JSX.

6. Generate and validate:
- Use templates where applicable.
- Ensure no placeholders remain and behavior tests cover owned states/interactions.
