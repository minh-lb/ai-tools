# Review Rounds and Finding Status

Use the shared template for every round. Heading uses local `YYYY/MM/DD HH:mm`; filenames keep `YYYY-MM-DD_description.md`.

## Compare rounds

Read the previous report or PR summary/inline threads for the same scope when available. Record its link/path and reviewed snapshot; do not mix histories from unrelated PRs or scopes. Use round 1 and Resolved 0 for an initial review. Increment a known preceding round; if a preceding review is known but unavailable, label the round unknown and disclose missing history instead of inventing a number or resolutions.

Give each root cause a stable ID (`R-001`, etc.); preserve IDs across rounds and allocate unused IDs to new problems. Carry forward prior severity for resolved entries. Assess current severity for confirmed open issues; explain material changes. An author saying “fixed”, a disappearing diff hunk or a resolved platform thread alone does not prove a fix.

- `RESOLVED`: previous finding whose root cause is demonstrably addressed in the current snapshot. Include current location/check proving the fix in the Resolved list. List it only in the transition round, not as a new resolution on every later review; preserve older history.
- `OPEN`: confirmed current defect, including a new issue or a still-reachable prior issue. Include in Problems and Detail.
- `UNVERIFIED`: prior issue whose current status cannot be established. Keep in Problems with an explicit label and missing evidence; use its last known severity, marked as such. Its detail requests verification, not an assertion that the defect persists. A new unsupported hypothesis goes in verification gaps, not Problems.

Resolved counts only newly verified resolutions; Problems counts unique OPEN + UNVERIFIED IDs. High/Medium/Low counts apply to Problems, not Resolved. Add Critical when nonzero; keep the existing severity model. Sort both lists and details by severity. Reconcile counts with lists before delivery. Zero Problems with material evidence gaps is still `Needs verification`, not automatically `Ready`.

## Publish

Local rounds create a new report file with the normal collision suffix; preserve prior files. PR rounds create a new summary plus inline details for current problems per PR delivery guidance; preserve prior comments. Link existing matching inline discussion for an unchanged finding rather than repeating the same detail. A materially changed finding may receive an updated follow-up at a valid current anchor. For a verified fix on PR re-review, reply to its original thread with confirmation and current evidence, then resolve that exact thread and verify the platform state. Follow the PR delivery rules below; keep OPEN/UNVERIFIED threads unresolved.

## PR re-review confirmation

Reassess the full cumulative branch diff and inspect every previous finding in the current snapshot. Match stable finding IDs to actual original comments/threads; an outdated diff anchor or author “fixed” message alone is insufficient.

For each verified fix:

1. Reply to the original finding: `✅ R-001 — Đã xác minh giải quyết ở <head SHA>.` Name the changed path/lines or mechanism that removes the root cause, actual checks/results, and any runtime checks not run. A static proof may suffice; never describe proposed tests as executed.
2. Resolve only that finding’s thread after the confirmation reply succeeds. Use the GraphQL thread ID, not an issue/comment/review ID; verify the returned/read-back `is_resolved` state. If multiple independent issues share a thread, resolve it only when all are verified fixed.
3. Include the finding in this round’s Resolved list with a link to the confirmation. If reply/resolve is blocked, distinguish “fix verified” from “thread not resolved”; do not claim the platform operation succeeded.

For an OPEN finding, keep it in Problems, retain its existing inline link and reply once with why it remains open when useful for this re-review. For UNVERIFIED, state missing evidence and keep the thread open; do not mark it resolved to demonstrate the workflow. Do not reopen an already-resolved thread without authorization; disclose conflicting state.

PR review invocation includes confirmation replies and resolving verified-fixed finding threads. Explicit draft/read-only/no-resolve instructions override this. This does not authorize blanket resolution of unrelated discussions, merging or source edits. Approval follows the eligibility and verification rules in [PR delivery](pull-request.md#approve-when-no-issues-remain). Preserve prior summaries/comments. Before retrying uncertain writes, inspect existing replies and thread state to avoid duplicate confirmations. If the head changes before publication, recheck affected findings before resolving.
