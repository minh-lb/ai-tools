# GitHub Pull Request / GitLab Merge Request Delivery

## Review draft only by default

For GitHub Pull Requests and GitLab Merge Requests, **never post anything merely because review was requested**. Resolve the exact PR/MR target; capture base/source repositories, branches, SHAs and merge-base. For GitLab note diff version, `base_sha`, `start_sha`, `head_sha` and provider-specific line positions when available. Inspect the complete paginated merge-base → HEAD diff and existing review discussions, not only the latest commit.

Build summary and details using [report](output-delivery.md) and [history](review-history.md). Report the reviewed snapshot, actual checks, material verification gaps, Ready/Needs verification/Changes requested and stable finding IDs. Prepare each inline detail with evidence/trigger/impact, remediation and proposed verification; distinguish tests run from suggested checks. Zero findings alone is not approval.

Show a **complete publication preview**: full summary and every intended inline/fallback comment and reply, its location, thread resolutions and any approval action with counts and permission types. Follow [publication consent](publication-consent.md). **Do not write ANYTHING until explicit user confirmation** for this exact target, snapshot and action types. Draft-only/preview-only stops after the preview.

## Execute only authorized publication actions

1. Immediately recheck [snapshot freshness](review-snapshot.md), target state, base/head SHAs, diff refs and valid positions. On material drift, re-evaluate and **re-preview/reconfirm** before writing.
2. Publish inline details at verified exact positions. Reuse existing matching comments/discussions instead of duplicating. If anchor is invalid or inline API unavailable, publish the full detail as a general comment/discussion **only with explicit fallback permission** in preview; otherwise mark it unposted and return full detail to user. Never anchor to an unrelated line.
3. Publish exactly one summary linking to created inline/fallback comments/discussions, or mark unposted entries. PR/MR summary has no Detail; if an eligible separately authorized approval uses summary as review body, avoid duplicate summary comment.
4. For verified-fixed findings, reply to original discussion **only if REPLY was authorized**, stating current SHA, fix evidence and real checks. Resolve the exact GitHub review thread or GitLab MR discussion **only if RESOLVE THREADS was authorized** and API allows it. Do not resolve a thread containing other open/unverified findings or blanket resolve.
5. Verify the posted text, target, comment URL, commit/diff position and provider state; on uncertain writes, inspect state before retrying to avoid duplicates. Report partial success and real URLs; never invent links or claim unsupported approval/resolution.

GitHub PR inline comments and GitLab MR discussions have different IDs and position models. If the connected GitLab API lacks write/approval/discussion capabilities, keep those actions unposted; do not silently switch channels. An authenticated CLI/API is permitted only after authorization for its exact action/target.

## Approval readiness

`Ready` requires no confirmed material blocking defects (normally Medium–Critical), adequate verification of full scope and no material gaps. **Evidenced Low nonblocking issues may remain** and must be listed. `Needs verification` is not Ready even with zero Problems.

Provider `APPROVE` is **never automatic**: it needs separately previewed and explicitly authorized approval for the exact PR/MR and snapshot. Recheck open/reviewable state, both SHAs, permission and provider constraints before approval. Do not approve a draft/closed/changed or inadequately reviewed target. GitHub authors cannot approve their own PRs; GitLab permissions and approval tools may differ. Unsupported approval is reported, not converted to a silent comment.

When findings or verification gaps remain, a summary may post **only after POST COMMENTS consent**. Platform REQUEST_CHANGES, merging and code/branch modifications are never implied by review.
