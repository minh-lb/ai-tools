# Secure Coding Rules

Apply security guidance when code crosses trust boundaries, handles identity or sensitive data, communicates over a network, stores/executes input, or changes privileges. Threats depend on the product and deployment; use the applicable project policy, security requirements, and current OWASP guidance. This is a coding checklist, not a penetration-test authorization or a guarantee of security.

## 1. Start with the boundary and threat

- Identify assets (accounts, data, money, availability), actors, entry points, trust boundaries, privileged operations, and the impact of misuse before choosing controls.
- Trace untrusted data from source to every sink: request fields, headers, cookies/tokens, URL, database, file, message, third-party response, configuration, logs, templates, and browser rendering.
- Apply controls at the boundary that owns the decision. Use defense in depth where data can bypass one layer; do not add duplicate controls that create inconsistent policy.
- Fail closed for authorization and sensitive configuration. Do not silently grant access, disable a security control on error, or infer identity from an untrusted client field.
- Follow approved threat models, security policies, privacy rules, and data classification. Ask when a necessary trust or retention decision is unspecified.

## 2. Identity, authorization, and isolation

- Authenticate identity using approved, maintained mechanisms; protect credential exchange, session/token lifecycle, expiration, revocation, and recovery according to the system's threat model.
- Authorize every protected operation on the server, at the resource/action boundary. Check function-level permission and object-level ownership/access; if data is multi-tenant, enforce tenant isolation on every read and write.
- Do not treat a hidden UI control, client route guard, opaque identifier, CORS policy, or untrusted `userId`/`role`/`tenantId` claim as authorization.
- Apply least privilege to service identities, database accounts, files, processes, cloud roles, and deployment credentials. Separate read/write/admin capabilities where practical.
- Check authorization on fields/properties as well as whole objects. Whitelist writable fields and response fields; do not mass-assign attacker-controlled properties into privileged models.
- Make authorization decisions consistent across normal, batch, export, search, background-job, and alternate API paths.

## 3. Input, injection, and output

- Parse and validate external input against explicit schemas, ranges, lengths, allowed enum values, collection depth/count, and request-size limits. Prefer positive allow-lists for structured choices; do not rely on blacklists as the primary defense.
- Normalize/canonicalize only when the contract requires it, and validate the canonical form. Avoid double-decoding, ambiguous path normalization, implicit coercion, and inconsistent validation between layers.
- Use context-appropriate safe APIs at each sink: parameterized database queries; safe process invocation without shell-string construction; safe template APIs; filesystem APIs with canonical path containment; and context-aware encoding for HTML, attributes, URLs, JavaScript, CSS, logs, and headers.
- Treat output encoding as sink-specific. Input validation alone does not prevent XSS or injection; escaping for one context is not automatically safe in another.
- If rich HTML is a product requirement, sanitize with a maintained allow-list sanitizer and constrain allowed elements/attributes/URLs. Do not render raw user HTML or attempt to write a custom sanitizer.
- When query structure or another executable identifier cannot be parameterized, map a validated choice to a fixed trusted set or redesign the operation. Do not concatenate raw user input.

## 4. Browser, API, and network security

- For cookie-authenticated browser mutations, apply the project's CSRF protections and cookie attributes. `HttpOnly` limits script access; it does not itself prevent a browser from sending a cookie with a cross-site request.
- Configure CORS with explicit trusted origins/methods/headers as required. CORS is a browser sharing policy, not authentication or authorization; never reflect arbitrary origins with credentials.
- Protect outbound requests using an explicit destination policy when URLs or hosts can be influenced by untrusted actors. Account for redirects, DNS changes, private/loopback/link-local ranges, and cloud metadata destinations to reduce SSRF risk.
- Authenticate webhooks/callbacks using the provider's supported signature/identity method, verify freshness where relevant, and make replayed delivery safe.
- Use secure transport for networked sensitive traffic. Validate TLS/certificate behavior through approved libraries and configurations; do not disable verification to “fix” connectivity.
- Restrict HTTP methods, content types, origins, and administrative/debug endpoints to the documented exposure. Apply rate, concurrency, payload, and cost limits to authentication, expensive operations, and abuse-prone business flows.

## 5. Files, serialization, and untrusted artifacts

- Treat uploaded, downloaded, archived, imported, and user-selected files as untrusted. Enforce size/count limits; inspect actual content as well as declared type/extension; generate safe storage names; isolate storage from executable/public paths; and scan or quarantine where the risk and product warrant it.
- Prevent path traversal and unsafe archive extraction by resolving paths and verifying the final destination remains within the intended root. Avoid overwriting sensitive files or following attacker-controlled links.
- Use safe parsers and constrained formats. Reject malformed, oversized, deeply nested, or unsupported serialized input; do not deserialize data into executable types or privileged objects without a reviewed safe mechanism.
- Validate external service responses as untrusted input. Do not weaken validation because data came from a vendor or internal network.

## 6. Secrets, cryptography, and privacy

- Keep secrets out of source, client bundles, URLs, screenshots, fixtures, logs, error bodies, and telemetry. Load them only through approved secret/configuration mechanisms and restrict access to the minimum required.
- Use maintained cryptographic libraries and protocols with current, approved algorithms and secure defaults. Never invent a cipher, password-storage format, token protocol, or random-number generator.
- Protect key material, validate cryptographic parameters, use unique nonces/IVs where the chosen scheme requires them, compare secrets with approved constant-time primitives where applicable, and plan key rotation. Verify the library's actual contract rather than copying a code fragment blindly.
- Minimize collection and exposure of personal/sensitive data. Define access, purpose, retention, deletion, export, and audit behavior according to applicable policy. Redact or pseudonymize data in diagnostics unless the data is essential and access is controlled.
- Do not reveal whether a sensitive account/resource exists when enumeration is a realistic threat; use the approved privacy and error policy consistently.

## 7. Errors, logs, dependencies, and abuse resistance

- Give clients safe, stable error information; keep stack traces, SQL, internal hostnames/paths, tokens, and sensitive details in protected diagnostics only when needed.
- Redact secrets and unnecessary personal data from logs, traces, metrics labels, analytics, and audit payloads. Validate or safely encode untrusted log fields to prevent forged records or control characters.
- Log privileged/security-relevant actions with safe actor, target, outcome, and correlation context where the system requires auditability; protect logs from unauthorized access and tampering.
- Review new or changed dependencies for necessity, provenance, maintenance, known vulnerabilities, license, transitive footprint, and update strategy. Pin and update according to the repository's supply-chain policy; do not blindly upgrade or suppress alerts.
- Bound work and cost at exposed endpoints: request/body/file size, pagination, query complexity, execution time, concurrency, retries, and paid external calls. Add rate limits/quotas based on risk and service expectations.
- Retry only when safe and bounded; make sensitive writes idempotent or deduplicated. Treat third-party failures and responses as untrusted and potentially adversarial.

## Security verification prompts

For a relevant change, verify the appropriate subset: input/output boundary, authentication, function/object/property authorization, tenant isolation, secret handling, injection/XSS/CSRF/SSRF or file risks, resource/cost abuse, dependency changes, safe error/logging behavior, and regression tests. Use authorized environments and approved tools. Do not run penetration tests, destructive probes, production scans, or tests that contact real users/services without explicit authorization.

## Source guidance

Use the current, applicable requirements in [OWASP ASVS](https://owasp.org/projects/asvs), the [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/), and the relevant [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/). These are structured guidance, not evidence that an application is compliant or free of vulnerabilities.
