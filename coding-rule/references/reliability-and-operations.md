# Reliability, Configuration, and Operations Rules

Apply when changes affect infrastructure definitions, container/build configuration, operational scripts, runtime behavior, dependencies, background processing, deployment, or production support. For secret, identity, data-boundary, or abuse-control decisions, also read [Secure Coding Rules](security.md).

## Resilience and performance

- Put explicit bounds on waits and resource use at external or potentially unbounded boundaries: timeouts/deadlines, request and batch sizes, queue growth, concurrency, and result counts as appropriate.
- Retry only transient failures, with a bounded policy and backoff. Ensure replay is safe or protected by idempotency/deduplication; avoid synchronized retry storms and retrying permanent failures.
- Define behavior when dependencies are slow, unavailable, or partially successful. Use fallback/degraded behavior only when it preserves correctness and is understandable to operators and users.
- Measure before optimizing. Establish a representative baseline, identify the bottleneck, make a focused change, and compare performance while keeping correctness checks green. Consider latency, throughput, memory, database load, and user-visible impact as relevant.

## Observability and support

- Emit actionable logs, metrics, traces, audit events, or job status at the level the system needs to diagnose and operate the changed behavior. Include stable correlation context where supported.
- Redact credentials, tokens, personal data, and sensitive payloads. Logs are another output boundary; do not assume that internal logs are automatically safe.
- Make important background work observable: success/failure, retries, duration, volume, and stuck or repeatedly failing work. Avoid success-only signals that hide partial processing.
- Provide useful health/readiness checks and alerts only when appropriate to the service's operational model. Do not add noisy or redundant telemetry without an operator need.

## Configuration and delivery

- Validate configuration at startup or before use and fail with actionable, non-sensitive diagnostics. Keep environment-specific values out of source and use the repository's approved configuration/secret management.
- Keep permissions least-privileged. Review new packages, services, network access, and runtime capabilities for necessity, maintenance health, and supply-chain risk.
- Preserve compatibility during rolling deploys across old/new application versions, persisted data, API consumers, queued messages, and configuration. Version or stage changes when one-step rollout is unsafe.
- For operationally risky changes, define rollout monitoring, rollback or forward-recovery steps, and a stop condition. Do not run deployment, data mutation, external delivery, or production-facing commands without the required authorization.
- Update runbooks and deployment/configuration docs when operators must do something differently.

## Infrastructure as code, containers, and operational scripts

Apply these rules to Terraform/OpenTofu, AWS CDK and other code-driven IaC, Dockerfiles and Compose/build definitions, deployment configuration, and Bash or POSIX shell scripts. These files can grant privileges, expose services, incur cost, or destroy data; treat them as production code. Follow the target tool, provider, runtime, and repository's current conventions rather than copying commands or settings across environments.

### Infrastructure changes and state

- Make the target environment explicit: account/project, region, workspace/state, cluster, and resource scope as applicable. Verify the selected identity and target before planning or mutating; avoid hidden defaults that could redirect a change.
- Prefer repeatable, declarative changes with clear ownership and dependencies. Avoid unmanaged side effects or out-of-band edits that cause configuration drift; define how intentional manual changes are reconciled.
- Review the generated plan/diff/synthesized template before applying infrastructure changes. Check creations, updates, replacements, deletions, access policies, public exposure, data retention, dependencies, and cost. Recompute and inspect the final plan when remote state may have changed since review.
- Treat plan, diff, synthesis, and build output as evidence—not as authorization, proof of runtime correctness, or a guarantee that the eventual deployment is safe. Inspect the commands and scripts they invoke; even preview/build commands may read remote state, use credentials, or have external side effects.
- Do not execute commands that mutate shared or production infrastructure—such as apply, deploy, or destroy—without the authorization required by the user and project policy. Prefer a disposable, isolated environment for tests that create resources; define cleanup and cost limits first.
- Protect IaC state and plan artifacts as sensitive: they may contain secrets or private infrastructure details. Use an approved backend with access controls, encryption, locking where supported, backup/recovery, and retention; do not commit state or sensitive plans. Do not edit state files directly; use the tool's supported state-management workflow.
- Manage provider, module, action, base-image, and tool versions with tool-supported lockfiles where available and explicit constraints or pins for versions the lockfiles do not cover. For example, Terraform's dependency lockfile records provider selections, not module versions. Follow the project's update policy to preserve reproducibility without freezing vulnerable or unsupported versions; review and test updates deliberately.

### Containers and image builds

- Use trusted, maintained base images and an explicit update strategy. Pin versions or immutable digests when the required reproducibility and supply-chain policy call for it, and keep a process for receiving security updates.
- Keep the build context narrow. Use the appropriate ignore file to exclude credentials, local configuration, version-control data, and irrelevant build artifacts. Never bake credentials into image layers, build arguments, environment declarations, labels, or logs; use BuildKit or the builder's equivalent supported secret/SSH mechanism for build-time access and the runtime's approved secret mechanism for runtime access.
- Include only what the runtime needs. Use multi-stage builds or smaller runtime images when they reduce attack surface or operational cost; do not impose a particular base distribution, one-process rule, or image-size target without a project requirement.
- Run with only the privileges, capabilities, host mounts, devices, ports, and writable paths the workload needs. Treat privileged mode, host namespaces, host filesystem mounts, and container-runtime sockets as high-risk exceptions requiring a concrete need and explicit review.
- Define health, resource, shutdown, persistence, and network behavior at the layer that owns it (image, Compose/deployment manifest, or orchestrator). Avoid contradictory defaults across layers.

### Shell and operational scripts

- Declare the intended interpreter and supported environment in the shebang for executable scripts and in CI/operator invocations where relevant. Keep POSIX `sh` syntax separate from Bash-specific features; test with the actual interpreter used by the script, CI, and operators.
- Preserve argument boundaries and handle paths safely: quote expansions, use argument arrays in Bash or `"$@"` when forwarding arguments, validate options and paths, and avoid `eval` or constructing executable command strings from external input.
- Check the exit status of critical commands and pipelines, define failure/cleanup behavior, and return meaningful status to callers. Strict-mode options can help but have shell-specific semantics; `set -e` (or a bundle such as `set -euo pipefail`) is not a substitute for deliberate error handling.
- Create temporary files safely and clean up resources on normal exit and signals where practical. Make reruns safe; bound retries and waits; never let an unset, empty, or unexpected variable broaden a destructive target.
- Require an explicit, narrowly validated target for destructive operations. Provide a dry-run/plan mode when it helps prevent mistakes, but do not treat an interactive prompt or dry run as a replacement for authorization or target verification.
- Use the repository's shell linter/test conventions (for example, ShellCheck when available) and test meaningful success, failure, quoting, and cleanup paths without contacting real services or mutating shared environments unless authorized.

### Infrastructure and script verification

- Run the repository's applicable formatter, linter, static validation, unit/construct tests, and tool-native checks. Examples include Terraform formatting/validation and a reviewed plan, CDK synthesis/diff and assertions, Docker build checks/image build, and shell linting. Use only commands supported by the pinned tool version and project workflow.
- Treat successful parsing, synthesis, planning, or image building as limited evidence—not proof that permissions, networking, runtime behavior, costs, persistence, or rollback are correct. Review generated artifacts and test consequential behavior in an authorized, isolated environment where feasible.
- Inspect CI/deployment scripts and command targets before execution. Record what was actually validated; never imply that a live deployment, infrastructure apply, security posture, or rollback was verified when only static checks or a plan ran.
