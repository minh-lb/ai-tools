# Server Component vs Client Component Decision

Load this file when you are unsure whether a new component or file should be a Server Component or Client Component.

## Default

All components are Server Components by default. Only add `'use client'` when the component needs one of the following.

## Use `'use client'` when the component:

- Uses React hooks: `useState`, `useEffect`, `useReducer`, `useRef`, `useContext`, `useCallback`, `useMemo`
- Uses TanStack Query hooks: `useQuery`, `useMutation`, `useQueryClient`
- Accesses browser-only APIs: `window`, `localStorage`, `sessionStorage`, `navigator`, `document`
- Has interactive event handlers that update state: `onClick` with `setState`, `onChange` with controlled inputs
- Uses `useRouter`, `usePathname`, `useSearchParams`, `useParams` from `next/navigation`
- Uses `useActionState` / `useFormState` for Server Action wiring

## Keep as Server Component when the component:

- Only renders static or async-fetched data passed as props
- Calls `async/await` data fetching directly (server-side `fetch`, ORM queries)
- Has no interactivity beyond navigation links (`<Link>`)
- Imports only other Server Components

## Architecture boundary rules

| File | Default |
|---|---|
| `app/**/page.tsx` | Server Component (no `'use client'`) |
| `app/**/layout.tsx` | Server Component — use `app/providers.tsx` for client providers |
| `app/**/loading.tsx` | Server Component |
| `app/**/error.tsx` | **Client Component** (`'use client'` required by Next.js) |
| `containers/**/index.tsx` | Client Component (`'use client'` — uses `useController`) |
| `containers/**/controller.ts` | Plain TS module — no `'use client'` needed; exports hooks consumed by `index.tsx` which holds the directive |
| `components/**` | Decide per component using the rules above |
| `services/**` | Neither — plain TypeScript modules |
