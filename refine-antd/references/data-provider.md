# Data provider

`dataProvider` is the single abstraction between Refine's hooks and your backend. It's a plain object of async methods. Refine calls the right method based on which hook/action fires. Official adapters exist for REST (`@refinedev/simple-rest`), GraphQL, Supabase, Strapi v4, Hasura, Airtable, NestJS Query/CRUD, Appwrite — prefer an official adapter over hand-rolling one if the backend matches.

## Interface

```typescript
import type { DataProvider } from "@refinedev/core";

const dataProvider: DataProvider = {
  // required
  getList: ({ resource, pagination, sorters, filters, meta }) => Promise<{ data; total }>,
  create: ({ resource, variables, meta }) => Promise<{ data }>,
  update: ({ resource, id, variables, meta }) => Promise<{ data }>,
  deleteOne: ({ resource, id, variables, meta }) => Promise<{ data }>,
  getOne: ({ resource, id, meta }) => Promise<{ data }>,
  getApiUrl: () => string,

  // optional — implement when you need them
  getMany: ({ resource, ids, meta }) => Promise<{ data }>,
  createMany: ({ resource, variables, meta }) => Promise<{ data }>,
  deleteMany: ({ resource, ids, variables, meta }) => Promise<{ data }>,
  updateMany: ({ resource, ids, variables, meta }) => Promise<{ data }>,
  custom: ({ url, method, filters, sorters, payload, query, headers, meta }) => Promise<{ data }>,
};
```

**Implement `getMany` if the backend supports batch fetch.** If you skip it, Refine transparently falls back to firing one `getOne` per id — harmless for a handful of rows, a real N+1 problem for a table that resolves a relation column (e.g. `category` name) for every row via `useMany`.

See `templates/data-provider.ts` for a hand-rolled REST implementation skeleton (fetch-based, matching `https://api.fake-rest.refine.dev` shape used throughout the official docs and this skill's examples).

## Wiring

```tsx
import { Refine } from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";

<Refine dataProvider={dataProvider} />
```

## Multiple data providers

Needed when different resources live on different backends:

```tsx
<Refine
  dataProvider={{
    default: dataProvider(API_URL),
    fineFoods: dataProvider(FINE_FOODS_API_URL),
  }}
  resources={[
    { name: "posts" },
    { name: "products", meta: { dataProviderName: "fineFoods" } },
  ]}
/>
```

Any hook accepts a `dataProviderName` param to target a non-default provider explicitly (e.g. `useList({ resource: "products", dataProviderName: "fineFoods" })`).

## Custom, non-CRUD endpoints

Implement the optional `custom` method, then call it via `useCustom` (query) or `useCustomMutation` (mutation) — see `references/core-hooks.md`.
