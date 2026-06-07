---
name: tanstack-query
description: Implement, migrate, and troubleshoot TanStack Query v5 (React Query) in React and Next.js codebases. Use when tasks include installing `@tanstack/react-query`, wiring `QueryClientProvider`, designing query keys/options, building `useQuery`/`useMutation` flows, invalidating or updating cache after mutations, implementing optimistic updates, pagination/infinite queries, prefetching and SSR/hydration, and debugging stale/refetch/testing behavior.
---

# TanStack Query (React v5)

Apply TanStack Query v5 React patterns with predictable cache behavior and minimal boilerplate.

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load `references/react-quick-start.md` when:
- designing advanced query/mutation strategy,
- implementing SSR/hydration/prefetch/testing behavior, or
- validating migration-sensitive v5 choices.

## Workflow

1. Setup:
- Use `@tanstack/react-query` v5 object APIs only.
- Create one shared `QueryClient` and wire `QueryClientProvider` at app root.
- In Next.js App Router: create `app/providers.tsx` as a `'use client'` wrapper that houses `QueryClientProvider`; import `<Providers>` in `app/layout.tsx`. Use `.agents/skills/nextjs-coding/templates/app/providers.tsx.template` as the starting point. Do NOT add `'use client'` directly to `layout.tsx`.
- In Next.js, keep server fetching by default; use TanStack Query for client cache/refetch behavior.

2. Read flows:
- Use array `queryKey` values and include all queryFn-dependent variables.
- Use `useQuery({ ... })` with explicit loading/error/empty/success states.
- Prefer `queryOptions(...)` when the same query contract is reused.

3. Write flows:
- Use `useMutation({ mutationFn, ... })`.
- Apply one cache strategy per mutation path: `invalidateQueries({ queryKey: [...] })` (v5 object form — never the legacy string/array positional form), `setQueryData(...)`, or optimistic rollback (`onMutate`/`onError`/`onSettled`).
- For multi-key invalidation, await `Promise.all(...)` in `onSuccess`.

4. Advanced patterns (only when needed):
- pagination/infinite queries, prefetching, SSR hydration, network modes, focus/refetch tuning.

5. Verify:
- Confirm cache lifecycle and mutation side effects.
- Keep tests isolated with per-test query client wrappers.
- Disable retries in error-path tests unless retry behavior itself is under test.

## Guardrails

- Do not mix legacy positional signatures with v5 object signatures.
- Do not use non-serializable or unstable query keys.
- Do not omit query-dependent variables from `queryKey`.
- Do not skip loading/error UI states.
- Do not forget post-mutation cache strategy; always use v5 object form: `invalidateQueries({ queryKey: [...] })`, `setQueryData(...)`, or `onMutate`/`onError`/`onSettled` rollback — never the legacy positional form.
- Do not permanently disable queries (`enabled: false`) unless imperative fetch behavior is truly required.
- Do not use `skipToken` when you need manual `refetch()` control.
- Do not treat `gcTime` as data freshness; use `staleTime` for freshness policy.
- Do not install workarounds from v3/v4 docs in v5 code without checking migration notes.

## References

- Use [references/react-quick-start.md](references/react-quick-start.md) for full checklist and official documentation map.
- `agents/openai.yaml` — OpenAI agent adapter config for this skill (provider-specific, not loaded by default).
