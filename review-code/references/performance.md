# Performance

## Focus

Review whether the in-scope code or change creates avoidable latency, throughput limits, resource waste, or scale-sensitive behavior in realistic production workloads. Use known data/traffic bounds and representative peak conditions; do not invent a scale target.

## Inspect

- Hot loops, nested scans, and algorithmic complexity
- Database round trips, N+1 queries, missing batching, and missing indexes
- Serialization, compression, payload size, and object allocation
- Cache usage, invalidation strategy, and stampede risk
- Network fan-out, retry storms, and synchronous dependency chains
- Failure isolation and graceful degradation: bounded concurrency, bulkheads, circuit breakers where appropriate, load shedding, queue limits, and fallbacks consistent with the contract
- Background jobs, cron tasks, and backfill behavior at scale
- Connection pool exhaustion: DB, HTTP client, or thread pool limits under concurrent load
- Memory growth patterns: unbounded accumulation in collections, event listeners, or long-lived objects
- Timeout budget: whether timeouts are set per call and whether chained calls leave enough remaining budget
- Streaming vs buffering: whether large responses are materialized fully into memory when streaming is possible
- **Large-data stability**: whether the code degrades gracefully or breaks entirely when data volume grows — covering memory headroom, algorithmic complexity cliff, partial-result handling, and back-pressure
- **Browser UI loading**: route-level JavaScript/CSS size, code splitting and lazy loading, critical rendering path, font/image delivery, cache behavior, and request waterfalls
- **Browser UI runtime**: expensive render/re-render work, large lists, long main-thread tasks, layout thrashing, event-handler work, and animation/compositing costs
- **Core Web Vitals where relevant**: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS); distinguish field data from lab diagnostics

## Review Questions

- What happens when input size, tenant count, or traffic volume grows, including for the largest expected customer/data set?
- Does the path remain within the CPU, memory, connection, and concurrency limits of the minimum supported deployment profile, when that profile is known?
- Does this path perform repeated work that could be batched, memoized, or cached safely?
- Are heavy operations placed on request paths instead of async paths?
- Can retries multiply load on already-failing dependencies?
- Can a slow or unavailable dependency exhaust shared pools or cascade failure, and are isolation or graceful-degradation controls appropriate for this path?
- Does the change create unbounded memory growth or large payload expansion?
- Can concurrent requests exhaust a connection pool or shared resource?
- Do chained I/O calls each carry their own timeout, or can the total exceed the caller's deadline?
- Is a large dataset collected into memory where a cursor, generator, or stream would suffice?
- What are the enforceable input and traffic bounds, and has behavior been checked against the largest realistic or expected peak workload?
- Does the algorithm have a complexity cliff — a point where O(n²) or worse behavior first appears at large n?
- If processing a large batch fails midway, is partial progress recoverable or does the whole operation need to restart?
- Is there any back-pressure mechanism to prevent a fast producer from overwhelming a slow consumer or downstream?
- Does sorting, grouping, or joining operate on a bounded window, or can it grow with data size?
- Does the change add large synchronous JavaScript, block hydration, trigger repeated expensive renders, or put long work on the main thread?
- Are large images/fonts and below-the-fold modules delivered efficiently without delaying the critical content or interaction path?
- Does the layout reserve space for late-loading content to avoid shifts? Are animations limited to properties that avoid repeated layout/paint work where appropriate?
- If Core Web Vitals are available, are results evaluated at the 75th percentile and segmented across mobile and desktop? Are lab-only measurements being mistaken for real-user INP?

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
- No failure isolation or bounded concurrency on a dependency path where slowdown can exhaust shared pools or cascade an outage
- **Large-data red flags**:
  - Algorithm whose complexity is O(n²) or worse and n is unbounded or user-controlled
  - In-memory sort, group, join, or dedup over a collection that grows with data volume
  - No pagination or chunking on a list or export endpoint — response size grows proportionally with data
  - Batch job with no checkpointing: failure forces a full restart from the beginning
  - No back-pressure between producer and consumer: queue or buffer can grow without bound
  - `OFFSET`-based pagination that gets progressively slower as page number increases
  - Regex or string scan applied to large blobs without a length cap or early termination
  - Recursive algorithm (tree walk, graph traversal) with no depth limit on user-supplied or database-backed data

### Browser UI Metrics and Red Flags

When the project uses Core Web Vitals as a target and no stricter project threshold is specified, web.dev's current "good" thresholds are LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, and CLS ≤ 0.1 at the 75th percentile, segmented across mobile and desktop. Treat these as field-performance targets, not as a substitute for understanding a concrete regression. Field data reflects real devices/network/interactions; lab data helps reproduce and diagnose. Lab tools without user interaction cannot measure INP directly; Total Blocking Time can help diagnose likely interaction issues but is not INP.

Frontend performance red flags:

- A route pulls a large application bundle or heavy dependency before the user needs it, with no route-level splitting or justified tradeoff.
- Synchronous parsing, rendering, hydration, or event work blocks interaction on realistic devices.
- Repeated re-renders or unbounded DOM growth makes a common interaction slow; large lists render all rows when a bounded/virtualized strategy is needed.
- Images, embeds, or fonts cause avoidable layout shifts because dimensions/aspect ratio or reserved space are missing.
- Critical content is delayed by avoidable request waterfalls, oversized media, blocking scripts, or unused code.
- A lab score is presented as proof of real-user performance, or a field metric is compared without consistent device/route/percentile context.

## Large-Data Stability Checklist

When a path processes collections, exports, batch work, or aggregations, check only the safeguards relevant to its real bounds and failure modes. If static inspection cannot establish a property, mark it **[Cannot verify statically]** and state what representative load test, query plan, or runtime evidence would confirm it.

| Check | Review question |
|---|---|
| Complexity | Is algorithmic growth appropriate for the enforceable input bound and expected workload? |
| Memory | Is memory bounded or measured for realistic workloads; should the path stream or process chunks? |
| Pagination | Does pagination remain appropriate as the dataset and requested page grow? |
| Lock duration | Are batches and transactions bounded in a way compatible with integrity requirements? |
| Query timeout | Are long-running operations bounded consistently with caller deadlines and recovery behavior? |
| Partial failure | Can incomplete work be retried or resumed without data loss or duplication? |
| Back-pressure | Can a producer overwhelm the consumer or create unbounded queues/buffers? |
| Recursion | Can data-driven depth, cycles, or input growth cause stack/resource exhaustion? |
| Payload | Can unbounded results exceed memory, network, or client limits? |
| Regex/scanning | Can untrusted or large input make matching/search disproportionately expensive? |

Raise a finding only when repository evidence supports a reachable failure under realistic conditions; do not require every checklist mechanism on every path.

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
- Add failure isolation, bounded concurrency, load shedding, or graceful fallback when justified by the path's availability requirements
- Add performance tests or instrumentation if risk is hard to quantify statically
- Replace OFFSET pagination with keyset (cursor) pagination for large tables
- Add checkpointing to batch jobs so partial progress survives failure
- Enforce depth limits on recursive traversal; rewrite as iterative with an explicit stack if depth is data-driven
- Cap input length before applying regex or full-text scan
- Add back-pressure signals (rate limiting, bounded queues, flow control) between producer and consumer
- Split and defer noncritical frontend code; optimize critical assets, render work, and layout stability based on measured user impact
- Use field Core Web Vitals and representative lab traces together; compare the same routes, devices, and percentiles
