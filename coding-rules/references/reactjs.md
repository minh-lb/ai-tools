# Coding Rules: ReactJS (JavaScript + TypeScript)

> Read with `javascript-typescript.md` for language-level rules.

## 1. Component design

- Small, single responsibility. File >~200-300 lines or complex render logic → split into child components/custom hook.
- Function components + hooks by default; class components only for unmigrated legacy code.
- Props typed via `interface`/`type`. Avoid uncontrolled `{...props}` spreading unless the component is a thin wrapper.
- Container (data/logic) vs. presentational (render only) split when a component both fetches and renders complex UI — not mandatory for small projects.
- File name = component name, `PascalCase.tsx`.
- Folder structure: group by feature/domain (`features/orders/{OrderList.tsx, useOrders.ts, orders-api.ts}`) once the app has several distinct domains, not by type (`components/`, `hooks/` mixing every feature together) — see the same rule in `javascript-typescript.md`. Small apps can stay type-grouped.

## 1.1 Writing the component body

- Destructure props in the function signature, not repeated `props.x` access:
  ```tsx
  function UserCard({ user, onSelect }: UserCardProps) { ... }
  ```
- Default values via destructuring defaults (`{ size = 'md' }: Props`), not `defaultProps` (deprecated for function components).
- Event handler naming: `handleX` for the function defined/used inside the component, `onX` for the prop a parent passes in (`onClick`, `onSubmit`).
- Guard/early-return loading, error, and empty states at the top of the function body before the main JSX, instead of nesting them as ternaries deep inside the return:
  ```tsx
  function UserProfile({ userId }: Props) {
    const { data, isLoading, error } = useUser(userId);
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!data) return null;
    return <div>{data.name}</div>;
  }
  ```
- `&&` for simple single-element conditional rendering only; guard against a falsy-but-renderable value (`count && <Badge/>` renders a literal `0` when `count` is `0`) — use `count > 0 && <Badge/>` or a ternary instead.
- No non-trivial expression/logic inline inside JSX — compute it in a variable above the `return` and reference the variable.
- Use a Fragment (`<>...</>`) instead of an unnecessary wrapper `<div>` purely to satisfy "one root element."
- One component per file as the default; a small, genuinely-private sub-component used only by its parent may live in the same file, but anything reused elsewhere gets its own file.
- Prefer the `children` prop (composition) over a config object with many boolean/variant props when a component's content varies more than its behavior.
- Pick controlled or uncontrolled for a given input and stay consistent — never switch a controlled input's `value` from a real value to `undefined` (or vice versa) across renders; this causes a React warning and loses correctness. Provide a stable initial value (`''`, `0`) instead of `undefined`/`null` for a controlled input's starting state.

## 2. Hooks

- Rules of Hooks: only at top level, never in conditionals/loops/nested functions.
- `useEffect`: declare the full dependency array — don't drop a dependency to silence a warning. `[]` only for genuine mount-only side effects, not for syncing state. Cleanup mandatory for subscriptions/timers/listeners:
  ```tsx
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  ```
  Don't use `useEffect` to derive a value computable from existing state/props — compute inline or `useMemo`.
- `useState`: don't duplicate state that's derivable from other state. Use functional updates (`setCount(prev => prev + 1)`) when updating from previous value, especially in closures.
- `useMemo`/`useCallback`: only for a concrete reason (expensive re-render, heavy computation, referential equality for a dependency) — not by default everywhere.
- Custom hooks: name `use*`, self-contain state+effect+logic, return a clear API.

## 3. State management

- Local state (`useState`/`useReducer`) first; lift to context/store only when genuinely shared across unrelated components.
- Complex multi-action state (wizards, multi-step forms) → `useReducer` over scattered `useState`.
- Context for rarely-changing data (theme, auth, i18n) only — not for high-frequency-changing values (every consumer re-renders).
- App-wide complex state at scale → dedicated library (Redux Toolkit, Zustand, Jotai), not a hand-rolled Context store.

## 4. Async data / API calls

- API logic in a service/hook (`useUsers()`), not inline in components — component only consumes `data`/`isLoading`/`error`.
- Many API calls with caching/refetch → React Query/SWR over hand-rolled `useEffect` fetches.
- Always handle loading, error, and success/empty — not just the happy path.
- Cancel/ignore stale results on param change:
  ```tsx
  useEffect(() => {
    let ignore = false;
    fetchUser(id).then(data => { if (!ignore) setUser(data); });
    return () => { ignore = true; };
  }, [id]);
  ```

## 5. Rendering & performance

- Stable unique `key` from real data — never array index if the list can reorder/add/remove.
- Avoid creating new objects/arrays/functions in JSX for a `React.memo`-wrapped child (breaks memoization).
- `React.memo` only for expensive components with stable props, not by default.
- `React.lazy` + `Suspense` for routes/heavy components not needed on initial load.
- Avoid inline styles recomputed every render when a CSS class/module/Tailwind would do.

## 6. TypeScript in React

- Props via `interface`/`type`; avoid `React.FC` (implicit `children`, awkward generics):
  ```tsx
  interface UserCardProps { user: User; onSelect?: (id: string) => void; }
  function UserCard({ user, onSelect }: UserCardProps) { ... }
  ```
- No `any` for event handlers — use `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, etc.
- Define API response types once (`types/api.ts`), reuse between hook and component.

## 7. API communication (frontend calling a backend)

- Base URL/HTTP client configured centrally, not hardcoded per component.
- Handle HTTP errors by status code consistently (401 → login redirect, 422 → field errors, 500 → generic message).
- Map backend field-level validation errors (e.g. Laravel's `{ errors: { email: [...] } }`) into form error state.
- If auth relies on cookies (see client-side security below), requests MUST send credentials explicitly (`credentials: 'include'` for `fetch`, `withCredentials: true` for axios) — the backend's CORS config (see `laravel.md`) must also allow the specific origin, not `*`, for this to work.

## 8. Testing

Test user-visible behavior (RTL: query by role/text), not implementation details. Mock the API layer, not internal HTTP libraries.

## 9. Error boundaries (mandatory)

- At least one top-level Error Boundary wrapping the route tree.
- Local Error Boundary around third-party/user-generated/data-heavy widgets that could throw.
- Error Boundaries catch render-phase errors only — NOT event handlers/async/`useEffect` (use try/catch or the loading/error pattern from section 4 for those).
- Log the error before showing fallback UI.

## 10. Accessibility baseline

- Semantic HTML for interactive elements (`<button>`, `<a>`, `<input>`), not `<div onClick>`.
- `alt` on every `<img>` (empty for decorative).
- `<label>` associated with every form input — placeholder is not a substitute.
- Custom interactive components (modal, dropdown, tabs) support keyboard nav (Tab/Enter/Escape) + ARIA if not built on semantic HTML.

## 11. Client-side security

- Auth tokens/session IDs MUST NOT go in `localStorage`/`sessionStorage` when avoidable (any XSS = full takeover) — prefer `HttpOnly` cookie.
- Never `dangerouslySetInnerHTML` with unsanitized content (see XSS rule in `javascript-typescript.md`).

## Anti-patterns to avoid

- Prop drilling beyond 3-4 levels → Context or state library.
- `setState` during render (not in effect/handler) → infinite loop.
- Side-effect logic mixed into JSX without extraction.
- Copying a prop into local state (`useState(props.value)`) without syncing — derive from props directly, or use `key` to reset.
- Deeply nested ternaries inside JSX for loading/error/empty states instead of early returns.
- `count && <Badge/>` style falsy-render bugs — guard numeric conditions explicitly (`count > 0 && ...`).
