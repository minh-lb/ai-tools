# TanStack Query React v5 Quick Reference

Checked against official docs on 2026-05-23.

## Start Here

- Overview: `https://tanstack.com/query/latest/docs/framework/react/overview`
- Installation: `https://tanstack.com/query/latest/docs/framework/react/installation`
- Quick Start: `https://tanstack.com/query/latest/docs/framework/react/quick-start`

## Mandatory Baseline Checklist

1. Install `@tanstack/react-query`.
2. Create one app-level `QueryClient`.
3. Wrap app/provider root with `QueryClientProvider`.
4. Use object signatures only (`useQuery({ ... })`, `useMutation({ ... })`).
5. Use top-level array query keys and include all queryFn-dependent variables in each key.
6. Implement explicit loading/error/empty/success UI states.
7. Apply post-mutation cache strategy (`invalidateQueries`, `setQueryData`, or optimistic rollback).

## Defaults You Must Remember

- Important Defaults: `https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults`
- Query key rules and deterministic hashing: `https://tanstack.com/query/latest/docs/framework/react/guides/query-keys`
- Query retries and server-side retry default behavior: `https://tanstack.com/query/latest/docs/framework/react/guides/query-retries`
- Window focus refetch policy: `https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching`

## Core Guides

- Queries: `https://tanstack.com/query/latest/docs/framework/react/guides/queries`
- Query options factory (`queryOptions`): `https://tanstack.com/query/latest/docs/framework/react/guides/query-options`
- Mutations: `https://tanstack.com/query/latest/docs/framework/react/guides/mutations`
- Query invalidation: `https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation`
- Invalidations from mutations: `https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations`
- Optimistic updates: `https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates`

## Advanced Patterns

- Disabling/pausing queries (`enabled`, `skipToken`): `https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries`
- Paginated queries: `https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries`
- Infinite queries: `https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries`
- Prefetching & router integration: `https://tanstack.com/query/latest/docs/framework/react/guides/prefetching`
- Network mode (`online` / `always` / `offlineFirst`): `https://tanstack.com/query/latest/docs/framework/react/guides/network-mode`

## Next.js SSR / Hydration

- Server Rendering & Hydration: `https://tanstack.com/query/latest/docs/framework/react/guides/ssr`
- Advanced Server Rendering (App Router patterns): `https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr`

## Tooling and Quality

- Devtools (`@tanstack/react-query-devtools`): `https://tanstack.com/query/latest/docs/framework/react/devtools`
- ESLint plugin query: `https://tanstack.com/query/v5/docs/eslint/eslint-plugin-query`
- Testing guide: `https://tanstack.com/query/latest/docs/framework/react/guides/testing`
- Migration to v5: `https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5`
