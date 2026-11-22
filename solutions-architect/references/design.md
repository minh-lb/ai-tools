# Architecture design reference

## Quality scenarios and trade-offs

- Turn goals such as “fast” or “available” into scenarios tied to business outcomes. State who or what triggers the scenario, the affected flow and conditions, the expected response, and the acceptance measure. A latency target needs a path, percentile, workload and measurement window where those affect the decision. Include peak, failure, or change conditions in proportion to their impact.
- Reject options that violate confirmed constraints before comparing benefits. Use the current design or a smaller change as the baseline where viable. Compare against the same scenarios and show what improves, what gets worse, and which requirement takes priority. Use ranges or conditional outcomes when inputs are uncertain.
- Vary the assumptions most likely to change the recommendation, such as concurrent load, allowable staleness, external service limits, or operator capacity. State the threshold or condition at which another option becomes better and identify the smallest test or source that could settle the choice. Under partition, describe what callers see and whether each side can safely serve.

These techniques adapt [arc42 quality scenarios](https://docs.arc42.org/section-10/) and [SEI's Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/) to a focused design decision.

## System boundaries

- For each important rule, identify who may act, what changes, which owner enforces the rule, and what rejection leaves unchanged. Name the authoritative owner for each mutable record. Describe what other modules can read or change through published interfaces.
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
- Recording alternatives, trade-offs and decision history. [Microsoft's ADR guidance](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)
- Domain language, bounded contexts and aggregate rules. [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- Product quality attributes. [ISO/IEC 25010](https://www.iso.org/standard/78176.html)
- Verifiable application security requirements. [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- AWS workload architecture trade-offs. [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
