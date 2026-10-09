# Infrastructure

## Focus

Review whether the change is safe to build, configure, deploy, roll back, and operate across real environments.

## Inspect

- Environment variables, config defaults, and secret sourcing
- Deployment order, rollout strategy, and rollback safety
- Graceful shutdown/draining of in-flight requests and jobs during restart or rolling deploy
- Infrastructure as code, permissions, and runtime dependencies
- Resource limits, timeouts, retries, and container or process assumptions
- Service discovery, networking, TLS, and certificate handling
- Feature flags, kill switches, and environment parity

## Rollout Guard Criteria

A change needs an appropriate rollout guard when any of these apply:
- Active users are exposed before the behavior is fully validated, so a canary, dark launch, or staged rollout is warranted.
- Rollback is difficult or slow after deployment (for example, irreversible schema writes, message-format changes, or external contract changes).
- The change has a large surface or high impact and a kill switch would materially reduce blast radius.
- The team has committed to staged rollout for this path.

A feature flag is one possible guard, not the only acceptable one. Depending on the system, a canary, config kill switch, dual-read/write phase, traffic shift, or another proven control may provide equivalent protection. A guard may be unnecessary for internal behavior-preserving refactors, instant reversible deploys with no state migration, or low-impact paths where the added control does not reduce meaningful risk.

If the rollout risk is real and no suitable guard exists, describe the concrete failure scenario and assign severity using the shared Severity Model. Do not assign High solely because a feature flag is absent.

## Review Questions

- Can this change be deployed safely in stages?
- What breaks if one environment variable or secret is missing or stale?
- Does the code assume filesystem, clock, hostname, or network behavior that may differ across environments?
- Is rollback safe after schema, config, or message-format changes?
- What happens to in-flight requests and jobs when a process restarts or is terminated during deploy?
- Are resource limits and timeout settings compatible with the new behavior?
- Does this change need a rollout guard or kill switch, and is an equivalent control present?

## Red Flags

- Required config added without validation or fallback behavior
- New dependency reachable only in one environment or with manual setup
- Rollout requiring code and infra to change simultaneously with no safe sequencing (if the root issue is a schema or API contract that forces simultaneous update, see [Backward Compatibility](backward-compatibility.md) — raise one combined finding scoped to the deployment constraint)
- Overly broad permissions granted to make the feature work
- Runtime assumptions tied to local development only
- Shutdown hook is absent or its grace period is shorter than realistic in-flight work, so deployments terminate active requests or jobs
- Risky rollout without a guard that meaningfully limits blast radius or supports recovery

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
