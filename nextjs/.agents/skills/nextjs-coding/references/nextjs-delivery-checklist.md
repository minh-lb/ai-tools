# Next.js Delivery Checklist

Load this file only when you need full architecture detail or final validation checks.

## Target Architecture Tree

```text
<source-root>/
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── page.tsx
│   ├── (private)/<url-path-name>/{page.tsx,loading.tsx,error.tsx}
│   └── (public)/<url-path-name>/page.tsx
├── containers/<url-path-name-container>/{types/,actions.ts,components/,controller.ts,index.tsx}
├── components/<component-name>/
├── utils/
├── constants/
├── services/{api-client.ts,<service-name>.service.ts,mockApi/<service-name>.mock.ts}
├── tests/e2e/
├── styles/
├── config/env.ts
└── types/
```

Naming rule: new path segments must be `kebab-case` unless the filename is framework-fixed (`page.tsx`, `layout.tsx`, `index.tsx`, etc.).

## Guardrails

- Do not mix Pages Router (`pages/`) with App Router architecture.
- Do not split App Router across both `app/` and `src/app/`.
- Keep feature routes under `(public)` or `(private)` groups.
- Keep route files thin; delegate orchestration to containers/controllers.
- Keep API transport and source switching in services.
- Keep one source switch point: `EXTERNAL_API=mock|api` in service layer.
- Use `react-component-generator` for component creation in `components/**` and `containers/**/components`.

## Pre-finish Checklist

- [ ] Every changed file maps to `rules/README.md`.
- [ ] Relevant rule files were loaded and applied.
- [ ] Template reuse was considered for new files.
- [ ] Route-to-container delegation is preserved.
- [ ] Service contract alignment is preserved between real service and mock service.
- [ ] E2E scenarios map to active spec test cases (P0/P1 first).
- [ ] For user-facing UI, visual acceptance reporting is included.
- [ ] Substantial changes include lint/build validation evidence.
- [ ] Loading, error, and empty states are handled in the view layer.
- [ ] Mutations have an explicit cache strategy (`invalidateQueries`, `setQueryData`, or rollback).
- [ ] Server Action forms return `{ errors }` for field-level errors and use `useActionState` in the controller.
