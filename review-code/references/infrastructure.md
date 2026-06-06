# Infrastructure

## Focus

Review whether the change is safe to build, configure, deploy, roll back, and operate across real environments.

## Inspect

- Environment variables, config defaults, and secret sourcing
- Deployment order, rollout strategy, and rollback safety
- Infrastructure as code, permissions, and runtime dependencies
- Resource limits, timeouts, retries, and container or process assumptions
- Service discovery, networking, TLS, and certificate handling
- Feature flags, kill switches, and environment parity

## Review Questions

- Can this change be deployed safely in stages?
- What breaks if one environment variable or secret is missing or stale?
- Does the code assume filesystem, clock, hostname, or network behavior that may differ across environments?
- Is rollback safe after schema, config, or message-format changes?
- Are resource limits and timeout settings compatible with the new behavior?

## Red Flags

- Required config added without validation or fallback behavior
- New dependency reachable only in one environment or with manual setup
- Rollout requiring code and infra to change simultaneously with no safe sequencing (if the root issue is a schema or API contract that forces simultaneous update, see [Backward Compatibility](backward-compatibility.md) — raise one combined finding scoped to the deployment constraint)
- Overly broad permissions granted to make the feature work
- Runtime assumptions tied to local development only
- Feature launch without a kill switch for risky paths

## Evidence

An infrastructure finding should describe:

- The environment or rollout condition that exposes the issue
- The missing deployment guard, permission boundary, or config validation
- The likely failure mode: failed rollout, broken runtime, or unsafe rollback

## Remediation Direction

- Validate required config at startup or deploy time
- Sequence infra and app changes using backward-compatible rollouts
- Scope permissions to the minimum required capability
- Add feature flags, health gates, or kill switches for risky launches
