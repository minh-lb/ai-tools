# Review Process

## 1. Establish the source

Record intent/acceptance criteria if available; otherwise state only assumptions that affect findings. Separate review scope from artifact location: invoking from `src/` still defaults `codebase` to the repository's application code, bounded by the authorized workspace; the report remains under that invocation directory.

- **Codebase:** record HEAD plus dirty/untracked state affecting inspected files; a dirty checkout is not an immutable commit. Exclude generated/vendor/build/dependency files unless material. Without Git, identify the supplied files/snapshot and limitations.
- **Branches:** resolve base and head to commit SHAs, then their merge-base. Default `base...head` is merge-base → head. Pin reads/diffs to resolved SHAs; tip-to-tip is only for an explicit request. Missing refs, ambiguous roles or no common ancestor require clarification, never a fallback to current changes. Read source from the head tree (`git show <sha>:<path>`); deleted code uses the merge-base side. Do not checkout another branch.
- **Commit/range:** a single ordinary commit compares parent → commit; root commit compares empty tree → commit. For a merge commit, ask which parent/comparison unless specified. Preserve explicit two-dot/tip comparison; record actual endpoints and semantics.
- **Working tree/staged:** include only the requested layers, identify comparison base, and list included untracked files. For any checkout-based review, recheck state before finalizing; if it changed, reassess affected paths or disclose snapshot drift.
- **PR/patch:** record the supplied source and available base/head identity. A partial patch permits a bounded review; cite patch-side coordinates and disclose unavailable context. If no source is accessible, request it. Never run checks in a different checkout and attribute results to the reviewed revision.

## 2. Trace behavior and impact

Inspect human-authored changed lines in their containing functions and relevant context. For codebase review, map entry points and prioritize auth, money, writes, migrations, public contracts and critical user journeys. Follow callers/consumers as well as callees; check return shapes, nullability, errors, side effects and stored data assumptions. Read beyond the diff where needed.

For each distinct behavior, trace materially different scenarios, grouping equivalent cases rather than taking a Cartesian product:

| Axis | Consider when reachable |
|---|---|
| Input | Empty/null/zero, boundaries, malformed, oversized, duplicate/stale/adversarial |
| State/actor | Fresh/partial state, wrong role/tenant, expired credentials, concurrent writes |
| Failure/operation | Timeout after side effect, retry, cleanup, rollback, dependency outage, mixed versions |
| Browser | Direct load/history, loading/empty/error/success, repeated action, stale response, unmount, narrow viewport/zoom, keyboard/focus, SSR/hydration |

Trace failure through catch/retry/compensation/finally and the caller after external calls return. Stop tracing into an unavailable external implementation; verify its visible contract and local handling. Do not invent external guarantees. Check end-to-end frontend/backend seams when in scope.

Check necessity and reuse: demonstrated requirement → existing project code → standard library/platform/framework → already-declared dependencies → smallest complete implementation. Verify equivalent semantics for supported versions before recommending substitution. Report concrete cost/risk, not stylistic preferences or speculative features. Preserve the [safety constraints](../SKILL.md#safety).

For large scopes, inspect high-risk paths first. Sample repetitive changes only after confirming equivalence. Record important uninspected paths; partial coverage cannot support a whole-repository readiness claim.

## 3. Evaluate and validate

Check all 14 dimensions for applicability, including indirectly affected consumers. No schema change does not make DB N/A when query/write behavior changed. No API shape change does not make API N/A when error/retry semantics changed. Prefer focused searches/reads and reuse evidence across dimensions.

Run relevant safe project checks after inspecting commands/hooks, configs and external dependencies. Do not install packages or start services merely to satisfy a checklist. Record command, environment, tested revision and result, or the reason not run. Distinguish pre-existing failures from regressions only when evidence supports that distinction. Review tests for whether they detect the actual failure; missing tests alone do not prove broken behavior. Browser/assistive-technology checks are needed for runtime claims; static review or automated scans cannot certify WCAG conformance.

Available CI, browser or specialist tools can add evidence; absence never blocks static review. Delegation is optional only when explicitly requested/authorized by the user or applicable project instructions and supported by the host. All reviewers must share scope and snapshot; coordinator verifies candidates, cross-layer seams and duplicates, then writes one report. Do not imply a delegated pass or check occurred without evidence.

## 4. Calibrate evidence and report

A finding needs a reachable trigger, exact source location, concrete incorrect behavior/impact and practical fix. Confirm mitigations and caller assumptions before reporting. Use the reviewed revision's line numbers; distinguish head/base sides for deleted code. For patch-only evidence, label patch coordinates; never invent full-file lines or missing context. Cite the implementation for absent coverage.

Merge findings sharing a root cause and remediation, including across dimensions. Missing regression coverage for a reported bug belongs in that finding's Fix; use a separate TEST finding only for an independent coverage risk. Keep unverified hypotheses (including runtime-only suspicions) in verification gaps with the needed check. A static proof or actual runtime observation can establish a finding; cite the evidence and environment.

Use [severity](severity-model.md) for each finding. Checklist severity is the worst independent finding in that dimension. `✅ Đạt` means assessed with no finding in this scope, not certified safe. `⚪ Chưa xác minh` means applicability is established but assessment is materially incomplete; explain why. `— N/A` means no relevant surface, never “not inspected.” A row may have a supported severity plus an explicit assessment gap in Summary.

Disposition:

- **Changes requested:** at least one material defect (normally Medium–Critical); mention concurrent verification gaps.
- **Needs verification:** no established material defect, but missing evidence/coverage prevents a reliable scope decision.
- **Ready:** no material defect and verification adequate for the stated scope. Low nonblocking findings may remain; state them. Review readiness is not deployment approval or proof of absence of bugs.

State when there are no findings. Summary contains only reviewed source/scope, material assumptions/exclusions, actual checks/results and remaining risks/gaps. Write once using the bundled template; avoid repeating the full report in chat after saving it.
