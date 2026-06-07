# Next.js Baseline - Verification

Use this reference when verifying setup completion.

## Verification order

Run in this order where applicable:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`
5. `npm run test:e2e` (or scoped playwright command)

If any command is unavailable, report missing setup explicitly.
Also verify at least one `~/` import resolves successfully in both typecheck and build.

## API-client verification (when external APIs are in scope)

- Confirm `axios` is installed and lockfile reflects the change.
- Confirm `services/api-client.ts` compiles under strict TS.
- Confirm at least one domain service imports and uses the shared request helper from `services/api-client.ts`.
- Confirm no new direct axios calls were introduced in route/page/component files.
- Confirm cancellation path (`signal`) and normalized error path are either:
  - covered by a focused test, or
  - explicitly documented as a current gap in the final report.

## Env verification (when env baseline is in scope)

- Confirm `.env.example` exists and includes required non-secret keys.
- Confirm local runtime env file policy is applied (`.env` or `.env.local` as scoped).
- Confirm `.env`/`.env.local` are gitignored.
- Confirm no secret values are present in tracked env/config docs.
- Confirm env schema keys match `.env.example` keys.

## Extra dependency/config sanity check

- Confirm each newly added package/config has a documented capability reason.
- Confirm no overlapping/duplicate tools were added for the same capability.
