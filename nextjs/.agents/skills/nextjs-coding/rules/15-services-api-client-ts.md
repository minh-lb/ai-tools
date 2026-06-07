# Rule 15 - `services/api-client.ts`

## Purpose
Shared low-level HTTP transport wrapper.

## Must
- Centralize base URL, headers, interceptors, and transport concerns.
- Expose typed request methods used by service files.

## Must Not
- Encode feature-specific business rules.
