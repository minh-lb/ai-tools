# Infrastructure Design

## Workload and topology

- Describe environments, expected steady and peak load, latency-sensitive paths, data placement, and dependency limits. Choose regions, zones, sites, or clusters based on measured requirements and available operations capacity.
- Draw the request and data paths through ingress, compute, storage, and external dependencies. Show network and identity trust boundaries, runtime and data ownership, and which components share a failure domain.
- When sizing drives the choice, model baseline, peak, and degraded operation. Show the first likely bottleneck or quota, remaining capacity after a relevant failure, and the measurement needed to confirm it. Compare cost with common workload assumptions, including recurring infrastructure, transfer, and operating effort where material. Verify provider limits, capabilities, and prices when they drive the choice. Reconcile estimates with load tests or usage data when available. [AWS Well-Architected design principles](https://docs.aws.amazon.com/wellarchitected/latest/framework/general-design-principles.html)

## Access, resilience, and recovery

- Specify workload and operator identity, privileged access, required ingress and egress, secret ownership and rotation, encryption, and auditability as relevant to the design.
- Define which failures the system must tolerate. Walk through the loss of a zone, site, or shared dependency when relevant. Account for remaining capacity, dependency limits, detection, failover, and safe return to service.
- Translate recovery time and recovery point objectives into concrete backup, replication, restore, and failover behavior. Define when the recovery clock starts and stops, and which acknowledged operations count toward data loss. Reconcile recovered state against records held outside the failure domain. Check that every operation before the allowed loss window survives and that any loss inside the window is measured. For a zero-loss design, reconcile all acknowledged operations. Define how failover and failback prevent conflicting writers.

## Delivery and operations

- Define the production change path, configuration and infrastructure ownership, promotion or cutover gates, rollback triggers, and an operator responsible for each critical action. Identify state changes that survive rollback and define a recovery path for them.
- Describe the signals that determine whether the workload is healthy, including relevant user-facing indicators and dependency signals. Identify how operators will detect a failed migration, saturation, replication lag, or degraded failover.
- Validate only the claims the decision depends on. Examples include a capacity test at peak load, a known-good restore, a rehearsal of failover or cutover, and a cost estimate with its usage assumptions. Distinguish a design walkthrough from evidence gathered in a representative environment.
