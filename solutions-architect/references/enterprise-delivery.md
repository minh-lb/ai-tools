# Enterprise Delivery

## Fit to the current organization

- Inspect the affected system, approved architecture decisions, platform catalog, service contracts, and applicable policies. Cite the revisions that govern the recommendation. When an approved rule and observed behavior differ, identify the discrepancy and the owner who can resolve it. Keep a proposed change or informal waiver provisional.
- Reuse approved platform capabilities that meet workload requirements. For each material organizational control, map the source and scope to the enforcing component, owner, and verification evidence. Include replicas, backups, telemetry, and support access when they cross a boundary governed by the rule. Assess technical coverage against supplied controls and route unresolved interpretations to the organization’s designated authority.
- Use the established exception process where applicable. Identify the specific control, affected scope, accountable approver, compensating control, expiry or review date, and exit plan. Treat proposed exceptions as pending. Continue with the compliant option when feasible.

## Dependencies and transition

- For each critical shared dependency, identify provider and consumer owners, service guarantees and limits, change notice, failure behavior, and escalation. Verify that the dependency commitment supports the end-to-end workload target. Record missing commitments and distinguish them from measured behavior.
- Map the current, transitional, and target states when teams deploy independently. Agree on compatible producers and consumers, dependency order, cutover windows, and who can stop the rollout. Where a cutover changes authoritative state, show how ownership transfers, how data is reconciled, and what recovery remains possible after new writes.

## Handoff and production gates

- Reuse the organization’s readiness review and evidence sources. For relevant implementation and production gates, record the owner, decision authority, pass condition, evidence, and unresolved action. A draft runbook, an unexecuted test, and a planned approval stay pending.
- Identify who owns deployment, on-call response, dependency escalation, and recovery. Hand over the runbook, alerts or service-level signals, rollout and abort conditions, recovery actions, and known risks. Recheck affected controls when the system, dependency commitment, or on-call ownership changes.

See [Azure workload shared responsibility](https://learn.microsoft.com/en-us/azure/well-architected/workloads#shared-responsibility-model), [Google Cloud enterprise foundations](https://docs.cloud.google.com/architecture/blueprints/security-foundations), [AWS operational readiness](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops05-bp04.html), and [Azure safe deployment practices](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments).
