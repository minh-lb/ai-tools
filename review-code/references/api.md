# API

Review contracts between producers and consumers: HTTP/RPC/GraphQL APIs, SDKs, events and webhooks. Inspect schemas, validation/defaults, auth/tenant boundaries, status/error envelopes, pagination/order, retry/idempotency, compatibility and consumer handling. Use the actual protocol and documented provider contract; HTTP status preferences do not transfer to RPC or GraphQL.

## Contract checks

- Trace changed fields, nullability, units, defaults, enum values and error types to real consumers and old clients/data.
- Check deterministic pagination under inserts/deletes, stable ordering, bounded page sizes and cursor/filter consistency.
- Define idempotency scope/key lifetime and behavior for duplicate/concurrent/replayed requests. Verify the implementation, not only the presence of a key field.
- Verify auth requirements and ownership checks at the server boundary; client validation is not enforcement.
- Separate internal diagnostic detail from safe public errors; preserve correlation without exposing secrets.
- Check timeout, cancellation and retry ownership; a lost response does not prove the side effect failed.

## HTTP review cues

Use [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) when exact semantics are material. Review actual consumer impact and protocol requirements rather than flagging every difference from a preferred convention.

| Outcome | Check |
|---|---|
| Success/creation | 200 for successful response; 201 indicates resource creation; 202 indicates accepted but incomplete work. Check what operation/resource the acknowledgment covers. |
| No content | HEAD, 204 and 304 responses have no response content; ensure framework serialization agrees. |
| Authentication/access | 401 requires an authentication challenge; 403 is refusal and need not imply successful authentication. A server may use 404 to conceal a forbidden resource. |
| Bad input/conflict | 400/422 depend on validation contract; 409 for state conflicts. 412 reflects failed explicit preconditions; required-but-missing preconditions may use 428. |
| Throttling/outage | Distinguish 429, local service failure and gateway failure; check retry guidance and safety rather than assuming every 5xx is retryable. |
| Redirect/cache/range | Preserve/change methods intentionally; validate conditional retrieval and Range semantics. 206 is range content, not arbitrary partial business success. |

A webhook that durably accepts/enqueues an event can intentionally return 200/204 according to the provider's delivery contract. Do not require 202 solely because downstream processing is asynchronous. A payment acceptance acknowledgment also need not claim settlement. Report overstated success only when the response contradicts the defined operation and misleads consumers.

## Finding standard

Show the exact contract, triggering request/state, source coordinates and affected consumer outcome. For a status-code issue, explain the protocol violation or broken client behavior. For compatibility beyond a live API, consult [Compatibility](backward-compatibility.md); for implementation races, [Concurrency](concurrency.md). Report one root cause with the fix at the owning boundary, including focused contract/regression tests.
