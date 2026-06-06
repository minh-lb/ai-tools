# API

## Focus

Review whether the change preserves clear, predictable, and compatible contracts between producers and consumers.

## Inspect

- Request and response schemas
- Validation rules, default values, and optional versus required fields
- Status codes, error envelopes, and retry semantics
- Pagination, filtering, sorting, and idempotency behavior
- Auth requirements, rate limits, and tenancy boundaries (for deep auth and access control review, see [Security](security.md); focus here on whether the contract surface exposes the right requirements to consumers)
- Versioning, deprecation, and generated client expectations

## Review Questions

- Does the contract change in a way that can break existing consumers?
- Are validation and error responses consistent with the rest of the API surface?
- Is idempotency defined for operations that may be retried?
- Are new fields safe for older clients and older servers during rollout?
- Does the API leak internal implementation details or sensitive data?

## Red Flags

- Silent response shape changes without versioning or compatibility plan (if the concern extends to queue payloads, serialized jobs, or mixed-version deployments, see [Backward Compatibility](backward-compatibility.md) — raise one combined finding scoped to the broadest affected surface)
- New required fields added to existing endpoints without phased rollout
- Inconsistent status codes for similar failure modes
- Missing idempotency guard on create, payment, or enqueue operations (if the gap is at the implementation layer — missing deduplication logic, race in queue consumer — see [Concurrency](concurrency.md); raise one finding scoped to where the fix lives)
- Pagination that is unstable under concurrent writes
- Internal errors or stack traces returned to consumers

## Evidence

An API finding should connect:

- The contract surface that changed
- The consumer behavior that will break or degrade
- The rollout or runtime condition that makes it realistic

## Remediation Direction

- Preserve compatibility or version the change explicitly
- Keep request validation and error semantics stable
- Add idempotency keys or server-side deduplication where retries are expected
- Update contract tests and API documentation with the behavioral change
