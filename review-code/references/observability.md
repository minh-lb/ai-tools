# Observability

## Focus

Review whether the change leaves enough signals to detect, diagnose, and audit failures in production.

## Inspect

- Structured logs, log levels, and sensitive-field redaction
- Metrics for throughput, errors, latency, saturation, and business outcomes
- Tracing spans, correlation IDs, and async context propagation
- Audit events for privileged or destructive actions
- Health checks, alerts, and SLO-relevant instrumentation
- Failure-path visibility for retries, dead letters, and partial rollbacks

## Review Questions

- If this path fails in production, how will the team know quickly?
- Can the team distinguish user error, dependency failure, and code defect from the available signals?
- Are key identifiers present to correlate logs, traces, and background work?
- Does the code emit enough data to debug silent corruption or stuck retries?
- Are alerts or dashboards needed because the path is operationally important?

## Red Flags

- New critical path with no logs, metrics, or trace coverage
- Error logs without request, tenant, job, or entity identifiers
- Sensitive data dumped into logs for convenience (if the data is a secret, token, or credential, also raise a [Security](security.md) finding at the appropriate severity — that dimension owns the access-control angle; raise one observability finding for the logging gap itself)
- Async or queue processing that loses correlation context
- Privileged write path with no audit trail
- Retries or dead-letter paths with no visibility into volume or cause

## Evidence

An observability finding should describe:

- The production scenario that would be hard to detect or debug
- The missing signal or correlation context
- The operational consequence: delayed detection, longer recovery, or untraceable actions

## Remediation Direction

- Add structured logs with safe identifiers
- Emit metrics around success, failure, latency, retries, and backlogs
- Propagate tracing or correlation context across async boundaries
- Add audit events for security-sensitive actions
