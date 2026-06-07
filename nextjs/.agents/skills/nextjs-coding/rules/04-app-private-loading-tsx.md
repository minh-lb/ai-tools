# Rule 04 - `app/(private)/<url-path-name>/loading.tsx`

## Purpose
Route-level suspense fallback.

## Must
- Be lightweight and fast to render.
- Represent real loading state for the private route.

## Must Not
- Fetch data.
- Hold business logic.
