# Rule 16 - `services/<service-name>.service.ts`

## Purpose
Feature/domain service integration layer.

## Must
- Encapsulate API calls and response mapping.
- Keep external contract typing explicit.
- Centralize API source switching (`EXTERNAL_API=mock|api`) in this file.
- Default to real API path when `EXTERNAL_API` is missing.
- Let errors propagate naturally to the caller — do not catch and return `null` or a fallback value on network/HTTP failure.
- Ensure the paired mock file (`services/mockApi/<service-name>.mock.ts`) exports the same function names and TypeScript signatures as the real service so both are interchangeable via the `EXTERNAL_API` switch.

## Must Not
- Render UI.
- Depend on route files.
- Scatter API source selection logic into routes, containers, or components.
- Swallow errors silently; callers (controllers, Server Actions) are responsible for handling errors.
