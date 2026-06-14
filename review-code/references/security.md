# Security

## Focus

Review whether the change preserves confidentiality, integrity, and access control across inputs, identities, secrets, data boundaries, external calls, dependencies, and personal data.

## Inspect

- Authentication, authorization, and tenant scoping
- Input validation and output encoding
- File paths, shell calls, template rendering, and serialization
- Network calls, redirects, webhooks, SSRF exposure, and trust boundaries
- Secret handling, token lifecycle, and logging of sensitive values
- Rate limiting, abuse resistance, and denial-of-service amplification
- **Dependency security**: new packages added — known CVEs, supply chain risk, license compatibility
- **Cryptographic correctness**: algorithm choice (avoid MD5, SHA-1, ECB mode), IV uniqueness, timing-safe comparisons, key derivation and storage
- **Privacy and PII**: personal data collection, retention, masking in logs and errors, access scoping, and compliance boundaries (GDPR, CCPA)

## Review Questions

- Who is allowed to trigger this path, and how is that enforced?
- Can an attacker supply data that changes query shape, file path, command, or template behavior?
- Are secrets or PII ever exposed through logs, errors, client payloads, or metrics labels?
- Does the code trust upstream identity or input more than it should?
- Can retries, race conditions, or idempotency gaps be abused to bypass controls?
- Does any new dependency have known vulnerabilities or an incompatible license?
- Are cryptographic primitives used correctly: right algorithm, unique IVs, timing-safe comparison?
- Is personal data stored only as long as needed, and accessible only to authorized actors?

## Red Flags

- Missing authorization checks on write or read paths
- Client-controlled identifiers used without server-side ownership validation
- Direct string interpolation into SQL, shell, HTML, or config
- Secrets or PII stored in code, config, or logs
- Open redirects, path traversal, insecure deserialization, or unsafe temp-file handling
- Security decisions made only in the frontend or only by convention
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
- Use safe APIs for queries, files, templates, and subprocesses
- Redact secrets and PII from logs, errors, and external payloads
- Add abuse controls where the path can be amplified
- Vet new dependencies for CVEs before merging; pin versions; audit licenses
- Use modern, well-reviewed cryptographic libraries; never roll custom crypto
- Scope PII access, set retention limits, and mask personal fields before logging
