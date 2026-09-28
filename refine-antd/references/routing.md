# Routing (React Router)

Refine is router-agnostic; a `routerProvider` package binds it to a specific router. This skill assumes **React Router v6/v7** via `@refinedev/react-router`, the most common pairing and the one the current antd docs default to.

## Install

```bash
npm i react-router @refinedev/react-router
```

Note the package is `react-router` directly (React Router's v7-unified package), **not** `react-router-dom`. If a project pins an older React Router (v6.x with `react-router-dom`), check `@refinedev/react-router`'s peer-dep requirements before assuming this import path — a migration guide exists at `.../routing/integrations/react-router/migration-guide-v6-to-v7/` for that gap.

## What the router provider gives you

- Automatic `resource`/`action`/`id` inference from the current URL (so `useTable`/`useForm`/etc. don't need explicit `resource` props inside their "home" page).
- `syncWithLocation` — mirrors list state (pagination/sorters/filters) into the URL query string, so a table's state survives a refresh and is shareable as a link.
- Router-agnostic navigation hooks: `useGo`, `useBack`, `useNavigation`, `useLink`, `useGetToPath`, `useParsed`, `useResourceParams` — use these instead of importing `useNavigate`/`Link` directly from `react-router` when the code should stay portable across router integrations.

## You still declare the routes yourself

The router integration does not generate `<Route>` elements from `resources` — it only lets Refine *understand* routes you declare. Each resource's `list`/`create`/`edit`/`show` strings must match real `<Route path="...">` entries. See `templates/app-bootstrap.tsx` for the full pattern: an authenticated route group wrapping `<ThemedLayoutV2><Outlet/></ThemedLayoutV2>`, with one `<Route>` block per resource action, plus a public route group for `<AuthPage>` variants.

## Other router integrations

If the project uses Next.js or Remix instead, the `resources`/hooks/antd-component layer is unchanged — only swap `routerProvider` for `@refinedev/nextjs-router` or `@refinedev/remix-router` and adjust the route-declaration mechanism to that framework's own routing (file-based for both). Consult `https://refine.dev/core/docs/routing/integrations/` for the specific package.
