# Performance

## Focus

Review whether the change introduces avoidable latency, throughput limits, resource waste, or scale-sensitive behavior in realistic production workloads — including whether it remains stable and correct when data volume grows significantly beyond the current baseline.

## Inspect

- Hot loops, nested scans, and algorithmic complexity
- Database round trips, N+1 queries, missing batching, and missing indexes
- Serialization, compression, payload size, and object allocation
- Cache usage, invalidation strategy, and stampede risk
- Network fan-out, retry storms, and synchronous dependency chains
- Background jobs, cron tasks, and backfill behavior at scale
- Connection pool exhaustion: DB, HTTP client, or thread pool limits under concurrent load
- Memory growth patterns: unbounded accumulation in collections, event listeners, or long-lived objects
- Timeout budget: whether timeouts are set per call and whether chained calls leave enough remaining budget
- Streaming vs buffering: whether large responses are materialized fully into memory when streaming is possible
- **Large-data stability**: whether the code degrades gracefully or breaks entirely when data volume grows — covering memory headroom, algorithmic complexity cliff, partial-result handling, and back-pressure

## Review Questions

- What happens when input size, tenant count, or traffic volume grows?
- Does this path perform repeated work that could be batched, memoized, or cached safely?
- Are heavy operations placed on request paths instead of async paths?
- Can retries multiply load on already-failing dependencies?
- Does the change create unbounded memory growth or large payload expansion?
- Can concurrent requests exhaust a connection pool or shared resource?
- Do chained I/O calls each carry their own timeout, or can the total exceed the caller's deadline?
- Is a large dataset collected into memory where a cursor, generator, or stream would suffice?
- What is the realistic upper bound of the data volume this path will process? Has the code been evaluated at 10×, 100× that baseline?
- Does the algorithm have a complexity cliff — a point where O(n²) or worse behavior first appears at large n?
- If processing a large batch fails midway, is partial progress recoverable or does the whole operation need to restart?
- Is there any back-pressure mechanism to prevent a fast producer from overwhelming a slow consumer or downstream?
- Does sorting, grouping, or joining operate on a bounded window, or can it grow with data size?

## Red Flags

- Query or API call inside a loop over user-controlled or large collections
- Full-table scans introduced by new filters without index support (this overlaps with [Database](database.md) "query predicates without index" — raise one combined finding that covers both the latency risk and the missing index; do not raise separately in both dimensions)
- Large object materialization when streaming or pagination is required
- Synchronous fan-out to multiple dependencies in latency-sensitive paths
- Cache keys that explode cardinality or caches that never invalidate
- Backfills or migrations that rewrite large datasets without throttling
- No timeout on external calls, or timeout longer than the upstream caller's SLA
- Connection or file descriptor created inside a loop without pooling or explicit release
- Event listener or callback registered repeatedly without cleanup, leading to accumulation over time
- Retry with no backoff or jitter on a shared downstream, risking thundering-herd
- **Large-data red flags**:
  - Algorithm whose complexity is O(n²) or worse and n is unbounded or user-controlled
  - In-memory sort, group, join, or dedup over a collection that grows with data volume
  - No pagination or chunking on a list or export endpoint — response size grows proportionally with data
  - Batch job with no checkpointing: failure forces a full restart from the beginning
  - No back-pressure between producer and consumer: queue or buffer can grow without bound
  - `OFFSET`-based pagination that gets progressively slower as page number increases
  - Regex or string scan applied to large blobs without a length cap or early termination
  - Recursive algorithm (tree walk, graph traversal) with no depth limit on user-supplied or database-backed data

## Large-Data Stability Checklist

When a path processes collections, exports, batch jobs, or aggregations, verify each item. If a check cannot be confirmed by static analysis alone, mark it **[Cannot verify statically]** and state what runtime test or EXPLAIN output would confirm it.

| Check | Pass condition |
|-------|---------------|
| Complexity bound | O(n log n) or better for unbounded n; O(n²) only if n is provably small and capped |
| Memory bound | Dataset not loaded fully into memory; cursor, stream, or chunked iteration used |
| Memory estimate | Approximate peak memory at 100k, 1M, 10M rows is known and within service limits |
| Pagination strategy | Keyset/cursor-based, not OFFSET-based |
| Lock duration | Batch writes are chunked; no single transaction holds locks over the full dataset |
| Query timeout | Statement timeout is set for long-running queries; caller handles timeout gracefully |
| Partial failure recovery | Checkpointing or idempotent resume; no full restart required on failure |
| Back-pressure | Producer rate bounded by consumer throughput; no unbounded queue growth |
| Recursion safety | Depth limit enforced; iterative alternative used where depth is data-driven |
| Payload cap | Response or export size bounded; large results chunked or streamed |
| Regex / scan safety | Input length capped before applying expensive pattern or full-text scan |

If the code does not pass a check and the path is reachable with large data, raise a finding scoped to the specific failure mode.

### Memory estimation heuristic

Use this to approximate peak memory when the code loads a collection:

- A typical database row with mixed fields: ~1–5 KB in application memory after deserialization
- 100k rows: ~100 MB–500 MB
- 1M rows: ~1 GB–5 GB
- If the service memory limit is less than the estimate, loading the full collection risks OOM

If the code loads an unbounded query result into memory and the row count is not explicitly capped, flag it as a finding and include the estimate in the Why field.

## Evidence

A performance finding should connect:

- The expensive operation
- The scale trigger (input size, concurrency level, or traffic volume)
- The expected latency, throughput limit, load amplification, or resource consequence

## Remediation Direction

- Batch work, paginate results, or move heavy work off the request path
- Add or adjust indexes, cache boundaries, and invalidation rules
- Bound payload sizes, memory use, and retry behavior
- Set explicit timeouts per I/O call; align them with the caller's deadline budget
- Use connection pools; never open connections inside loops
- Stream or paginate large datasets instead of loading them fully into memory
- Add performance tests or instrumentation if risk is hard to quantify statically
- Replace OFFSET pagination with keyset (cursor) pagination for large tables
- Add checkpointing to batch jobs so partial progress survives failure
- Enforce depth limits on recursive traversal; rewrite as iterative with an explicit stack if depth is data-driven
- Cap input length before applying regex or full-text scan
- Add back-pressure signals (rate limiting, bounded queues, flow control) between producer and consumer
