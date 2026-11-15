# PR/MR Publication Preview and Explicit Consent

Mandatory permission boundary for **GitHub Pull Requests** and **GitLab Merge Requests**. Review starts read-only. A URL, request to review, prior consent on a different snapshot, or an orchestrator handoff **never grants permission** to post or change provider state.

## Step 1 — Complete preview without writes

After reading the full cumulative diff and relevant existing discussions, show:

1. **Target:** provider/host, owner or project, PR/MR number and URL, first review vs re-review.
2. **Snapshot:** base/target repository, ref, SHA; head/source repository, ref, SHA; merge-base or GitLab diff refs/version; any gaps.
3. **Verdict:** Changes requested / Needs verification / Ready, blocking findings, verification gaps, actually executed checks (not merely proposed checks).
4. **Full publication plan:** every summary, inline/general comment, reply, thread resolution and approval. Give full text of EVERY planned comment and reply (or a directly viewable complete draft), finding IDs, precise file/side/line or discussion, and counts by action. Label comments without valid anchor and exact fallback.
5. **Separate permission types:** `POST COMMENTS`, `REPLY`, `RESOLVE THREADS`, `APPROVE`. General-comment fallback must be explicitly included in the comment plan. A single confirmation may approve a clearly enumerated set, but no additional action types may be inferred.

When no findings exist, still preview summary and any requested approval. Do not post a placeholder comment merely to obtain consent.

## Step 2 — Wait for explicit and unambiguous consent

**Do not write to the PR/MR until the user explicitly authorizes the listed actions for this named target and snapshot after seeing preview.** An ambiguous acknowledgment, request to edit preview, silence, earlier approval for another round, or permission to `POST COMMENTS` does not authorize `REPLY`, `RESOLVE THREADS`, `APPROVE`, or unlisted fallback. Where consent is unclear, retain draft and ask one focused question.

Example: "Cho phép POST COMMENTS (2 inline, 1 summary, không fallback) trên GitHub PR #42 tại head abc123; không REPLY/RESOLVE/APPROVE."

## Step 3 — Freshness and permission enforcement

Immediately before each authorized publication batch, read target/base/head identities, SHAs, diff version, positions and existing discussions. On **material snapshot drift**, refresh the complete cumulative diff, revise findings/anchors and **request fresh permission with a new preview**. Permission for an obsolete snapshot is void. Verified nonmaterial metadata drift may be disclosed without rerunning unrelated checks; do not assume equality.

Publish only confirmed action types; verify returned URL, body, location and provider state. Inspect uncertain writes before retrying to avoid duplicates. If tools or permissions are unavailable, return unposted draft and blocker. **Never silently substitute a different channel or provider.** Review consent never permits source changes, merge or push.
