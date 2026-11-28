# Output and Local Delivery

Use [template](../templates/review-report.template.md). Optional [local example](../examples/review-report.example.md) and [PR/MR example](../examples/document-review.example.md).

## Report shape

Start with round/time, Resolved/Problems counts and priority totals. Include concise **Scope & Verification** in every report, even with zero Problems: exact provider/local source and pinned snapshot; checked files or diff range; commands and tests **actually run with results** or not run; notable uninspected surfaces/material evidence gaps; verdict `Changes requested`, `Needs verification` or `Ready`. Keep 14 dimensions assessed internally rather than showing long checklist; never invent passed tests.

Then Resolved and Problems lists. A local report includes Detail with File, Lý do (evidence/trigger/impact), Đề xuất chỉnh sửa and Cách kiểm tra (specific **proposed** check/expected result). Tái hiện is optional. A PR/MR summary has no Detail section: each Problem links to its verified posted inline/fallback discussion or is labeled **chưa đăng**, with full unposted detail provided in user preview. Do not create invented findings for gaps. Evidenced Low nonblocking findings may coexist with Ready, but material unverified risk forces Needs verification.

Formatting a review or returning an embedded handoff never grants comment/resolve/approve permission. Follow [mandatory PR/MR consent](publication-consent.md).

## Local files

For a chat-only request, return the report inline. Otherwise use the repository root inside the authorized workspace, or the invocation directory if there is no repo. Save `docs/reviewer/YYYY-MM-DD_<description>.md` using local date and an ASCII kebab-case description (default code-review/document-review). Reject symlink escapes, write exclusively, add -2/-3 on collision and never overwrite. Read back before claiming success. If blocked, return the full report inline and state that saving was blocked.

## Embedded handoff

Return snapshot, finding IDs/severity/blocking flags, previous dispositions (`RESOLVED`/`OPEN`/`UNVERIFIED`), actual check results, gaps and verdict (`NO_BLOCKING_FINDINGS`/`CHANGES_REQUIRED`/`REVIEW_INCOMPLETE`). Include provider publication state, default `DRAFT_ONLY`. A verdict or orchestrator handoff is not consent to publish.
