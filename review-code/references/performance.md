# Performance

## Focus

Review whether the change introduces avoidable latency, throughput limits, resource waste, or scale-sensitive behavior in realistic production workloads.

## Inspect

- Hot loops, nested scans, and algorithmic complexity
- Database round trips, N+1 queries, missing batching, and missing indexes
- Serialization, compression, payload size, and object allocation
- Cache usage, invalidation strategy, and stampede risk
- Network fan-out, retry storms, and synchronous dependency chains
- Background jobs, cron tasks, and backfill behavior at scale

## Review Questions

- What happens when input size, tenant count, or traffic volume grows?
- Does this path perform repeated work that could be batched, memoized, or cached safely?
- Are heavy operations placed on request paths instead of async paths?
- Can retries multiply load on already-failing dependencies?
- Does the change create unbounded memory growth or large payload expansion?

## Red Flags

- Query or API call inside a loop over user-controlled or large collections
- Full-table scans introduced by new filters without index support (this overlaps with [Database](database.md) "query predicates without index" — raise one combined finding that covers both the latency risk and the missing index; do not raise separately in both dimensions)
- Large object materialization when streaming or pagination is required
- Synchronous fan-out to multiple dependencies in latency-sensitive paths
- Cache keys that explode cardinality or caches that never invalidate
- Backfills or migrations that rewrite large datasets without throttling

## Evidence

A performance finding should connect:

- The expensive operation
- The scale trigger
- The expected latency, load, or resource consequence

## Remediation Direction

- Batch work, paginate results, or move heavy work off the request path
- Add or adjust indexes, cache boundaries, and invalidation rules
- Bound payload sizes, memory use, and retry behavior
- Add performance tests or instrumentation if risk is hard to quantify statically
