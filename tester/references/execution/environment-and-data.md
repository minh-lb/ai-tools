# Environment and data

## Preflight

Inspect existing scripts, runner configuration, supported versions, service health checks, migrations/seed instructions, and account fixtures. Establish:

- Target URL/environment and tested code revision or deployment identity when available.
- Required frontend, backend, database, queues, identity provider, and external dependencies.
- Available roles/accounts and how credentials are supplied securely.
- Which dependencies are real, sandboxed, simulated, or unavailable.
- The commands and tools that can actually run in this session.

Use normal project setup and readiness signals. A listening port alone does not establish application readiness. Do not reset a shared database, apply destructive migrations, or replace secrets to get a run working. Record missing requirements as `blocked` and continue unaffected journeys.

For missing runners, browser binaries, or services, inspect documented setup and installed compatible alternatives first. Use routine setup within existing authorization and session permissions. If a download or setup action needs unavailable access, report the exact prerequisite and proposed command; do not replace browser execution with static checks and call the smoke passed.

## Side effects

Prefer local or dedicated test environments and sandbox providers. Do not infer permission to charge money, send real messages, modify other users' records, or delete existing data from a generic request to test. On a live environment, perform authorized safe checks and stop only the steps requiring missing authorization. Prepare concrete details of the pending action if approval is needed.

Do not bypass authentication, authorization, CAPTCHA, rate limits, or other controls to make the run pass. Use supported test accounts and test mechanisms. If a control prevents execution, describe the limitation.

## Isolation and cleanup

- Use synthetic data with a unique run identifier; keep per-test accounts/state separate where parallelism can collide.
- Make setup repeatable. Capture created resource IDs so cleanup targets only this run's owned data.
- Keep tests independent of order and prior runs. Restore time/network overrides and close sessions created by the run.
- Use project-approved teardown in a finally/fixture mechanism when automated. If cleanup fails, preserve the failure and list remaining test resource IDs without secrets.
- Reserve bounded teardown time separately from investigation. Reaching the investigation limit stops new probes and retries; it does not skip authorized cleanup or restoration of fault/time/network overrides. Keep the original result and cleanup result separate, and report any residue if teardown cannot finish safely.
- Do not clean pre-existing user data or use broad delete patterns. Verify ownership before deletion and stay within authorized cleanup scope.

Treat authentication storage, traces, screenshots, network logs, and database output as potentially sensitive. Keep artifacts in the project's permitted location; redact secrets and personal data before sharing. Do not commit session cookies or access tokens.
