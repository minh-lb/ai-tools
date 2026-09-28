# Core hooks (`@refinedev/core`)

All data/state operations are headless React hooks built on **TanStack Query**. `@refinedev/antd` re-exports flavored versions of the table/form/select hooks that return antd-component-ready props (`tableProps`, `formProps`, `selectProps`) — see `references/antd-hooks.md` for those. This file documents the underlying core hooks, useful when: writing non-antd logic (custom hooks, server actions), understanding what the antd wrapper is built on, or working fully headless in one spot of an otherwise-antd app.

> **Version note:** the return shapes below (`{ result, query }`, `{ mutate, mutation }`) reflect the current docs generation. Older Refine tutorials/blog posts show a flatter `{ data, isLoading }` shape. If a snippet from elsewhere doesn't match what TypeScript reports, check the installed `@refinedev/core` version — see `references/gotchas.md`.

## `useTable`

Extends `useList` with built-in pagination/sorting/filtering state (optionally URL-synced).

```typescript
const {
  result,                          // { data, total }
  tableQuery: { isLoading },
  currentPage, setCurrentPage,
  pageSize, setPageSize,
  pageCount,
  sorters, setSorters,
  filters, setFilters,
} = useTable<IPost, HttpError>({
  resource: "posts",
  pagination: { currentPage: 1, pageSize: 10, mode: "server" }, // mode: "server" | "client" | "off"
  sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  filters: { initial: [] },
  syncWithLocation: true,
});

const posts = result.data;
```

## `useForm`

Manages create/edit/clone form lifecycle: fetch existing record (edit/clone), submit, redirect, notifications, mutation mode.

```typescript
const { onFinish, mutation, query, setId, redirect } = useForm({
  action: "create" | "edit" | "clone", // inferred from route if omitted
  resource: "products",                // inferred from route if omitted
  id: "123",                           // required for edit/clone
  redirect: "list" | "edit" | "show" | "create" | false,
  mutationMode: "pessimistic" | "optimistic" | "undoable",
});
```

`query.data?.data` holds the fetched record in edit/clone mode. Transform values before submit inline in the submit handler, then call `onFinish(transformed)`.

## `useSelect`

Headless dropdown/relation data source.

```typescript
const { options, query, onSearch } = useSelect<ICategory>({
  resource: "categories",
  optionLabel: "title",   // default: "title"
  optionValue: "id",      // default: "id"
  onSearch: (value) => [{ field: "title", operator: "contains", value }],
  defaultValue: 11,       // ensures a pre-selected value exists in options even off-page
});
```

`options` is `{ label, value }[]` ready for a plain `<select>`. This is the headless building block antd's `useSelect` wraps into `selectProps`.

## `useOne` / `useMany` / `useList`

```typescript
const { result: product, query: { isLoading } } = useOne<IProduct>({ resource: "products", id: 1 });

const { result: categories } = useMany<ICategory>({
  resource: "categories",
  ids: result?.data?.map((p) => p.category?.id) ?? [],
});

const { result, query } = useList<IProduct, HttpError>({
  resource: "products",
  pagination: { currentPage: 1, pageSize: 10 },
  sorters: [{ field: "name", order: "asc" }],
  filters: [{ field: "material", operator: "eq", value: "Cotton" }],
});
```

Use `useMany` whenever a table/list needs to resolve a relation column for every row — batch it once rather than one `useOne` per row.

## `useCreate` / `useUpdate` / `useDelete`

```typescript
const { mutate, mutation } = useCreate({ resource: "products" });
mutate({ values: { name: "New Product", material: "Wood" } });

const { mutate: update } = useUpdate({ resource: "products" });
update({ id: 1, values: { name: "New Product" } });

const { mutate: remove } = useDelete();
remove({ resource: "products", id: 1 });

// undoable delete — shows a "Undo" toast for `undoableTimeout` ms before committing
remove(
  { resource: "products", id: 1, mutationMode: "undoable", undoableTimeout: 10000 },
  { onSuccess: () => {}, onError: () => {} },
);
```

`invalidates` defaults to `["list", "many"]` on `useCreate`/`useDelete` — the list this record belongs to auto-refetches after the mutation. Override when a mutation shouldn't trigger the default invalidation.

## `useCustom` / `useCustomMutation`

For non-CRUD endpoints via the data provider's optional `custom` method:

```typescript
const { query } = useCustom<PostUniqueCheckResponse>({
  url: `${apiUrl}/posts-unique-check`,
  method: "get",
  config: { headers: { "x-custom-header": "foo-bar" } },
});
```

## `useNotification` / `useInvalidate`

```typescript
const { open, close } = useNotification();
open?.({ type: "success", message: "Success", description: "..." });

const invalidate = useInvalidate();
invalidate({ resource: "posts", invalidates: ["list", "many"] });
invalidate({ resource: "posts", invalidates: ["detail"], id: 1 });
```

`open`/`close` are no-ops unless a `notificationProvider` is wired (in this stack: `useNotificationProvider` from `@refinedev/antd` — see `references/antd-components.md`).

## Other hooks worth knowing exist (consult docs when needed)

`useShow`, `useInfiniteList`, `useCreateMany`/`useUpdateMany`/`useDeleteMany`, `useDataProvider`, `useApiUrl`, `useCan`, `useGo`/`useBack`/`useNavigation`/`useLink`/`useParsed`, `usePublish`/`useSubscription` (realtime), `useTranslation` (i18n), `useLog`/`useLogList` (audit), `useModal`, `useMenu`, `useBreadcrumb`, `useImport`/`useExport`.
