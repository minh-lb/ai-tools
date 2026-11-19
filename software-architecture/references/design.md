# Architecture design reference

## Boundaries and trade-offs

- For each important rule, identify who may act, what changes, which owner enforces the rule and what rejection leaves unchanged. Name the authoritative owner for each mutable record. Describe what other modules can read or change through published interfaces.
- For a consequential decision, compare options using relevant criteria such as consistency, peak workload, delivery time, team capacity, operating cost and rollback. State the evidence or assumptions behind the choice and what would trigger reconsideration.
- Turn terms such as “fast,” “available,” and “global” into measurable scenarios. Ask for missing material targets or evaluate under labeled assumptions. Under a partition, describe what a caller sees given different state versions and whether the system can safely serve or must refuse an operation.
- Use a C4 context view for actors and external dependencies, a container view for runnable applications and data stores, and a component view when module responsibilities matter. Code-level views are useful for a specific implementation question. Show protocol, direction and trust boundary where consequential. Use a Mermaid sequence diagram when ordering, timeouts, retries or partial commits determine correctness.

## Data and interfaces

- Tie each invariant to an enforcement mechanism and a transaction boundary. Explain what stops racing writes, including the losing caller's result. For derived reads, caches and asynchronous projections, describe allowed staleness and behavior when they lag.
- For tenant-scoped systems, verify the selected tenant against trusted identity and active membership. Carry scope across queries, mutations, relationships, cache keys and asynchronous processing. Test cross-tenant references as well as cross-tenant reads and writes.
- Describe API and event contracts at their boundary, including authorization, stable identities, errors, compatibility and retry semantics. When committing state and publishing are separate operations, show a durable handoff or recovery mechanism. For duplicate or reordered delivery, define how the consumer preserves its invariants and which state or sequence governs ordering.
- For an external action with an ambiguous timeout, trace both provider acceptance and failure. Use durable operation identity, retry semantics aligned with the provider contract, and reconciliation of uncertain outcomes when required. For a local effect, scope deduplication to the same durable commit as the effect or explain equivalent recovery.
- For a rolling migration, map old and new readers and writers, including workers. Use backward-compatible expansion, resumable backfill, a reconciled cutover, and retirement based on observed compatibility and rollback criteria. State which data changes can survive an application rollback.

## Primary sources

Consult only the sources useful to the decision. Use standards to structure design and evidence at the requested depth.

- Architecture documentation sections and views. [arc42](https://arc42.org/overview)
- Diagram levels and notation. [C4 Model](https://c4model.com/)
- Decision context, status and consequences. [Architecture Decision Records](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- Domain language, bounded contexts and aggregate rules. [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- Product quality attributes. [ISO/IEC 25010](https://www.iso.org/standard/78176.html)
- Verifiable application security requirements. [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- AWS workload architecture trade-offs. [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
