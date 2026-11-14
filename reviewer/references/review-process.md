# Review Process

## 1. Establish the source

Record intent/acceptance criteria if available; otherwise state only assumptions that affect findings. Separate review scope from artifact location: invoking from `src/` still uses the project root for `docs/reviewer/`; stay within the authorized workspace.

- **Documents:** identify files/version and document sections. For proposals, assess stated contracts and feasibility, not unimplemented code. Use [document guidance](technical-documents.md).
- **Codebase:** record HEAD plus dirty/untracked state affecting inspected files; a dirty checkout is not an immutable commit. Exclude generated/vendor/build/dependency files unless material. Without Git, identify the supplied files/snapshot and limitations.
- **Branches:** pin base/head SHAs and merge-base. Review the full cumulative merge-base → head diff across all commits, including on re-review. HEAD SHA identifies the snapshot/inline anchors, not HEAD-only scope. Tip-to-tip requires an explicit request. Missing/ambiguous refs or no common ancestor require clarification. Read head source via `git show <sha>:<path>`, deleted source from merge-base; never checkout.
- **Commit/range:** a single ordinary commit compares parent → commit; root commit compares empty tree → commit. For a merge commit, ask which parent/comparison unless specified. Preserve explicit two-dot/tip comparison; record actual endpoints and semantics.
- **Working tree/staged:** include only the requested layers, identify comparison base, and list included untracked files. For embedded task-delivery reviews, use the orchestrator's captured pre-task dirty baseline to distinguish task changes from user-owned edits; ask when the task diff cannot be isolated safely. For any checkout-based review, recheck state before finalizing; if it changed, reassess affected paths or disclose snapshot drift.
- **PR/patch:** PR base is its target; read the complete paginated PR diff, never just the latest commit. Local base requires explicit input/project policy; tracking branch need not be the target. Partial patches permit bounded review with patch coordinates and disclosed gaps. Request inaccessible source; never attribute another checkout’s tests to this revision.

## 2. Trace behavior and impact

For documents, trace requirements, guarantees, examples and operational steps using the document reference. For code, first [map design → implementation → tests](design-alignment.md), then inspect changed lines in context. For codebase review, map entry points and prioritize auth, money, writes, migrations, public contracts and critical user journeys. Follow callers/consumers as well as callees; check return shapes, nullability, errors, side effects and stored data assumptions. Read beyond the diff where needed.

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

Extra tools are optional; static review can continue without them. Delegate only when authorized. Reviewers share scope/snapshot; the coordinator verifies findings, seams and duplicates. Claim only checks actually performed.

## 4. Calibrate evidence and report

A finding needs a reachable trigger, exact source location, concrete incorrect behavior/impact and practical fix. Confirm mitigations and caller assumptions before reporting. Use the reviewed revision's line numbers; distinguish head/base sides for deleted code. For patch-only evidence, label patch coordinates; never invent full-file lines or missing context. For code coverage, cite the implementation; for document omissions, cite the section where the required contract or step belongs and the evidence that makes it necessary.

Merge findings sharing a root cause and remediation, including across dimensions. Missing regression coverage for a reported bug belongs in that finding's remediation; use a separate TEST finding only for an independent coverage risk. Keep unverified hypotheses (including runtime-only suspicions) in verification gaps with the needed check. A static proof or actual runtime observation can establish a finding; cite the evidence and environment.

Use [severity](severity-model.md). Internally distinguish assessed/no finding, unverified and N/A (no relevant surface, not “unread”). Confirmed findings can coexist with coverage gaps; disclose material gaps without inventing defects.

Disposition:

- **Changes requested:** at least one material defect (normally Medium–Critical); mention concurrent verification gaps.
- **Needs verification:** no established material defect, but missing evidence/coverage prevents a reliable scope decision.
- **Ready:** no material defect and verification adequate for the stated scope. Low nonblocking findings may remain; state them. Review readiness is not deployment approval or proof of absence of bugs.

Publish using [output rules](output-delivery.md) and [round/status rules](review-history.md). PR writes also require [snapshot checks](review-snapshot.md) and [PR delivery](pull-request.md). Read back results before reporting success.
