# Next.js Baseline - Config

Use this reference when the task changes scripts, tsconfig, lint/test configs, or API source switching.

## Baseline scripts (`package.json`)

Use existing script names when present. Otherwise prefer:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## Config checklist

- `tsconfig.json`: strict mode, path aliases aligned to folder structure.
- Alias baseline:
  - set `compilerOptions.baseUrl` to `"."`
  - set `compilerOptions.paths["~/*"]`:
    - `"./src/*"` when app router is `src/app`
    - `"./*"` when app router is root `app`
- Keep `~/` as default internal import prefix after setup.
- Keep lint config compatible with Next defaults.
- Keep formatter config deterministic.
- Configure test environments (`jsdom`/`node`) as needed.
- Configure E2E base URL/retries/trace policy for CI.
- Env handling:
  - define required env keys in a typed schema
  - keep `.env.example` as the canonical documented key list (with placeholders only)
  - create local `.env` or `.env.local` only as needed for local runtime
  - provide safe defaults when acceptable
  - never commit secret values
  - ensure `.env`/`.env.local` are gitignored
  - keep env schema and `.env.example` synchronized

## API source switching

- Keep API source switch in `services/<service-name>.service.ts`.
- Keep mock source in `services/mockApi/<service-name>.mock.ts`.
- Keep real transport in `services/api-client.ts`.
- Switch by `EXTERNAL_API`:
  - `mock` -> mock API
  - `api` -> real API
- Runtime default is `api`.
- For automated tests, prefer `mock` unless spec requires real/sandbox verification.
- Ensure mock and real API share the same response contract type.
- Keep env-switch logic centralized in service layer.

## API client baseline (`services/api-client.ts`)

Use `.agents/skills/nextjs-coding/templates/services/api-client.ts.template` as default when it fits the repo conventions.

Minimum capability checklist:

- `axios.create` with:
  - env-driven base URL (for example `NEXT_PUBLIC_API_BASE_URL`)
  - sane timeout default
  - JSON-friendly default headers
- Request interceptor:
  - auth token injection via centralized getter
  - common headers (`X-Requested-With`, correlation header when used by backend conventions)
- Response interceptor:
  - normalize transport errors into app-level error shape (`name`, user-facing message, optional status)
  - keep raw unknown errors propagated without losing stack/context
- Typed request helper:
  - `request<T>(url, options)` style wrapper
  - supports method, params, body, headers, `signal`, per-request timeout, credentials toggle
- Cancellation:
  - use `AbortController`/`signal` path supported by axios
- Separation of concerns:
  - no domain business logic in `api-client.ts`
  - no direct axios usage in pages/components; services should depend on the shared client

## Global provider setup (`app/providers.tsx`)

When wiring global client-side providers (e.g., `QueryClientProvider`, toast context):

- Create `app/providers.tsx` as a `'use client'` component that wraps `{children}`.
- Import `<Providers>` in `app/layout.tsx` and wrap `{children}` with it.
- Do NOT add `'use client'` to `layout.tsx` directly — this would make the entire app a client component.
- Use `.agents/skills/nextjs-coding/templates/app/providers.tsx.template` as the starting point.

## Additional config/library audit

Before adding new config files or libraries, check:

- Is the capability already covered by Next.js defaults or existing repo setup?
- Does the new config duplicate an existing config with different naming?
- Can the capability be solved by extending existing config instead of introducing a new tool?
- Is the change in approved scope and safety policy (`AGENT.SAFE_OPERATIONS`)?
