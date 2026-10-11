# API Contracts and RESTful HTTP APIs

Use the general rules for any API style. Apply the REST section only when the service is intended to be resource-oriented over HTTP. RPC, GraphQL, messaging, and other protocols have different semantics; do not label an API RESTful merely because it uses HTTP and JSON.

## API design rules (all styles)

### Contract and compatibility

- Treat the API contract as a product boundary shared by producers and consumers. Specify operation identity, request/response shapes, required/optional/null/default semantics, authorization expectations, errors, limits, and consistency/side-effect behavior.
- Maintain one authoritative contract where the project has one (for example, a schema or API description). Generate or validate consumer/provider artifacts from it when the toolchain supports that; do not let code, docs, mocks, and generated clients drift independently.
- Use stable, unambiguous resource/field names and consistent types, units, casing, timestamps/timezones, and enum behavior across related operations. Do not expose internal table layouts, credentials, private fields, or unnecessary implementation details.
- Make additive changes safe for old clients and mixed-version deployments. Treat renames, removed fields, tighter validation, changed defaults, enum changes, and altered error semantics as possible breaking changes. Version/deprecate deliberately when compatibility requires it.
- Document authentication, authorization, pagination, filtering, sorting, rate/size limits, retries, idempotency, and asynchronous completion wherever consumers need those rules to use the API safely.

### Requests, responses, and errors

- Validate request shape, types, allowed fields, sizes, and cross-field constraints at the service boundary. Never rely on the caller UI to enforce the contract.
- Use a consistent error envelope or protocol-native error model. Include stable machine-readable codes and actionable field/detail information when appropriate; keep secrets, stack traces, SQL, internal paths, and sensitive records out of client responses.
- Make status/error codes match what actually happened and what the client can do. Distinguish malformed requests, validation/domain failures, authentication, authorization, conflicts, rate/resource limits, asynchronous acceptance, and service/dependency failures according to the protocol and local contract.
- Return only fields the caller is allowed and expected to receive. Keep error, success, and partial-success shapes explicit; never disguise an error as success merely to simplify clients.
- Set and validate content types and response formats consistently. Bound request and response sizes; do not let a client-controlled filter, sort key, field projection, or pagination value become executable query structure.

### Collections and operations

- Bound collection results. Define pagination and maximum page sizes, stable ordering (including a tie-breaker), and whether totals are exact or approximate. Cursor/keyset pagination is often preferable for large or frequently changing collections; offset pagination can be appropriate for smaller/simple cases.
- Define supported filters and sort fields explicitly. Validate/allow-list dynamic fields and directions; reject unsupported or malformed values according to the API contract.
- Define retry and idempotency behavior for operations that may be repeated because of timeouts, queue delivery, or client retries. Protect meaningful side effects such as charges, orders, messages, and job creation from accidental duplication.
- Make long-running operations explicit: distinguish accepted from completed, expose a documented status/result path when needed, and define cancellation/expiry behavior if supported.
- Use caching only when freshness, authorization scope, and invalidation are understood. Never allow a shared cache to cross user/tenant boundaries or return private data to the wrong caller.

## RESTful HTTP design

### Resource model and URIs

- Model the public API around business resources and relationships, not directly around database tables or internal service layout. Use nouns for resource paths; HTTP methods communicate standard operations.
- Keep collection and item URIs predictable and consistent. Represent relationships with simple, bounded nesting; avoid long URI chains that mirror an entire object graph. Use a custom action endpoint only when the behavior does not map clearly to standard resource state operations, and make its semantics explicit.
- Keep server-generated identifiers and canonical URI rules consistent. Do not let a client choose another resource's identity without an explicit contract and authorization policy.

### HTTP method semantics

Follow [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), the API's declared media/patch formats, and established consumers:

- Use safe retrieval methods for reads; a read request must not secretly trigger a business mutation.
- Use `POST` for creation when the server assigns the new resource identity, or for a documented command/processing operation that does not map cleanly to another method. Do not assume arbitrary `POST` operations are idempotent.
- Use `PUT` for the defined replacement/upsert semantics of a target resource; repeated identical requests should have the method's idempotent intended effect. State whether omitted fields are replaced, preserved, or defaulted.
- Use `PATCH` only with a documented patch media type and precise semantics for omitted, null, added, replaced, and removed fields. Do not leave partial-update behavior ambiguous.
- Use `DELETE` for removal/deactivation semantics of the target resource and define how repeat requests, soft deletion, and dependent resources behave.
- Do not overload a safe/read method to mutate state or use a method merely because a framework makes it convenient. Preserve method semantics through proxies, retries, and redirects.

### Status, representation, and cache semantics

- Use HTTP status codes truthfully and consistently. Typical distinctions include successful completion versus accepted asynchronous work; malformed syntax versus semantically invalid input; unauthenticated versus forbidden; state conflict versus server failure. Follow the chosen contract where multiple codes are valid.
- A `201 Created` response must correspond to creation; include the created-resource location when the contract and protocol call for it. A `202 Accepted` response means processing is not yet complete. A `204 No Content` response must not carry a response body.
- Represent errors consistently and safely. If the API adopts a standard error representation, use it consistently rather than mixing shapes.
- Use content negotiation/media types only as supported by the API. Apply HTTP caching validators and cache directives only when representation freshness and authorization scope permit them.
- Do not claim strict REST constraints such as hypermedia navigation unless the API actually implements them. “Resource-oriented HTTP API” may be a more accurate description for pragmatic REST-like APIs.

## REST/API verification prompts

- Do paths describe domain resources and relationships, or accidentally expose persistence internals?
- Does every method preserve HTTP safety/idempotency semantics and match its side effects?
- Are full replacement and partial update distinct and unambiguous, including null/omitted fields?
- Are status codes, headers, body shape, media type, and async behavior consistent with the actual result?
- Are collections bounded, filter/sort inputs allow-listed, and page order stable across concurrent changes?
- Can older consumers and mixed deployments tolerate the change? Is the authoritative schema/docs updated?
- Are authorization, object/field exposure, rate limits, input validation, and errors safe? Read [Security](security.md) for the security checklist.
