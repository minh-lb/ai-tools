# Technical Document Review

Review designs, specifications, ADRs, API documentation, runbooks and READMEs against their stated purpose and audience. Identify whether the document describes current behavior or proposes future behavior; record its version and supplied sources. Read only related code/contracts needed to verify material claims.

## Focus

- Requirements and decisions: consistent terminology, measurable acceptance criteria, scope and constraints; decisions trace to requirements. Do not demand speculative features or a particular document layout.
- Contracts and examples: inputs/outputs, roles/tenants, errors, units, defaults, limits and version compatibility agree across prose, tables, examples and linked authoritative sources.
- Failure and concurrency: guarantees account for retries, idempotency, timeouts after side effects, partial writes and recovery. A guarantee contradicted by the documented flow can be a finding without implementation.
- Operations: prerequisites and commands match the stated environment; ordering, migration, rollback and monitoring support the documented procedure. Do not execute commands copied from a document without checking effects and authorization.
- Verifiability: links and referenced artifacts exist when accessible; examples satisfy the stated contract; proposed behavior has a feasible acceptance/verification method. Inaccessible references are gaps, not proof of errors.

Use the shared 14 dimensions for documented surfaces: API for an API contract, CONC for retry guarantees, INFRA for deployment steps, and so on. N/A requires no relevant surface; unverified means relevant evidence is missing. A document-only review cannot establish that code implements the design or tests pass.

## Evidence

Cite exact file lines and section names; for supplied documents without lines, cite a stable heading/page/block and a short supporting excerpt. For contradictions, cite both passages. Describe the concrete implementer/operator misunderstanding or proposed failure path and impact. Example: “unlimited retries” plus “charge on every delivery” contradicts an “at most one charge” guarantee unless the documented flow prevents duplicates.

Report missing detail as a finding only when an established requirement or stated guarantee needs it and the omission has a concrete consequence. Otherwise list it as a question or verification gap. Do not turn prose preferences into defects. Recommend a contract/flow correction for a proposal; do not claim a production incident or runtime observation.
