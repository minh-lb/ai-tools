# Refine core concepts

Refine (refine.dev) is a **React meta-framework** for building CRUD-heavy, data-intensive apps: admin panels, dashboards, internal tools, B2B apps. It is intentionally headless at its core and gets its actual look from a **UI integration package** — in this skill, `@refinedev/antd`.

Three axes of "agnostic":

- **Router-agnostic** — React Router, Next.js, Remix, or none, via a swappable `routerProvider`.
- **UI-agnostic** — Ant Design, Material UI, Mantine, Chakra, shadcn/ui, or fully headless HTML.
- **Backend-agnostic** — REST, GraphQL, Supabase, Strapi, Hasura, Airtable, NestJS, Appwrite, Medusa, or a hand-rolled `dataProvider`.

This skill assumes: **React Router v6/v7 + `@refinedev/antd` + a REST-shaped `dataProvider`**, which is the most common combination and the one the official docs default to. If the project uses a different router or a GraphQL/Supabase provider, the antd-specific hooks/components below are unaffected — only `references/data-provider.md` and `references/routing.md` need adjusting.

## The provider pattern

Everything Refine does routes through **provider objects** passed as props to the root `<Refine>` component. Each provider is a plain object implementing a documented interface; Refine's hooks call into whichever provider is configured. Think of it as dependency injection at the framework root — swap a provider, keep every hook and component call site unchanged.

| Provider | Purpose | Reference |
|---|---|---|
| `dataProvider` | CRUD calls to your API | `references/data-provider.md` |
| `routerProvider` | Binds Refine to your router | `references/routing.md` |
| `authProvider` | Login/logout/session/identity/permissions | `references/auth-and-access-control.md` |
| `accessControlProvider` | Fine-grained "can I do this?" checks | `references/auth-and-access-control.md` |
| `notificationProvider` | Toasts on mutations (antd: `useNotificationProvider`) | `references/antd-components.md` |
| `i18nProvider` | Translations | not covered in depth here |
| `liveProvider` | Realtime subscriptions | not covered in depth here |

**Why this matters for you as the coding assistant:** when a task says "add a new resource" or "wire up X", the work almost always decomposes into (1) a `resources` entry, (2) a route, (3) a `pages/<resource>/{list,create,edit,show}.tsx` set built from hooks + antd components — not new provider code. Only reach for provider-level changes (auth, data provider methods) when the task is explicitly about backend wiring, login behavior, or a new API.

## Resources

A `resources` array on `<Refine>` declares each "entity" and maps CRUD actions to route paths:

```tsx
resources={[
  {
    name: "posts",
    list: "/posts",
    create: "/posts/create",
    edit: "/posts/edit/:id",
    show: "/posts/show/:id",
    meta: { canDelete: true, label: "Posts" },
  },
]}
```

Hooks (`useTable`, `useForm`, `useSelect`, ...) **infer `resource` from the current route** when the component is rendered under a matching route — you usually don't need to pass `resource` explicitly inside `pages/posts/list.tsx` etc. Pass it explicitly only when a hook is used outside its "home" route (e.g. fetching a related resource inside a show page).

Two identifiers matter:
- `name` — the actual backend/API resource name, and the default cache key.
- `identifier` — set this instead when the same `name` needs two different UI configurations (e.g. a filtered view of the same backend resource) so their caches don't collide.

## Project layout convention

```
src/
├── providers/
│   ├── data-provider.ts
│   └── auth-provider.ts
├── pages/
│   ├── posts/
│   │   ├── list.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── show.tsx
│   │   └── types.ts
│   └── categories/
│       └── ...
└── App.tsx
```

One folder per resource under `pages/`, each with `list/create/edit/show.tsx` plus a `types.ts` for that resource's TS interfaces. Follow this convention when adding a new resource unless the project already has an established different layout — match what's there first.

## Scaffolding a new project

```bash
npm create refine-app@latest -- --example starter-vite
```

Interactive mode (no `--example`) prompts for UI framework, router, data provider, auth provider, i18n — pick Ant Design + React Router + whatever backend fits.

Manual/minimal setup (for adding Refine into an existing Vite app):

```bash
npm install @refinedev/core @refinedev/cli @refinedev/antd antd @refinedev/react-router react-router
```

Update `package.json` scripts to use the Refine CLI wrapper:

```json
{ "scripts": { "dev": "refine dev", "build": "refine build", "serve": "refine serve" } }
```

## Where to go next

- Wiring the whole app together: `templates/app-bootstrap.tsx` + `references/routing.md`
- Talking to a backend: `references/data-provider.md`
- Login/permissions: `references/auth-and-access-control.md`
- The data hooks (`useTable`, `useForm`, `useSelect`, ...) in their headless (`@refinedev/core`) form: `references/core-hooks.md`
- The same hooks re-flavored for antd (`tableProps`, `formProps`, `selectProps`): `references/antd-hooks.md`
- antd page chrome (`List`/`Create`/`Edit`/`Show`, buttons, fields, layout, theming): `references/antd-components.md`
- Version drift and common mistakes: `references/gotchas.md`
