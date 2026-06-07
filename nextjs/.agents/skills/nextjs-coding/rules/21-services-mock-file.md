# Rule 21 - `services/mockApi/<service-name>.mock.ts`

## Purpose
Mock service source for local development and tests.

## Must
- Export mocked functions that match real service return contract.
- Keep mock payload shape stable and deterministic for test usage.
- Stay side-effect free (no real network calls).

## Must Not
- Import or call `api-client.ts`.
- Diverge response contract from `services/<service-name>.service.ts`.
