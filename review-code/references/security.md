# Security

## Focus

Review whether the change preserves confidentiality, integrity, and access control across inputs, identities, secrets, data boundaries, external calls, dependencies, and personal data.

## Inspect

- Authentication, authorization, and tenant scoping
- Input validation and output encoding
- File paths, shell calls, template rendering, serialization, and untrusted file/archive uploads
- Network calls, redirects, webhooks, SSRF exposure, and trust boundaries
- Browser-facing controls: CORS policy, CSRF protection for cookie-authenticated mutations, cookie attributes, and security headers
- Frontend trust boundaries: client-side authorization assumptions, public bundle/source-map contents, browser storage of credentials/PII, third-party scripts, and client configuration
- DOM/XSS sinks and URL handling: raw HTML/template rendering, unsafe DOM APIs, `javascript:` or other dangerous URL schemes, redirect targets, and `postMessage` origin checks
- Content Security Policy and related browser controls as defense-in-depth; do not treat CSP as a substitute for safe output handling
- Webhook/callback authentication, signature freshness, and replay protection
- Secret handling, token lifecycle, and logging of sensitive values
- Rate limiting, abuse resistance, and denial-of-service amplification
- **Dependency security**: new packages added — known CVEs, supply chain risk, license compatibility
- **Cryptographic correctness**: algorithm choice (avoid MD5, SHA-1, ECB mode), IV uniqueness, timing-safe comparisons, key derivation and storage
- **Privacy and PII**: personal data collection, retention, masking in logs and errors, access scoping, and compliance boundaries (GDPR, CCPA)

## Review Questions

- Who is allowed to trigger this path, and how is that enforced?
- Can an attacker supply data that changes query shape, file path, command, template behavior, or uploaded/extracted file location?
- For browser/cookie-authenticated flows, can a cross-origin page trigger a state-changing request, or does CORS allow an untrusted origin with credentials?
- Are inbound webhook signatures verified and are stale/replayed deliveries controlled?
- Are secrets or PII ever exposed through logs, errors, client payloads, or metrics labels?
- Does the code trust upstream identity or input more than it should?
- Can untrusted data reach an HTML/DOM/script/style/URL sink without context-appropriate handling? Are safe text sinks preferred, and is any intentional HTML sanitized with a well-maintained sanitizer?
- Are authentication and authorization enforced server-side, rather than only by hidden controls, route guards, or client state?
- Does a frontend build bundle private credentials, server-only environment variables, or sensitive source-map data? Treat browser-visible values as public; assess public keys against their intended restrictions rather than flagging their mere presence.
- Is token/session storage appropriate to the threat model, and can XSS or a shared device expose sensitive data? Are cookies configured for their intended security and CSRF model?
- Do `postMessage`, external redirects, deep links, and third-party scripts validate origin, destination, and trust boundaries?
- If validation or security checks were consolidated/removed in the name of simplification, where is the equivalent control enforced, and does it run before the privileged action?
- Can retries, race conditions, or idempotency gaps be abused to bypass controls?
- Does any new dependency have known vulnerabilities or an incompatible license?
- Are cryptographic primitives used correctly: right algorithm, unique IVs, timing-safe comparison?
- Is personal data stored only as long as needed, and accessible only to authorized actors?

## Red Flags

- Missing authorization checks on write or read paths
- Client-controlled identifiers used without server-side ownership validation
- Direct string interpolation into SQL, shell, HTML, or config
- Secrets or PII stored in code, config, or logs
- Open redirects, path traversal, insecure deserialization, unsafe temp-file handling, or archive extraction outside the intended directory
- Missing CSRF mitigation for cookie-authenticated state changes, reflected permissive CORS with credentials, or insecure session-cookie attributes where applicable
- Unsigned/unverified webhooks or replayable callbacks that can repeat sensitive actions
- Security decisions made only in the frontend or only by convention
- A security or trust-boundary validation control is removed for brevity without an equivalent enforced elsewhere
- Untrusted values inserted through raw HTML/DOM sinks, unsafe URL schemes, open redirects, or `postMessage` handlers that accept arbitrary origins
- Private server credentials or secrets exposed in shipped JavaScript, browser storage, or public source maps
- Sensitive authentication state stored in browser-accessible storage without a threat-model justification
- New dependency with a known CVE or without license vetting
- Weak or deprecated cryptographic algorithm; IV reuse; string equality used for secret comparison
- PII written to logs, telemetry, or error payloads without masking

## Evidence

A security finding should describe:

- The actor or input that can exploit the issue
- The missing or weak control
- The data, action, or system exposure that follows

## Remediation Direction

- Enforce authorization on the server at the resource boundary
- Validate and constrain untrusted input before use
- Use safe APIs for queries, files, templates, and subprocesses; constrain upload size/type and isolate stored files where applicable
- Set explicit origin allowlists, CSRF controls, secure cookie attributes, and security headers for the applicable browser surface
- Keep authorization and sensitive validation at the server boundary; treat every browser payload as untrusted
- Prefer safe DOM/text APIs and context-aware output handling; sanitize intentional rich HTML and constrain navigation/redirect/postMessage targets
- Keep private secrets out of client bundles and choose browser storage based on the application's threat model; use CSP as defense-in-depth
- Verify webhook authenticity and freshness, and make replay handling idempotent
- Redact secrets and PII from logs, errors, and external payloads
- Add abuse controls where the path can be amplified
- Inspect declared/locked dependencies and available vulnerability/license evidence; disclose missing or stale audit data instead of claiming a current audit
- Use modern, well-reviewed cryptographic libraries; never roll custom crypto
- Scope PII access, set retention limits, and mask personal fields before logging
