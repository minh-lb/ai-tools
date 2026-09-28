# Backend — Data, Async Processing, and Operations (6/10 groups)

Select groups that apply to real system surfaces. Each case needs before/after data, controlled fault injection, and observable DB/cache/queue/log state. Treat the prompts below as separate cases when the feature requires them, not as default expected results.

## 5. Transactions & data integrity
Rollback after a mid-operation failure across tables/steps; no orphan rows; unique/FK violations map correctly without SQL leakage; batch all-or-nothing vs partial behavior; concurrent requests for the same unique key; lost update; optimistic version; deadlock/lock timeout; balances/inventory never negative; read skew/phantoms; long/nested transactions; soft/hard delete, cascade/restrict, restore duplicate natural key, audit (including alternate write paths), migration forward/backward; interleaved job writes; decimal/rounding; UTC/DST; string truncation; four-byte Unicode; NULL vs 0 vs empty. Confirm isolation, locking/version, deletion policy, rounding, timezone, and DB vs application constraints. On failure, inspect **all** related tables and ensure messages are not published before commit.

## 6. Idempotency & duplicate submission
Same key/same payload; same key/different payload; expired/missing/malformed key; key persistence across restart/multiple instances; double click, two tabs, Back+resubmit, slow request, gateway/client retry; concurrent natural-key creation, repeated import, sequence/document numbering; queue/webhook redelivery, overlapping jobs, retry after a user deletes the data. Confirm key owner/location/TTL, conflict policy, unique constraints, retry layer, and delivery semantics. Send 2–5 requests **concurrently** to detect races; disabling the FE button only reduces likelihood.

## 7. Cache
Write/update/delete then read immediately; failed invalidation; update multiple keys; writes through API/job/import; keys partitioned by tenant/user/role; admin response served to ordinary user; private CDN response; logout/permission change; expired/zero/long TTL; stampede/avalanche/penetration; warming; cache unavailable (degrade or fail); serialization types; schema/key version after deploy; eviction/full cache; key collisions; oversized values. Confirm cache layer, key, TTL, tolerated staleness, and behavior when unavailable. Verify response content **after** mutations, not only the first read.

## 8. Message queues & webhooks
Producer publishes only after commit; broker down; crash after publish; PII/schema/version/size; duplicate/out-of-order consumer delivery; poison message→dead-letter queue (DLQ); bounded retry/backoff; crash before/after ACK; backlog recovery; old schemas; DLQ replay and alerts. Outbound webhook HMAC/timestamp, retry/timeout/delivery logs/duplicates; inbound signature/replay/duplicate/out-of-order; destination URL SSRF; worker timeout. Confirm broker, at-least-once semantics, outbox, retry/DLQ owner, messages that must not be lost, ordering key, and partner signature. Redelivery is normal under at-least-once delivery, not an exotic failure.

## 9. Background jobs
Multiple instances/overlapping schedules/manual trigger; crashed lock holder; restart mid-run; rerun; partial chunk failure; batch item failure; retry limit; timeout; chunking/memory; external service outage; repeated recalculation/email; records changed/deleted during run; cleanup scope + dry-run; job dependencies; timezone/DST; sequence numbers; start/end/count/error logs; dashboard/alerts; runtime growth with data and impact on APIs. Confirm job inventory/schedule/lock TTL/chunk/criticality/timezone/alert recipient. A success log does not prove correct results.

## 10. Observability
Correlation ID in response and across services; contextual user/tenant/resource data without secrets; root cause for 500; find a log from a user report; job/message logs; correct log level and structured JSON. Exclude passwords/tokens/OTP/cards/request PII; mask where needed; prevent log injection; enforce log ACL; do not expose paths/SQL to clients. Metrics for latency/errors/requests and CPU/memory/disk/network; 5xx/backlog/job alerts tested in practice; dashboard/tracing. Retain logs ≥3 months, rotate them, separate access/error/activity logs, and audit who changed what/when. Confirm tool, schema, forbidden fields, ACL, and alert owners. Logs that cannot be searched are an operational gap.

Fault injection, concurrency, security scans, and load tests must state the environment and safety conditions; do not affect production without authorization.
