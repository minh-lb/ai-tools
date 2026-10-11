# Server/Client Boundary Split Pattern

Use this reference only in a repository confirmed to use React Server Components, when the same feature needs server-only data access and client-side interactivity. Server-only modules must not enter the client module graph. Split at the smallest clear component boundary when needed; use the repository's placement and naming conventions. Do not add a split merely to satisfy a template when no server/client constraint requires it.

## The split

- **Server-side owner:** keeps server-only fetching and passes only serializable data needed by the client. It may remain in the existing route/page/module; do not force a new folder.
- **Client-side boundary:** contains the state, effects, browser APIs, or event handlers that require client execution. Keep it small enough to avoid pulling unrelated server-only code into the client bundle. A controller hook is optional and follows local practice.

The file and folder shape is repository-specific; the architectural requirement is the server/client import boundary, not a particular folder structure.

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
      <label htmlFor="product-filter">Filter products</label>
      <input id="product-filter" type="search" onChange={handleFilterChange} />
      {filteredProducts.map((product) => (
        <span key={product.id}>{product.name}</span>
      ))}
    </div>
  );
};

export default ProductListFilters;
```

## Conventions

- Keep async server data access on the server side and client interaction in the client boundary. Use a `controller.ts` only when that matches the repository's pattern.
- Pass only the fields the client component actually needs, not the raw fetch response — see `references/props-design.md` on avoiding oversized prop objects; this also keeps the RSC-to-client serialization payload minimal.
- If server-only imports and client-only behavior currently share a module, split them even when the client interaction is small. Otherwise, a small interaction may remain with its existing component when that is the clearer local design.
- Name and place the client boundary according to the codebase's established component conventions; behavior-oriented names are often easier to understand than mechanical `Client` suffixes.
