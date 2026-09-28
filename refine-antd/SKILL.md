---
name: refine-antd
description: Guides building and modifying admin panels, dashboards, and internal CRUD tools with the Refine framework (refine.dev) combined with Ant Design (@refinedev/antd). Use this whenever the project depends on @refinedev/core, @refinedev/antd, or refine.dev, or when the user asks to add a resource/page, wire up a data provider, build a list/table/form, add auth, or otherwise work with Refine + Ant Design — even if they just say "add a CRUD page for X" or "hook up this API to the admin panel" in a Refine project. Make sure to reach for this skill before hand-rolling Refine hooks, providers, or antd table/form wiring from memory, since the framework's APIs and prop shapes are easy to get subtly wrong (hook return shapes, antd v4 vs v5, ThemedLayout vs ThemedLayoutV2) without checking the current reference material bundled here.
---

# Refine + Ant Design

Refine (refine.dev) is a headless React meta-framework for CRUD-heavy apps (admin panels, dashboards, internal tools); `@refinedev/antd` is the official Ant Design integration that turns its headless hooks into ready-to-spread antd component props. This skill packages the framework's moving parts — providers, hooks, antd components, routing, auth — into focused reference files plus copy-first templates, so you don't have to reconstruct Refine's API surface from memory or partial recall of older docs/tutorials.

## How to use this skill

1. **Read `references/core-concepts.md` first** if you haven't touched this codebase's Refine setup yet — it explains the provider pattern, `resources`, and the project layout convention everything else assumes.
2. **Find the task's shape below** and jump straight to the reference file(s) and template(s) it points to. Don't read every reference file up front — this skill is split precisely so you load only what the task needs.
3. **Copy from `templates/` or `examples/posts-crud/` rather than writing from scratch.** These are real, checked patterns pulled from the current official docs; adjust names/fields/types rather than re-deriving prop shapes (`tableProps`, `formProps`, `selectProps`, `modalProps`, `drawerProps`, ...) from memory.
4. **Before trusting any Refine snippet you find elsewhere** (older blog posts, an existing file in the repo that looks stale, a Stack Overflow answer) — check `references/gotchas.md`. Refine has real breaking changes across major versions (hook return shapes, antd v4→v5, `ThemedLayout`→`ThemedLayoutV2`, `react-router-dom`→`react-router`), and a snippet that looks right can silently target an older API.
5. **Match the existing project's conventions first.** If the repo already has an established folder structure, data provider, or auth setup that differs from what's described here, follow the existing pattern rather than introducing a second convention — this skill's layout (`references/core-concepts.md`) is the default for a fresh or under-specified setup, not a mandate to refactor an established one.

## Task → reference map

| Task | Read | Copy from |
|---|---|---|
| Bootstrapping a new Refine + antd app, or understanding how an existing one is wired | `references/core-concepts.md`, `references/routing.md` | `templates/app-bootstrap.tsx` |
| Connecting to a REST/custom backend, adding a data provider method | `references/data-provider.md` | `templates/data-provider.ts` |
| Adding login, protecting routes, permission checks, hiding buttons by role | `references/auth-and-access-control.md` | `templates/auth-provider.ts`, `templates/app-bootstrap.tsx` |
| Adding a new CRUD resource (list/create/edit/show pages) | `references/antd-hooks.md`, `references/antd-components.md` | `templates/resource-{list,create,edit,show}.tsx`, or the fuller `examples/posts-crud/` |
| Table features: sorting, filtering, pagination, a relation/foreign-key column | `references/antd-hooks.md` (§`useTable`) | `examples/posts-crud/list.tsx` |
| A quick create/edit that shouldn't navigate away from the list | `references/antd-hooks.md` (`useModalForm`/`useDrawerForm`) | `templates/modal-form.tsx`, `templates/drawer-form.tsx` |
| A multi-step / wizard form | `references/antd-hooks.md` (`useStepsForm`) | `templates/steps-form.tsx` |
| Layout, theming, dark mode, notifications | `references/antd-components.md` | — |
| CSV import/export on a list page | `references/antd-hooks.md` (§Import/export) | — |
| Writing a headless hook or logic not tied to an antd component | `references/core-hooks.md` | — |
| Something in an existing file looks off / doesn't match current docs | `references/gotchas.md` | — |

## Reference files

- `references/core-concepts.md` — providers, `resources`, project layout, scaffolding commands.
- `references/data-provider.md` — the `dataProvider` interface, multi-provider setups, custom endpoints.
- `references/routing.md` — React Router integration specifics, navigation hooks.
- `references/auth-and-access-control.md` — `authProvider` / `accessControlProvider` interfaces and wiring.
- `references/core-hooks.md` — headless `@refinedev/core` hooks (`useTable`, `useForm`, `useSelect`, `useOne`, `useMany`, `useList`, `useCreate`, `useUpdate`, `useDelete`, `useCustom`, `useNotification`, `useInvalidate`, and a pointer list of others).
- `references/antd-hooks.md` — the antd-flavored hooks (`useTable`, `useForm`, `useSelect`, `useModalForm`, `useDrawerForm`, `useStepsForm`, `useCheckboxGroup`/`useRadioGroup`, import/export).
- `references/antd-components.md` — app shell, `ThemedLayoutV2`, view wrappers (`List`/`Create`/`Edit`/`Show`), buttons, fields, `AuthPage`, theming.
- `references/gotchas.md` — version drift and the mistakes this framework/integration invites most often.

## Templates (copy, then adjust names/fields/types)

`templates/app-bootstrap.tsx`, `templates/data-provider.ts`, `templates/auth-provider.ts`, `templates/resource-list.tsx`, `templates/resource-create.tsx`, `templates/resource-edit.tsx`, `templates/resource-show.tsx`, `templates/modal-form.tsx`, `templates/drawer-form.tsx`, `templates/steps-form.tsx`.

## Full worked example

`examples/posts-crud/` — a complete resource (`types.ts` + `list.tsx` + `create.tsx` + `edit.tsx` + `show.tsx`) with sorting, filtering, a resolved relation column, and the `useSelect` `defaultValue` caveat handled correctly. Use this as the target shape when a task needs a fuller reference than the individual templates, or when several patterns need to be seen combined (e.g. a relation that appears in both the table and the form).

## A few things worth internalizing rather than looking up every time

- Everything routes through **providers** passed to `<Refine>`. When a task doesn't obviously belong to a provider, it's almost always page-level work (hooks + antd components), not provider-level.
- `resource` is usually **inferred from the route** — don't pass it explicitly inside a page's "home" hook call unless the hook is being used for something outside that page's own resource (e.g. fetching a relation).
- Import table/form/select hooks from **`@refinedev/antd`** on antd pages, not `@refinedev/core` — the antd versions wrap the core ones and return spreadable props (`tableProps`, `formProps`, `selectProps`). Non-antd-specific hooks (`useOne`, `useMany`, `useShow`, auth hooks, `useCustom`, ...) still come from `@refinedev/core`.
- Always the **V2** layout family (`ThemedLayoutV2`/`ThemedSiderV2`/`ThemedHeaderV2`/`ThemedTitleV2`) and always both `<ConfigProvider>` **and** antd's `<App>` wrapper — see `references/gotchas.md` if either of these surfaces as a bug.
