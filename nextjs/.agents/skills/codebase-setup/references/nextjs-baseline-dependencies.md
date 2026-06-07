# Next.js Baseline - Dependencies

Use this reference when the task is selecting or installing dependency groups.

Install only groups approved by the user.

## Core safety/runtime

- `zod` for input/env validation
- optional: `dotenv` (only if runtime requires manual env loading)
- optional: `dotenv-expand` (only when env values reference other env vars and runtime needs expansion behavior)

## HTTP client baseline (when external APIs exist)

- `axios` as the default transport client for `services/api-client.ts`
- Do not add additional HTTP clients in the same baseline unless explicitly requested.
- If the repo already has a standardized HTTP client, keep it and skip axios migration unless user approves.
- Optional supporting packages (add only when capability is missing and approved):
  - `axios-retry` for retry/backoff on transient failures
  - `qs` for nested query serialization contracts that exceed axios default behavior

## Dependency necessity check (before install)

For each proposed package, record:

- missing capability
- why existing stack is insufficient
- expected files/config impacted
- approval status

## Lint and format

- ESLint (Next.js compatible)
- Prettier
- optional plugins used by team convention (for example imports/tailwind sorting)

## Unit/integration tests

- Prefer existing runner in repo.
- If no runner exists, baseline preference in this kit is Vitest.
- Jest is also officially supported by Next.js App Router. If the repo already uses Jest, keep it instead of migrating.
- For React testing:
  - `@testing-library/react`
  - `@testing-library/jest-dom`

## Frontend UI baseline (when UI work is in scope)

- Tailwind CSS baseline must follow the active project convention. For new setups in this kit, prefer Tailwind CSS v4 CSS-config style.
- If UI primitives are required, align with `frontend-coding-rules` stack priority:
  - use Tailwind CSS utility classes first
  - use CSS Modules only when Tailwind is insufficient
- Typical supporting dependencies when missing and approved:
  - `clsx`
  - `tailwind-merge`
  - `lucide-react`

## Client-side data fetching (optional, approval required)

- `@tanstack/react-query` v5 for client-side query/mutation/cache management.
- `@tanstack/react-query-devtools` for development-time cache inspection (dev dependency).
- Add only when the project requires client-side data fetching beyond Next.js server fetching defaults.
- When added, wire `QueryClientProvider` at app root and follow `tanstack-query` skill patterns.

## E2E tests

- Playwright (recommended for real flow E2E in Next.js).
- Initialization command:

```bash
npm init playwright@latest
```

## Automation hooks (optional, approval required)

- Husky + lint-staged
- commit message linting
