# Component Authoring Reference

Load this file only when the task needs detailed conventions or examples.

This skill decides file layout and template selection; for the underlying React/TypeScript rules (component design, hooks, state, a11y, security) `coding-rules/references/reactjs.md` and `coding-rules/references/javascript-typescript.md` are authoritative — when in doubt, defer to those files over anything below.

## Naming conventions

- Component name: `PascalCase`
- Component folder (new): `kebab-case` by default (for example `OrderSummary` -> `order-summary`) — but if 1-2 nearby components already use a different case (e.g. PascalCase folder matching the component name), match that instead. Check nearby components before naming the new folder.
- Hook: `useController`
- CSS module classes: `camelCase`
- Export style: default export
- Sub-component split out of an oversized `index.tsx`: same sibling-component-folder convention as any other component (private or not) — see `SKILL.md`'s Execution workflow step 5 ("Split when too large") for the full rule.

## Props conventions

For deciding which props a component should expose in the first place — prop-count review signals, grouping into objects, boolean vs. union-type props, and when to split the component instead — see `references/props-design.md`. The conventions below cover shape/naming/typing of props once the set is decided.

- Create `type Props = {}` (or `interface Props` only if it needs to be extended/declaration-merged) only when props exist. Never `IProps` — no Hungarian prefix, per `coding-rules/references/reactjs.md` §6.
- Do not `export` the `Props` type by default. Export it only when something outside `index.tsx` actually needs to import it — in practice, this means: the component has a `controller.ts` that imports it via `import type { Props } from "."` (see Controller conventions), or a parent/sibling file genuinely needs to reference the same shape. A component with no `controller.ts` and no external consumer of its prop shape keeps `type Props = {}` unexported.
- Do not type the component with `React.FC<Props>`. Type the destructured parameter directly: `({ value }: Props) => {}`.
- Destructure props in the function signature — no `props.x` access in the body — except the props-controller pattern below, where the whole `props` object is intentionally forwarded to `useController(props)`.
- Required props: no `?`.
- Optional props: use `?`.
- Add `children?: React.ReactNode` only when children are rendered.
- Guard numeric conditions explicitly in JSX: `count > 0 && <Badge />`, never bare `count && <Badge />` (renders a literal `0`).
- Guard-clause loading/error/empty states with early returns above the main `return`, not nested ternaries inside the JSX.

## Controller conventions

Create `controller.ts` only when the component needs at least one of:
- `useState`, `useEffect`, or `useContext`
- TanStack Query hooks (`useQuery`, `useMutation`)
- Any other custom hook that encapsulates side effects or async logic

If the component is purely presentational (renders props into JSX with no hooks), omit `controller.ts`.

Once `controller.ts` exists, `index.tsx` becomes pure render/composition: it may only call `useController(...)`, destructure its return, and return JSX (plus JSX-only helpers like guard-clause early returns). Do not add `useState`/`useEffect`/inline computation/business logic directly in `index.tsx` alongside the controller call — every hook and every piece of logic goes into `controller.ts`, never split between the two files.

Don't add `useMemo`/`useCallback` by default when generating controller logic, and don't treat them as a reason to create `controller.ts` on their own — per `coding-rules/references/reactjs.md` §5, if the project has the React Compiler enabled, manual memoization is unnecessary for new code; add it only for a stated reason (third-party referential-equality dependency, or a profiled hot path).

When `controller.ts` calls `useQuery`/`useMutation`, handle the error state explicitly (see the `error` field in `references/props-controller-pattern.md`'s example) — non-suspense TanStack Query errors don't throw during render, so a JSX guard-clause on `error` is enough. Only wrap the component in a local Error Boundary (per `coding-rules/references/reactjs.md` §9) when the query is used in Suspense mode (`useSuspenseQuery`) or another hook can throw during render — that's the case an in-JSX guard-clause can't catch.

- No-props signature: `export const useController = () => { ... }`
- With props: `export const useController = (props: Props) => { ... }`
- Import `Props` from `./index` (`import type { Props } from "."`) — this is the case that requires `index.tsx` to `export type Props` (see Props conventions above); a no-props controller needs no `Props` export at all.
- Pass the full `props` object to `useController(props)` unless local repo style says otherwise — this is the one deliberate exception to destructuring props in the component signature (see Props conventions above).
- Return only values used by the view.

## Import conventions

- Same folder: relative imports (`./controller`, `./style.module.css`).
- Sibling component (e.g. importing a component split out under "Split when too large"): `~/` alias when configured, otherwise relative (`../<kebab-case-name>`).
- Cross-module: use `~/` alias when configured.
- Use `import type` for type-only imports.
- Reusable components that need to accept a DOM ref from the parent (inputs, buttons, wrappers around native elements) should accept `ref` as a normal prop (React 19+) or use `forwardRef` on React 18 codebases — check which the repo targets before generating.

## Testing conventions

- Every new component should include a test file, `index.test.tsx` by default — check nearby components first; if they use `index.spec.tsx` instead, match that suffix.
- For refactors, update existing tests when behavior changes.
- Prefer behavior assertions over implementation-detail assertions.
- Cover states owned by the component: loading, empty, error, disabled, success (when applicable).
- Detect Vitest vs Jest from the repo before generating: `vi.fn()`/`vi.mock()` for Vitest, `jest.fn()`/`jest.mock()` for Jest. Don't hardcode one.
- When `controller.ts` calls `useQuery`/`useMutation`, mock the `./controller` module in `index.test.tsx` to drive each state (loading/error/success) — don't stand up MSW at this level; per `coding-rules/references/reactjs.md` §8, MSW is for container/integration tests that exercise the real controller against the network boundary.

## Quick examples

- `ProductCard`: `index.tsx` + `index.test.tsx`
- `LoginForm`: `index.tsx` + `controller.ts` + `index.test.tsx`
- `DashboardShell`: `index.tsx` + `style.module.css` + `index.test.tsx`
- `FilterPanel`: all files above + `index.test.tsx`
