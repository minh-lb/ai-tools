# Backward Compatibility

## Focus

Review whether the change can coexist safely with older clients, older servers, existing data, stored messages, and staged rollouts.

## Inspect

- Public API request and response evolution
- Database schema transitions during mixed-version deployment
- Event, queue, webhook, and cache payload formats
- Config key changes, defaults, and removed behavior
- Serialized objects, persisted enums, and stored state
- Consumer assumptions in downstream services, SDKs, jobs, and scripts

## Review Questions

- Can old and new versions run at the same time during rollout?
- Are removed fields, renamed enums, or changed defaults still understood by existing consumers?
- Does stored historical data still parse and behave correctly?
- Will retries or delayed jobs created before deploy still succeed after deploy?
- Is contract expansion safe, and is contract removal phased?

## Red Flags

- Breaking response or event shape change without versioning or compatibility layer (if this is a live API contract issue rather than a multi-version coexistence issue, see [API](api.md) — raise one combined finding, not two)
- Schema migration that requires all app instances to update simultaneously (if the issue is the deployment sequencing mechanism — missing feature flag, no staged rollout strategy — see [Infrastructure](infrastructure.md) — raise one combined finding, not two)
- Enum or status rename that invalidates stored data or consumer logic
- Cache format change without namespacing or invalidation plan
- Background jobs serialized with old code shape but deserialized by new workers
- Default behavior change that silently alters existing clients

## Evidence

A backward-compatibility finding should describe:

- The mixed-version, delayed-consumer, or historical-data scenario
- The field, schema, or behavior that no longer matches prior expectations
- The concrete breakage risk during rollout or after deploy

## Remediation Direction

- Use additive changes first, then remove old behavior in a later phase
- Preserve compatibility across one full deployment window at minimum
- Namespace caches and version payloads where format changes are unavoidable
- Add compatibility tests for old data, old clients, and delayed async work
