# Snapshot Freshness Before PR Writes

A stable head SHA alone does not establish the review target. Capture host/PR and base repository/ref/SHA, head repository/ref/SHA, and merge-base where available. Diff/source/design/CI evidence must correspond to that snapshot. Never present a base tip as a verified merge-base.

Before a publication batch, a fix-confirmation/resolve operation or APPROVE, re-read both base and head identities and SHAs. Detect base advancement, PR retargeting, source-branch/repository changes, and head advancement even when one SHA is unchanged. Recheck again immediately before approval or resolution after intervening work. Record the snapshot internally; do not add report sections.

If either endpoint/identity changes, recompute merge-base and refresh the complete cumulative diff and changed-file list across all pages. Compare it with the reviewed diff, reassess affected requirements/callers, findings, fix evidence, anchors and check attribution. Even with unchanged head, a retargeted PR may contain additional changes. If refreshed diff/source is unavailable, stop mutating publication/resolution/approval and return the draft plus the missing-evidence reason. Do not publish an old-snapshot summary as current.

If a base advance leaves the cumulative diff and relevant context unchanged, document the equality internally and refresh metadata; repeating unrelated checks is unnecessary. Do not guess refs, checkout another revision, or silently narrow to the latest commit. If repeated drift prevents a stable decision, report incomplete review instead of retrying indefinitely.

Tools may pin only head commit, not atomically verify base. Verify returned review/comment commit and target, and re-read both endpoints after publication. On a race, distinguish an artifact published for the captured snapshot from a review of the now-current PR; reassess before additional approval/resolution. Never claim an already-sent operation was undone. Approval/resolve success and review freshness are separate facts.
