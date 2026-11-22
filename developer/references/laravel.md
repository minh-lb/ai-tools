# Laravel

Load for HTTP requests, Eloquent, policies, jobs, and application orchestration. Follow the installed Laravel/PHP versions, repository structure, and configured Pint/test/static-analysis tools. Use built-in framework capabilities before custom layers.

## Request and application boundaries

- Keep controllers focused on transport and orchestration. Use Form Requests for reusable/complex validation and authorization where consistent with the project; inline validation can be appropriate for small endpoints. Validation success does not imply authorization success.
- Apply policies/gates or equivalent checks to the specific resource and action. Route model binding finds a record; it does not by itself authorize it. Scope tenant relations/queries and nested bindings deliberately.
- Persist only validated, explicitly permitted fields. Configure mass-assignment protection deliberately; never pass arbitrary `$request->all()` into writes. Keep role, tenant, owner, server-calculated prices, and workflow changes under server authority.
- Define create vs PATCH validation separately. Use presence/nullability rules intentionally and preserve missing vs explicit null vs false/zero. Account for configured trimming/empty-string middleware before assuming raw input semantics.
- Use API Resources or the project's explicit serializers to control response fields and loaded relations; avoid accidental model/relationship leaks. Keep response/error envelopes compatible with API consumers.
- Extract a service/action when a use case has meaningful orchestration or reuse. Do not create a repository, interface, DTO, event, and service for every model merely to appear SOLID; Eloquent Active Record is an intentional framework pattern.

## Persistence and asynchronous work

- Use Eloquent/query-builder bindings; allow-list dynamic identifiers/order fields. Eager load relationships actually needed by the response to avoid N+1; bound selected columns, relations, and collection size.
- Keep writes that require atomicity in a database transaction; enforce race-sensitive invariants with constraints, locking, or conditional updates as appropriate. Do not keep a transaction open across slow remote calls by default.
- Dispatch jobs/events that depend on committed data after commit with supported configuration/APIs. Transaction rollback must not leave an email/payment/job claiming success; use a durable outbox or reconciliation only where cross-system delivery guarantees require it.
- Make queued jobs safe under duplicate delivery and retry. Configure bounded retries, timeout/backoff and failed-job visibility; re-check relevant state/permissions rather than assuming serialized models remain current.
- Long-running queue/Octane workers can retain state: do not store per-user/tenant mutable context in globals or singleton services. Reload/restart workers as required by deployment changes.
- Read environment values through configuration in application code; keep `env()` access in configuration files where config caching requires it. Never expose secrets or silently default required production configuration.
- For schema changes, use compatible rollout/backfill steps and review locks, defaults, indexes, and rollback limitations; do not assume a down migration recovers deleted data.

## Verification

Use HTTP feature tests for validation, authentication, policies, response fields, and persisted state; unit tests for isolated domain policy. When relevant, cover cross-tenant binding, privileged extra fields, PATCH null/falsy values, duplicate writes, rollback, and after-commit jobs. Queue/mail fakes verify dispatch intent, not delivery or worker behavior; use integration evidence for those claims.
