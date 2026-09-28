# NFRs and Integration (17 requirements / 6 groups)

NFRs constrain *how* a system operates. Mark an NFR case `ready` only when its measurement, threshold, environment, and workload are defined. Integration between screens/APIs/DB/async components belongs to both layers; record each FE and BE oracle once in the initiating feature's suite and link related features.

| Group | Requirement and test direction |
| --- | --- |
| Performance (1–4) | Screen transitions ≤3 seconds if applicable; throughput at 20 concurrent users; load test with 20 users; peak load is twice normal. Define a separate API threshold, percentile, measurement window, dataset, baseline RPS, and environment; do not infer API limits from screen timing. |
| Reliability/availability (5–7) | Uptime target is **unresolved** (99.8% is only an example, not an acceptance criterion); automatic failover when a server fails; back up user/log/config data every 7 days—test restore and integrity, and confirm RPO/RTO. |
| Security (8–10) | Login with ID/password plus authorization; TLS in transit and password hashing at rest; sessions expire after one day plus an **unspecified** idle timeout; CSRF/XSS controls. Confirm minimum TLS/HSTS/certificates, hash+salt, session/revocation, and cookie vs bearer auth. FE renders safely; BE enforces access and safe logging. |
| Operations (11–14) | Monitor CPU/memory/disk/network/application; retain error/access/activity logs ≥3 months; schedule maintenance to reduce user impact; verify releases/patches in a validation environment with smoke/regression checks and rollback readiness. Define alert channel, owner, and deployment acceptance criteria. |
| Compatibility (15–16) | Latest Chrome/Edge/Safari; web-only, no native app. Approve a browser × OS × device × viewport matrix; native-app checks are N/A for web-only products. |
| Usability (17) | Responsive desktop/tablet/mobile layout and flows across breakpoints and touch/keyboard use; define device matrix, viewport, zoom, and design version. |

Integration examples: registration→login; create→list/details as another user; form→API→DB→cache/queue→UI read-back; mid-operation failure→rollback/no duplicate; role/token/tenant changes mid-flow; retry after network loss even though the server committed; back/refresh mid-flow. Distinguish single-screen from cross-screen tests. FE observes UI state; BE verifies side effects. Model complex flows as state machines and test valid/invalid/recovery transitions.

Record unresolved questions: uptime target, idle timeout, TLS minimum/HSTS, hash algorithm, API SLO/percentile, load profile, RPO/RTO, restore verification, browser/device matrix, monitoring/alert owner. Never turn examples into formal criteria. Large NFR/cross-feature cases may live in a shared integration suite if the project requires it; the feature file must still link to that suite and state coverage status.
