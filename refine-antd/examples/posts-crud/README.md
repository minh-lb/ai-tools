# Worked example: `posts` CRUD resource

A complete, realistic resource built from the templates + reference patterns in this skill, combined into one coherent example — copy this as the target shape for a new resource's list/create/edit/show set, then trim what doesn't apply.

- `types.ts` — the resource's TS interfaces (`IPost`, and its `category` relation `ICategory`).
- `list.tsx` — sorting (two sortable columns), a status filter (`FilterDropdown` + `Radio.Group`), a resolved relation column (`useMany` for `category`), row actions.
- `create.tsx` / `edit.tsx` — antd `Form` + `useForm`, a relation `Select` via `useSelect`, a plain-options `Select` for the enum-like `status` field. `edit.tsx` additionally shows passing `defaultValue` to `useSelect` from the fetched record, per the caveat in `references/gotchas.md` (#6).
- `show.tsx` — `useShow`/`useOne` from `@refinedev/core` (not antd-specific) feeding antd's `<Show>` chrome and field renderers.

To wire this resource into an app, add a matching entry to `<Refine resources={[...]}>` and a `<Route path="/posts">` block — see `templates/app-bootstrap.tsx`.
