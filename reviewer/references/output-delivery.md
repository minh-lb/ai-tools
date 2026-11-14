# Output and Local Delivery

Use the bundled [template](../templates/review-report.template.md). Optional examples: [local code](../examples/review-report.example.md) and [PR documents](../examples/document-review.example.md).

## Report shape

Lead with local round/time, Resolved/Problems counts and priority totals, then Resolved and Problems lists. Local reports include Detail; PR summaries have no Detail heading/content and link each problem to its inline comment. Use emoji plus text labels; retain Critical when applicable. Include File (optional when PR anchor suffices), Lý do (evidence/trigger/impact), Đề xuất chỉnh sửa and Cách kiểm tra (specific check/expected result). Add 🔁 Tái hiện only when minimal steps clarify the issue. Distinguish suggested tests from actual check results.

Keep the 14-dimension coverage assessment internal; no separate scope/verification section or checklist table. Put material evidence/limits in the relevant Detail. The public report contains only the template sections. With Detail present, evidence and limitations belong in its Lý do/Cách kiểm tra; the report ends after the final Detail. With no applicable Detail, use one brief limitation sentence after Problems. Keep readiness verdicts internal or in the embedded handoff; workspace paths and review-process narration are not report content. Explicitly state when there are no problems. A finding must not be invented merely to house a gap.

## Local files

Capture project root as the repository root within the authorized workspace; without a repository, use the invocation directory. Save `docs/reviewer/YYYY-MM-DD_<description>.md` under that root using current local date and short ASCII kebab-case description, default `code-review` or `document-review`. Verify resolved parents/destination stay within project/workspace; reject symlink escapes. Create exclusively, appending `-2`, `-3`, etc. on collision; never overwrite. Read back before returning the file link and brief outcome. If blocked, return the full report inline and state it was not saved.

## Embedded handoff

Apply the same local/PR routing. Additionally return reviewed snapshot, finding IDs/severity/blocking flags, previous finding dispositions (`RESOLVED`/`OPEN`/`UNVERIFIED`), gaps and verdict (`NO_BLOCKING_FINDINGS`/`CHANGES_REQUIRED`/`REVIEW_INCOMPLETE`). Material defects normally block. This structured handoff is not an extra public report section.
