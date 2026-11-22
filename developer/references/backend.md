# Backend, API, and Service Rules

Apply the rules to server-side services, HTTP or other APIs, event consumers, scheduled/background work, and business logic. Use the project's actual protocol and contract; do not force REST, a specific layering pattern, or particular status codes where another contract applies. For API design, read [API Contracts and RESTful HTTP APIs](api-and-rest.md); apply its REST section only to resource-oriented HTTP APIs. For security-sensitive boundaries, read [Secure Coding Rules](security.md).

## Contracts and boundaries

- Define and preserve the input, output, error, authorization, and state-transition contract. Keep transport-specific concerns at their boundary and business invariants in the owning domain/service layer where the project architecture calls for it.
- Parse and validate all untrusted inputs against the contract, including type, range, size, allowed fields, and cross-field conditions. Reject or safely ignore unexpected fields according to the documented contract; avoid unsafe mass assignment.
- Treat client-provided identity, role, tenant, ownership, and workflow state as untrusted. Authenticate and authorize each protected operation against the specific resource and action, not only by hiding a UI control or checking a broad route role.
- Apply tenant and object-level data isolation on every relevant read and write. Validate that a caller is permitted to perform the requested state transition and cannot skip required workflow steps.
- Bound query results, request sizes, batch sizes, expensive operations, and resource consumption. Add pagination, rate limits, or quotas when the threat and service contract warrant them.

## Errors and side effects

- Return errors in the stable shape and protocol semantics already defined by the service. Give callers enough information to respond, but keep internal implementation details, credentials, and sensitive data out of public errors.
- Preserve useful diagnostic context in protected logs, such as a request/correlation identifier and the operation that failed. Avoid logging secrets, full credentials, or unnecessary personal data.
- Make multi-step writes atomic when the contract requires all-or-nothing behavior. Treat uniqueness and other race-sensitive invariants as concurrent operations; application pre-checks alone are not a substitute for a safe final enforcement mechanism.
- Make retries safe. Use idempotency or deduplication for operations where a timeout, client retry, queue redelivery, or repeated job could duplicate meaningful side effects. Do not retry non-idempotent actions automatically without a safe policy.
- For asynchronous work, define bounded retry/backoff and timeout behavior, duplicate handling, partial failure behavior, and operator visibility where applicable. Ensure a failed or poison item cannot loop forever or disappear silently.
- Keep external calls behind clear boundaries. Apply timeouts and handle dependency failure; avoid assuming a remote call and local database write share one atomic transaction.

## Security and reliability

Use [Secure Coding Rules](security.md) for the detailed threat-boundary checklist. At minimum:

- Apply least privilege to service identities and database/runtime permissions. Store credentials in the project's approved secret mechanism and never expose them in logs, responses, URLs, or examples.
- Use secure transport and the project's approved authentication/session/token mechanisms. Apply CSRF protections when the chosen browser credential model requires them; configure cross-origin access narrowly according to the actual clients.
- Use safe query APIs for persistence; dynamic SQL identifiers or ordering choices must come from a trusted fixed mapping, not raw user text. See [Database and SQL](database-sql.md).
- Avoid leaking whether sensitive resources exist when enumeration is a threat; follow the product's approved privacy/error policy rather than inventing one.
- Make state changes and important failures observable without logging sensitive payloads. Document consequential changes to contracts, config, jobs, or operations.

## Backend verification prompts

Test contract validation, authentication and object-level authorization, tenant isolation, meaningful failure behavior, duplicate/retry/concurrent requests where relevant, and transactional side effects. Use the project's test and security tools in an authorized non-production environment; do not infer security from a passing happy-path test.
