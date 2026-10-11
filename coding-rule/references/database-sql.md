# Database, SQL, and Data-Change Rules

Apply to relational and non-relational data stores as appropriate. Confirm behavior in the actual database engine/version and project persistence layer; SQL dialects, transactional DDL, locking, isolation, and online migration capabilities differ. For the complete security boundary guidance around queries, authorization, data exposure, and secrets, also read [Secure Coding Rules](security.md).

## Schema and data integrity

- Model persisted data around the domain's real invariants and access patterns. Make required/optional, uniqueness, ownership, referential, and lifecycle rules explicit rather than relying on undocumented assumptions.
- Use database constraints for invariants they can reliably protect across all writers when compatible with the system's architecture and migration model. If an invariant is intentionally enforced elsewhere, identify the authoritative control and how concurrent writers remain safe.
- Preserve meaningful distinctions between absent, null, zero, empty, and default values. Choose precision, units, encoding, and timestamp/time-zone semantics to match the data contract.
- Avoid speculative denormalization, opaque catch-all fields, or splitting tables solely to meet arbitrary column/join counts. Make schema choices from measured access patterns, consistency requirements, and operational cost.

## Query safety and performance

- Bind data values using the database driver's parameterized query mechanism or an equivalent safe abstraction. Do not build executable SQL by concatenating untrusted values or by escaping them manually.
- Parameters generally cannot stand in for identifiers or SQL syntax. Select table/column names, sort directions, and other dynamic structure from a fixed allow-list or redesign the query.
- Select only needed columns and rows. Bound collection reads and page long result sets. Avoid N+1 access patterns when they create material cost.
- Add indexes to support demonstrated filter, join, ordering, and uniqueness needs; account for the additional write/storage cost and index selectivity. Do not add indexes or caches speculatively.
- Diagnose slow queries with the target engine's execution-plan and measurement tools against representative data. Do not assume a particular join shape, number of queries, or index is universally faster; compare end-to-end cost and data consistency.

## Transactions and concurrency

- Group related changes in a transaction when partial persistence would violate the contract. Keep transactions bounded and avoid unnecessary remote I/O while holding locks.
- Define how concurrent updates, uniqueness races, retries, and isolation anomalies are handled. Use locking, optimistic version checks, atomic updates, unique constraints, or other mechanisms appropriate to the engine and invariant.
- Make rollback and partial-failure behavior explicit. A success/error response alone does not prove persisted state is correct; verify important side effects and cleanup.
- Avoid relying on a read-before-write check when another transaction can change the same state before the write.

## Schema and data migrations

- Treat migrations and backfills as production code. Check existing data, schema size, write volume, lock behavior, version compatibility, rollback limits, and observability before choosing the migration strategy.
- Prefer staged, backward-compatible changes when old and new application versions may overlap: introduce compatible structure, migrate/backfill safely, switch readers/writers, and remove obsolete structure only after dependents are gone.
- Chunk or resume large backfills where needed. Make reruns safe, monitor progress, and define how partial completion is detected and recovered.
- Do not assume a migration is reversible just because a reverse script exists; data loss and external side effects may make rollback impossible. State the recovery path.
- Never run destructive schema/data operations or production migrations without explicit authorization, a verified target, and the project's required backup/rollout controls.

## Database verification prompts

Check parameterization, authorization-scoped queries, constraints, null/precision/time semantics, query plans for performance claims, transaction boundaries, concurrent writes, existing-data compatibility, migration/backfill behavior, and whether rollback/recovery is honest and feasible.
