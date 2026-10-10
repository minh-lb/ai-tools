# Review Process

## Contents

1. Objective
2. Scenario Enumeration (mandatory for every review)
3. Review Depth and Limits
4. Optional Parallel Frontend/Backend Specialist Review
5. Simplicity, Reuse, and Platform Fit (mandatory)
6. Review Sequence (Codebase Review: 6 steps / Code Change Review: 7 steps)
7. Evidence Standard
8. Reporting Format
9. Large Scope and Diff Strategy
10. When To Mark N/A
11. External Guidance

## Objective

The purpose of review is to identify meaningful risk before merge or deployment. Focus on defects, regressions, unsafe assumptions, missing controls, and operational blind spots. Assess whether the change improves or preserves overall code health while still allowing useful work to progress; require fixes for material risk, not perfection, personal style preferences, or unrelated broad refactors. A good review does not try to rewrite the whole change. It isolates the highest-value findings with enough evidence that another engineer can validate and act on them.

## Review Depth and Limits

- Calibrate depth to impact and expected lifetime. Deeply inspect security, authorization, money, destructive writes, public contracts, migrations, and long-lived core paths. A hotfix or one-off utility may need a narrower review, but urgency does not excuse ignoring a known critical risk; state the scope and residual risk.
- Code review complements—not replaces—compilation, static analysis, automated tests, integration testing, and QA. Never claim that a review proves the code bug-free or that an unrun check passed.
- Let configured formatters, linters, type-checkers, and CI gates handle mechanical rules when available. Review their relevant failures, but spend human review effort on intent, behavior, design, and realistic risk rather than personal style preferences.
- If required runtime evidence or domain expertise is unavailable, state the exact verification limit and request a suitable follow-up instead of guessing.

## Optional Parallel Frontend/Backend Specialist Review

A single reviewer is the default. Use separate frontend and backend subagent passes only when both surfaces have material changes and the feature has a meaningful cross-layer contract or end-to-end behavior, or when a large/high-risk mixed diff can be split into genuinely independent review lanes. Do not split a small change that merely touches both sides for mechanical wiring, a docs-only change, or a one-surface scope. If the user requests one reviewer, honor that.

Delegate only when subagents are available and permitted by applicable harness/project rules. Invoking this skill authorizes these bounded specialist passes when the trigger above is met, unless the user requests one reviewer; obey any stricter rule requiring separate consent. Use only subagents allowed by the repository's privacy/security constraints, and do not transmit repository content to an external service without user authorization. If delegation is unavailable or unauthorized, complete the review as one reviewer; do not imply parallel review occurred.

Before dispatch, the coordinating reviewer must provide both specialists with the same:

- Review mode, intent, acceptance criteria, and explicit scope/exclusions.
- Immutable source snapshot. In `git-diff` mode, include the exact `base`, `head`, resolved SHAs, merge-base, and the same diff semantics; in `codebase` mode, identify the same repository snapshot and bounded scope.
- Relevant contracts and known verification limits. Do not let either specialist substitute another branch, working-tree state, or diff source.

Bound the responsibilities:

- **Frontend specialist:** browser-visible behavior, routing, forms, client state, rendering/hydration, responsive behavior, UI, Accessibility, frontend security/performance, and relevant tests. Trace requests to the shared API boundary and verify consumer assumptions against the contract.
- **Backend specialist:** API behavior/contracts, validation, authorization, domain logic, persistence/side effects, errors, concurrency, observability, infrastructure, and relevant tests. Trace responses/events to the shared boundary and verify provider behavior against the contract.

Each specialist returns only evidence-backed candidate findings with dimension, severity, exact path/line in the shared snapshot, triggering scenario, impact, remediation direction, and confidence/verification limits. They also state the scope inspected, material exclusions, and checks actually run. Do not ask both specialists to produce full reports or repeat the same test suite; coordinate safe checks once.

The coordinating reviewer remains accountable for the review. Independently verify candidate paths, citations, trigger conditions, and risk; reconcile duplicates or conflicting assumptions; inspect the frontend/backend seam end-to-end (including auth/authorization, response/error shape, loading/failure UI, and data effects as applicable); evaluate uncovered dimensions; and set the final status for all 14 checklist rows. Subagent output is input, not proof. Only the coordinating reviewer writes the single canonical report under `docs/review-code/`; specialists must not modify application files or create separate reports.

## Simplicity, Reuse, and Platform Fit

This is a mandatory review gate, not a new report dimension. Apply it to every new or substantially changed feature, component, helper, dependency, abstraction, configuration, or algorithm. In `codebase` mode, use it to detect concrete duplication or unnecessary custom machinery within scope; do not infer that a product capability is unneeded without requirements.

Ask, in order:

1. **Does this need to exist?** Tie it to the issue, acceptance criteria, user need, or a demonstrated defect. If intent is unclear, state the assumption or ask only when it materially affects the review; do not invent requirements.
2. **Does the codebase already provide it?** Search the target revision for an existing function, component, service, design-system element, shared utility, or package that already meets the requirement. Avoid parallel implementations and wrappers that add no meaningful behavior.
3. **Can the standard library do it?** Check the language/runtime standard library before adding hand-written utilities or dependencies.
4. **Can a native platform or framework feature do it?** Check browser/platform APIs and existing framework capabilities in the project's supported versions. Verify the actual semantics and limitations; do not assume a native feature is equivalent by name alone.
5. **Is a suitable dependency already declared?** Inspect the project manifest and lockfile, not a globally installed package. Prefer an existing, maintained dependency when it fits; if proposing a new dependency, explain why existing code, standard-library, platform, and framework facilities are insufficient, then assess security, maintenance, license, compatibility, and (for web UI) bundle/runtime cost.
6. **Would a one-line call or smaller implementation be enough?** Prefer a direct, clear call when it meets the contract. Do not optimize for line count: an opaque one-liner or wrapper that hides validation, failure behavior, or policy is not simpler.
7. **What is the minimum working solution?** Include the branches, configuration, abstraction, and extension points required by current behavior; omit speculative future flexibility.
8. **Are safety invariants preserved?** Apply [Non-Negotiable Safety Invariants](../SKILL.md#non-negotiable-safety-invariants): simplification must not cut necessary validation, error handling, security, or (for web UI) accessibility. Prove equivalent controls remain at the correct boundary when logic is consolidated or removed.

A finding needs repository evidence and a concrete cost or risk, such as duplicated behavior that can diverge, an unnecessary dependency with maintenance/security/bundle cost, custom code replacing an adequate native facility, or complexity that increases defect risk. Do not report “a one-liner would be nicer” or “this feature may not be needed” as a finding by itself. Attribute the finding to the root dimension (usually Architecture or Maintainability; Security/Performance when that is the concrete impact) and avoid duplicate findings for the same cause.

## Scenario Enumeration

Before evaluating any dimension, identify the materially distinct reachable scenario classes for each entry point or changed path. Do not enumerate every Cartesian combination: combine variants when they do not change behavior, and split them when interactions (for example, tenant + retry, or mixed-version rollout + old data) alter the outcome. Assume a scenario is reachable unless code, schema, or infrastructure explicitly prevents it. Record meaningful scope limits instead of implying exhaustive coverage when the codebase is too large to inspect fully.

| Category | Key scenarios to enumerate |
|----------|---------------------------|
| **Input** | Empty/null/zero · boundary min/max and off-by-one · malformed or truncated · very large (10×/100×) · duplicate or idempotency-retried · out-of-order or stale · adversarially crafted |
| **State** | Fresh system (no data) · near resource limits · concurrent modification of same record · partially completed prior op · expired/revoked credentials · dependency down or slow · clock skew |
| **Actor** | Unauthenticated · wrong role/tenant/owner · minimum permissions · admin (can they reach what they shouldn't?) · automated caller (cron, bot, service account) |
| **Operational** | First deploy (no prior config/data) · rolling deploy (old + new code running together) · rollback (old code against new-format state) · missing/stale config · 10× traffic · partial write failure |

For browser UI, also enumerate relevant route/action × UI state combinations: direct navigation/refresh/back-forward; loading/empty/success/error/denied; slow/offline network and stale response; repeated form action; narrow viewport/zoom/long text; keyboard/touch input; and SSR/hydration versus client-only rendering. Do not mechanically test every combination—split them where the resulting behavior differs.

For each materially distinct reachable scenario class: trace the path to its terminal state and check whether the outcome is correct, safe, and recoverable. A scenario handled silently and incorrectly is a finding even if untested.

## Review Sequence

### Codebase Review

1. Map scope.
   Identify the boundaries being reviewed (full project, a module, a service, or a browser app). List entry points: HTTP handlers, CLI commands, queue consumers, scheduled jobs, SDK surfaces, browser routes/pages, forms, interactive components, and server/client rendering boundaries. If the user says only `codebase`, use repository-owned application code plus relevant tests and configuration as the default scope; normally exclude generated, vendored, build, and dependency files unless they are directly relevant. State the scope and material exclusions in the report, and do not claim complete coverage if only a subset could be inspected.
2. Enumerate scenarios (mandatory).
   For each entry point, identify materially distinct reachable scenario classes across input, state, actor, and operational variants. Use the four categories in [Scenario Enumeration](#scenario-enumeration); do not mechanically enumerate their full Cartesian product. Separate combinations when their interaction changes the path or outcome. An unexamined material scenario that causes a bug is a missed finding.
3. Trace critical paths.
   From each entry point, follow inputs, validation, domain logic, persistence, side effects, rendering, and outputs. For browser flows, trace user action → state transition → request/response → rendered result, including pending/error/recovery paths, duplicate actions, stale responses, navigation/unmount, and cleanup. Cover success paths, failure paths, partial failures, and local execution after calls to external dependencies return. When a call fails or throws, continue through catch, retry, fallback, compensation, and cleanup/finally handling instead of stopping at the exception. Verify whether a target is local or external from the available code and contracts rather than guessing from its name; an unresolved target should be marked as such. Treat an external boundary as a limit on tracing into the external callee, not as a reason to stop tracing the local caller's subsequent behavior. For asynchronous work, trace the producer to its acknowledgment/cutoff point, then document consumers as separate paths when they are in scope.
4. Evaluate all 14 dimensions across the entire scope and check existing-design fit.
   All dimensions are potentially relevant. Apply the [Simplicity, Reuse, and Platform Fit](#simplicity-reuse-and-platform-fit) gate to in-scope custom mechanisms where relevant, without inventing product requirements. UI and Accessibility apply to browser-facing UI; mark them N/A only when the declared codebase scope has no such surface. Mark other dimensions N/A only where the codebase has no surface for that concern.
5. Check safeguards.
   Run relevant tests and static checks when safe and feasible. Inspect project-defined commands before running them; do not trigger production access, external messages, destructive data changes, or other consequential side effects without authorization. Also verify alerting, rollback readiness, permissions, and operational coverage across the critical paths inspected. Record exact commands/results or why checks were not run.
6. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius. Note confidence limits for subsystems not deeply inspected.

### Code Change Review

1. Establish intent and resolve the diff source.
   Read the diff source first, then any associated issue/PR description and acceptance criteria when available. Translate criteria into observable behavior and trace them to implementation and tests. If criteria are unavailable, state inferred intent and assumptions rather than inventing requirements.
   For a branch pair, treat the first ref as `base` and the second as `head`; default to the PR-style diff `git diff <base>...<head>`, which compares the merge base of the refs to `head` (equivalent to `git diff $(git merge-base <base> <head>) <head>`). Do not substitute `git diff <base>..<head>` or `git diff <base> <head>` by default: those compare the two tip snapshots and can include changes on the base branch that are not part of the feature branch. Use tip-to-tip comparison only when explicitly requested.
   Verify that both refs resolve, record their resolved commit SHAs and the merge-base SHA, and do not silently fall back to the current branch. Read source files from the `head` tree; if the checkout differs, read the ref's content (for example, `git show <head>:<path>`) or first verify the checkout matches the resolved head SHA. The branch comparison excludes staged, unstaged, and untracked working-tree changes by default; include those only when explicitly requested and report them as a separate source. Do not switch branches just to perform the comparison. If base/head roles are ambiguous, a ref is unavailable, or no common ancestor exists, ask for the minimum clarification needed. For a PR, use its actual target/base and source/head refs.
2. Enumerate scenarios (mandatory).
   For each changed entry point or function, identify materially distinct reachable scenario classes across input, state, actor, and operational variants. Use the four categories in [Scenario Enumeration](#scenario-enumeration); do not mechanically enumerate the full Cartesian product. Do not limit the scenario set to what the author tested or described.
3. Trace execution paths of the changed code.
   Follow the changed behavior through each enumerated scenario: success paths, failure paths, and partial failures. For frontend changes, trace the user interaction through component/event handlers, state and data layers, network boundaries, rendering, and user-visible feedback; include loading/error/retry states, async races, focus/navigation effects, and server/client hydration boundaries where relevant. When a call fails or throws, continue through catch, retry, fallback, compensation, and cleanup/finally handling instead of stopping at the exception. Verify whether a target is local or external from the available code and contracts rather than guessing from its name; an unresolved target should be marked as such. Trace local caller behavior after an external call returns; stop at the external boundary only for tracing into the external callee. Treat asynchronous consumers as separate paths when they are in scope. Read every changed human-authored line in its containing function/class and relevant surrounding context; skip generated/vendor material only after identifying it and confirming it is not material. For a large repetitive diff, sample only after confirming the changes are mechanical and equivalent, and disclose material areas not inspected.
4. Check necessity, reuse/platform fit, and impact logic (mandatory).
   Apply the [Simplicity, Reuse, and Platform Fit](#simplicity-reuse-and-platform-fit) gate to each new or substantially changed feature, component, helper, dependency, abstraction, or configuration. Then, for each changed function, method, type, schema, event, or config key: use grep, LSP, or file reads to find call sites and dependents within the reviewed repository/revision. For each one, verify its logic still holds under the new behavior:
   - Return value assumptions: shape, range, or nullability that the caller expects.
   - Side effect assumptions: writes, events, or cache updates the caller relies on.
   - Error condition assumptions: error types or handling paths the caller expects.
   - Data shape assumptions: fields the caller accesses, iterates, or indexes into.
   For each changed function/method/class, compare its name, documentation, and public contract with its actual responsibility. Check whether the unit has one coherent purpose or mixes unrelated reasons to change, and whether it has hidden side effects that make reuse, tests, or safe modification harder. Do not apply “single responsibility” mechanically or use line count alone; require a concrete risk to readability, testing, change safety, or correctness.
   Do not rely on the diff alone. A change silently breaks caller logic when assumptions no longer hold even though no compile error appears. For simplifications, verify necessary validation, error handling, security, and frontend accessibility controls remain effective; do not accept reduced safeguards merely because the new code is shorter.
5. Evaluate all 14 dimensions for the changed surface.
   Load only the references that apply. For browser UI changes, always assess UI and Accessibility; for backend-only changes, mark both N/A. Mark other dimensions N/A only after checking whether the diff materially touches them.
6. Check safeguards.
   Run relevant tests and static checks when safe and feasible; inspect project-defined commands before running them and do not trigger production access, external messages, destructive data changes, or other consequential side effects without authorization. Verify logging, retries, rollbacks, rollout guards, and migration safety for the changed paths. When public behavior, APIs/events, configuration, setup/build/test, or operational procedures change, check related documentation and examples; report omissions only when they create concrete user, developer, or operator risk. Record exact commands/results or why checks were not run.
7. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius.

## Evidence Standard

A review finding should answer five questions:

1. What exact condition triggers the issue?
2. Where in the code or diff does that condition appear?
3. What incorrect behavior, security exposure, or operational failure follows?
4. Who or what is affected?
5. What change would reduce the risk?

Before saving the report, verify every cited path exists in the reviewed revision and every line/range points to the relevant code. For changed code, use coordinates that identify the actual source in the reviewed revision; do not confuse patch hunk offsets with current file lines. For a branch comparison, line citations should map to the `head` tree where the code exists; for deleted code, identify the base/diff side explicitly. If the target revision is unavailable, cite coordinates from the supplied patch and state that basis in the Summary rather than presenting current-checkout lines as if they matched. Cite the service, controller, or other source that owns the behavior being described. Never fabricate test execution, caller coverage, or external vulnerability/license checks. In `git-diff` mode, tie each finding to a regression or risk introduced/materially worsened by the change; in `codebase` mode, findings may describe any material defect within scope. Avoid findings that rely on vague phrases such as "might be bad" or "could be cleaner" without a concrete failure mode. If behavior remains unclear after inspecting the relevant code, callers, and contracts—or a high-risk area cannot be assessed confidently because context or domain expertise is missing—state the specific limit and request clarification or an appropriate specialist check rather than guessing.

## Reporting Format

The authoritative output format is defined in `SKILL.md` — Review Output Contract. It has three parts:

1. **Checklist table** — one fixed row per dimension (CORR, SEC, PERF, ARCH, DB, API, UI, A11Y, TEST, MAINT, OBS, CONC, INFRA, COMPAT), showing the worst severity found in that dimension.
2. **Findings** — one bullet per finding, ordered by severity descending. A code location may appear multiple times across different dimensions. Each finding includes: dimension code, severity, description, Path, Why, and Fix. See `SKILL.md` for the exact bullet format.
3. **Summary** — reviewed scope/revision, open questions, major risk areas, checks actually run, testing gaps, and residual risks.

If there are no findings, all table rows show ✅ Đạt or — N/A and the summary confirms coverage. For each N/A status, briefly explain the reason in the Summary when it is not obvious from the stated scope.

## Large Scope and Diff Strategy

When the codebase/module scope or diff is large:

1. Identify high-risk entry points first: auth, data writes, schema changes, queues, caches, money paths, destructive operations, and external contracts.
2. Sample repeated mechanical changes only after confirming they are actually mechanical.
3. Prefer reviewing invariants and interfaces over reading every line equally.
4. For a large codebase, prioritize critical paths and explicitly list important areas not inspected; do not describe a partial review as complete.
5. Call out confidence limits when parts of the system were not inspected deeply enough.

## When To Mark N/A

- **Codebase Review**: mark N/A when the codebase has no meaningful surface for that concern (e.g., no database layer → Database is N/A; no async processing → Concurrency is N/A; no browser-facing UI → UI and Accessibility are N/A).
- **Code Change Review**: mark N/A when the change does not touch that concern in any meaningful way (e.g., no schema change → Database may be N/A; no interface change → API may be N/A; backend-only change → UI and Accessibility are N/A). For any changed browser UI, assess UI and Accessibility even if no issue is ultimately found.

Do not mark an area N/A simply because no bug was found there.

## External Guidance

These sources informed the review workflow. Apply them contextually; the skill's scope, evidence rules, and project-specific standards take precedence.

- [Google Engineering Practices — What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html): assess design, functionality, complexity at line/function/class level, tests, naming, comments, documentation, and surrounding/system context.
- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html): improve overall code health without demanding perfection; use technical facts over personal preferences.
- [Google Engineering Practices — How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html): focus comments on the code, explain why, and make mandatory versus optional intent clear.
- [GitLab Code Review Guidelines](https://docs.gitlab.com/development/code_review/): consider quality, maintainability, security, reliability, scalability, documentation, observability, and domain expertise in context.
- [Git `git-diff` documentation](https://git-scm.com/docs/git-diff): `A...B` compares the merge base of `A` and `B` to `B`; `A..B` compares the two endpoint trees.
- [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/): success criteria and techniques for evaluating web accessibility; apply the project's target and do not claim conformance from a source-only review.
- [OWASP — Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html): safe output handling, dangerous contexts, HTML sanitization, and DOM sinks.
- [web.dev — Web Vitals](https://web.dev/articles/vitals): LCP, INP, and CLS definitions/thresholds; field data and lab diagnostics have different limits.
- [Playwright — Best Practices](https://playwright.dev/docs/best-practices): resilient E2E tests based on user-facing locators and observable behavior.
