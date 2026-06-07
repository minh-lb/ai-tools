# Component Authoring Reference

Load this file only when the task needs detailed conventions or examples.

## Naming conventions

- Component name: `PascalCase`
- Component folder (new): `kebab-case` (for example `OrderSummary` -> `order-summary`)
- Hook: `useController`
- CSS module classes: `camelCase`
- Export style: default export

## Props conventions

- Create `IProps` only when props exist.
- Required props: no `?`.
- Optional props: use `?`.
- Add `children?: React.ReactNode` only when children are rendered.

## Controller conventions

Create `controller.ts` only when the component needs at least one of:
- `useState`, `useEffect`, `useContext`, `useCallback`, or `useMemo`
- TanStack Query hooks (`useQuery`, `useMutation`)
- Any other custom hook that encapsulates side effects or async logic

If the component is purely presentational (renders props into JSX with no hooks), omit `controller.ts`.

- No-props signature: `export const useController = () => { ... }`
- With props: `export const useController = (props: IProps) => { ... }`
- Import `IProps` from `./index`.
- Pass full `props` to `useController(props)` unless local style says otherwise.
- Return only values used by the view.

## Import conventions

- Same folder: relative imports (`./controller`, `./style.module.css`).
- Cross-module: use `~/` alias when configured.
- Reusable wrappers: place under `components/*`.
- Use `import type` for type-only imports.

## Testing conventions

- Every new component should include `index.test.tsx`.
- For refactors, update existing tests when behavior changes.
- Prefer behavior assertions over implementation-detail assertions.
- Cover states owned by the component: loading, empty, error, disabled, success (when applicable).

## Quick examples

- `ProductCard`: `index.tsx` + `index.test.tsx`
- `LoginForm`: `index.tsx` + `controller.ts` + `index.test.tsx`
- `DashboardShell`: `index.tsx` + `style.module.css` + `index.test.tsx`
- `FilterPanel`: all files above + `index.test.tsx`
