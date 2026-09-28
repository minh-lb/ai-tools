# Server/Client Boundary Split Pattern

Use this reference only in RSC-enabled repos (Next.js App Router or another RSC-compiling framework — see step 1's detection in `SKILL.md`), when a single requested component needs both:
- server-side data fetching (should stay a Server Component: no client bundle cost, direct data access), and
- client-side interactivity (state, effects, event handlers — requires `'use client'`).

Do not put `'use client'` on the whole component just because part of it is interactive. Split into two components instead.

## The split

- **Outer component** (`components/<kebab-case-name>/index.tsx`): stays a Server Component. `async function`, no `'use client'`, no hooks. Fetches/derives the data and passes it as props to the inner component.
- **Inner component** (its own sibling folder, e.g. `components/<kebab-case-name>-interactive/index.tsx` or a name describing its actual interactive responsibility — not a generic `Client` suffix unless nearby repo convention already uses one): `'use client'`, receives fetched data as props, owns the interactive state via its own `controller.ts` per the standard convention.

This is the same "extract to a sibling component folder" mechanic as `SKILL.md`'s "Split when too large" step — the trigger here is the server/client boundary, not size.

## Example

```tsx
// components/product-list/index.tsx (Server Component)
import { ProductListFilters } from "~/components/product-list-filters";
import { getProducts } from "~/lib/products";

const ProductList = async () => {
  const products = await getProducts();

  return <ProductListFilters products={products} />;
};

export default ProductList;
```

```tsx
// components/product-list-filters/index.tsx (Client Component)
"use client";

import { useController } from "./controller";

type Props = {
  products: Product[];
};

const ProductListFilters = ({ products }: Props) => {
  const { filteredProducts, handleFilterChange } = useController(products);

  return (
    <div>
      <input onChange={handleFilterChange} placeholder="Filter products" />
      {filteredProducts.map((product) => (
        <span key={product.id}>{product.name}</span>
      ))}
    </div>
  );
};

export default ProductListFilters;
```

## Conventions

- Only the inner (client) component gets a `controller.ts` for its interactive state — the outer Server Component has no controller; async data fetching lives directly in its body.
- Pass only the fields the client component actually needs, not the raw fetch response — see `references/props-design.md` on avoiding oversized prop objects; this also keeps the RSC-to-client serialization payload minimal.
- If the interactive part is small (a single button, a single toggle), still extract it — don't leave `'use client'` on a component that also fetches data, even for "just one handler."
- Naming the inner component: prefer a name describing what it does (`ProductListFilters`, `CommentComposer`) over a mechanical `*Client`/`*Interactive` suffix, unless the repo already has an established suffix convention — check 1-2 nearby split components first.
