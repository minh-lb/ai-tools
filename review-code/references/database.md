# Database

## Focus

Review whether schema changes, queries, writes, and transactions are safe for data integrity, availability, and long-term operability.

## Inspect

- Schema migrations, column changes, defaults, nullability, and backfills
- Query correctness, filtering, sorting, pagination, and locking behavior
- Index coverage and query-plan implications
- Transaction boundaries, isolation assumptions, and write ordering
- Referential integrity, uniqueness, and multi-tenant partitioning
- Data retention, deletion, and historical compatibility

## Review Questions

- Can the migration run safely on production-sized data without long blocking locks?
- Is the rollout compatible with old and new application versions during deployment?
- Are writes atomic where invariants require them to be atomic?
- Does the query rely on implicit ordering or non-unique keys?
- Are nullability, defaults, and uniqueness rules aligned with business expectations?
- Does a batch write or update operation hold row or table locks long enough to block concurrent reads or writes from other users?
- Is there a statement timeout or query timeout configured for long-running queries? What happens to the caller if the query exceeds it?
- For large table operations (backfills, reindexing, mass updates): is the operation chunked and throttled, or does it lock the whole table for the duration?

## Red Flags

- Destructive migration without phased rollout or backfill plan
- Adding a non-null column without safe default or staged population
- Query predicates that cannot use supporting indexes (this overlaps with [Performance](performance.md) "full-table scans" — raise one combined finding that covers both the integrity/access risk and the latency impact; do not raise separately in both dimensions)
- Read-modify-write sequence without transaction or concurrency control (if the race involves concurrent actors or queue workers rather than pure DB isolation, see [Concurrency](concurrency.md) — raise one combined finding, not two)
- Missing tenant scoping in queries or uniqueness constraints
- Application-level data integrity assumption without database enforcement where it matters
- Batch UPDATE or DELETE on large tables without chunking — one long-running transaction that holds locks and blocks other queries
- No statement timeout on queries that scan large tables or perform expensive joins; an outlier query can exhaust the connection pool
- `SELECT FOR UPDATE` or advisory lock held across a network call or user-facing request — lock duration grows with external latency and blocks concurrent access

## Evidence

A database finding should describe:

- The schema, query, or transaction pattern at risk
- The production condition that exposes the problem
- The likely outcome: lock contention, corruption, duplicate rows, lost updates, or failed rollout

## Remediation Direction

- Use expand-and-contract rollout patterns for schema evolution
- Add the right index, constraint, or transactional guard
- Make ordering and uniqueness explicit
- Separate backfills from request-time logic and throttle them appropriately
