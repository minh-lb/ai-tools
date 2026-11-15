# Snapshot Freshness Before GitHub PR / GitLab MR Writes

Capture actual provider/host/target identity, base project/ref/SHA, head project/ref/SHA and merge-base. For GitLab, record the diff version's `base_sha`, `start_sha`, `head_sha` and applicable positions where API exposes them. A target tip is not a verified merge-base.

All reviewed source, design, CI evidence, findings and inline positions must match a complete cumulative snapshot. Before preview and again immediately before every approved comment, reply, resolve or approval batch, re-read both endpoint identities/SHAs, diff refs and target state. HEAD SHA alone is insufficient.

Detect target retarget, base advance, source branch/repository replacement, head change, force push and invalid positions. On material change, recompute merge-base/diff version, fetch all cumulative changes, reassess findings/anchors and produce a **new preview requiring fresh permission**. Never reuse consent for a material change. If source unavailable, stop writes and return unposted draft with blocker.

If base advances but diff/context remain genuinely equal, record verified equivalence and validate positions, avoiding irrelevant repeated checks. Never assume it. If drift continues, report incomplete review instead of retrying indefinitely.

Verify returned comment/review/discussion target, body, position, snapshot and state; on race, distinguish what was published from what is currently reviewed, without claiming the old write was undone. Inspect provider state before retrying uncertain writes. Publishing one comment never authorizes resolution or approval.
