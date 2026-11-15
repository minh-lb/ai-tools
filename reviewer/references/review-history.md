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

Local rounds create a new report file with collision suffix and preserve prior files. PR/MR rounds prepare a new summary and details while preserving prior discussions. Publishing requires [preview and explicit consent](publication-consent.md). Link prior matching discussion instead of duplicating. Verified fixes may be replied to/resolved only after action-specific REPLY/RESOLVE THREADS permission; keep OPEN/UNVERIFIED discussions open.

## PR/MR re-review confirmation

Reassess the full cumulative branch diff and inspect every previous finding in the current snapshot. Match stable finding IDs to actual original comments/threads; an outdated diff anchor or author “fixed” message alone is insufficient.

For each verified fix:

1. Prepare reply to original finding: `✅ R-001 — Đã xác minh giải quyết ở <head SHA>.` Include current evidence, actual checks and gaps. Show full reply in preview; post it only after **REPLY consent**.
2. Prepare resolution of exactly the verified-fixed discussion. GitHub uses review thread ID, GitLab uses MR discussion ID. Resolve only after **RESOLVE THREADS consent** and verify provider state. A shared discussion stays open if other issues remain.
3. Include finding in this round's Resolved list; link confirmation only after it is posted. Otherwise mark reply/resolution as not published. Never claim a thread was resolved without checking provider state.

For OPEN, keep it in Problems and retain original discussion link; optional follow-up reply requires preview and **REPLY consent**. UNVERIFIED remains open with explicit gaps. Do not reopen previously resolved discussion without authorization.

PR/MR reviews default to read-only. Full [preview](publication-consent.md) and **separate user consent** are mandatory before comment, reply, resolve or approve. Embedded handoff and earlier consent do not grant permission. No blanket resolution, merge or source edit. Follow [approval readiness](pull-request.md#approval-readiness), and recheck base/head before authorized writes.

## Identity across moves and revisions

Match a prior ID by root cause: violated requirement/invariant, reachable trigger, affected operation/resource and practical remediation. Path, line, title, severity and dimension are attributes, not identity. Inspect rename/move evidence and corresponding source/callers; a missing old path is not a fix. Retain the ID and old discussion link when the same cause moves, changes wording/severity or appears in another affected layer. Update its current location and evidence; do not count the move as one resolution plus one new defect.

Use a new unused ID for an independent cause requiring a different remedy. If a cause reappears within the same review history, reuse its ID and explain the regression, without automatically reopening a resolved thread. For splits/merges, preserve lineage in the affected entries and count unique causes, not comment count. If matching is uncertain, disclose it and avoid claiming resolution or duplicating a suspected identical finding. Do not force the same ID solely because two findings share a severity or path.
