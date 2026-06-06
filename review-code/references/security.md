# Security

## Focus

Review whether the change preserves confidentiality, integrity, and access control across inputs, identities, secrets, data boundaries, and external calls.

## Inspect

- Authentication, authorization, and tenant scoping
- Input validation and output encoding
- File paths, shell calls, template rendering, and serialization
- Network calls, redirects, webhooks, SSRF exposure, and trust boundaries
- Secret handling, token lifecycle, and logging of sensitive values
- Rate limiting, abuse resistance, and denial-of-service amplification

## Review Questions

- Who is allowed to trigger this path, and how is that enforced?
- Can an attacker supply data that changes query shape, file path, command, or template behavior?
- Are secrets ever exposed through logs, errors, client payloads, or metrics labels?
- Does the code trust upstream identity or input more than it should?
- Can retries, race conditions, or idempotency gaps be abused to bypass controls?

## Red Flags

- Missing authorization checks on write or read paths
- Client-controlled identifiers used without server-side ownership validation
- Direct string interpolation into SQL, shell, HTML, or config
- Secrets stored in code, config, or logs
- Open redirects, path traversal, insecure deserialization, or unsafe temp-file handling
- Security decisions made only in the frontend or only by convention

## Evidence

A security finding should describe:

- The actor or input that can exploit the issue
- The missing or weak control
- The data, action, or system exposure that follows

## Remediation Direction

- Enforce authorization on the server at the resource boundary
- Validate and constrain untrusted input before use
- Use safe APIs for queries, files, templates, and subprocesses
- Redact secrets and sensitive fields from logs and errors
- Add abuse controls where the path can be amplified
