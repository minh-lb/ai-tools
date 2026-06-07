# Rule 01 - `app/layout.tsx`

## Purpose
Define global app shell only.

## Must
- Export default RootLayout.
- Render `<html>` and `<body>`.
- Wire global providers and global styles only.
- Keep global providers in a separate `app/providers.tsx` client component; import and wrap `{children}` in `layout.tsx`. Use `../templates/app/providers.tsx.template` as the starting point.

## Must Not
- Route-specific data fetching.
- Feature business logic.
- Page-specific UI layout.
- Add `'use client'` to `layout.tsx` itself — use `providers.tsx` as the client boundary instead.
