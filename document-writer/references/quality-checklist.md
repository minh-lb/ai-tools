# Quality Checklist

Apply proportionately and silently before delivering the answer or document.

| Check | Pass condition |
|---|---|
| Relevant | Every paragraph serves the user's question, decision, action, or verification |
| Understandable | A non-developer can explain the main point without decoding unexplained jargon |
| Concise | No filler, restatement, duplicated facts, or unneeded implementation detail |
| Accurate | No invented facts; essential conditions, exceptions, and technical identifiers remain intact |
| Evidence | Claims of implementation, inspection, tests, performance, or status are supported and scoped |
| Reviewable | The result, impact, decision, risk, and next action are easy to locate when relevant |
| Contract-compliant | Requested language, exact schema, structure, completeness, and no-extra-text constraints are respected |

## Severity

- **Blocker:** Wrong or missing answer; material fact/condition/risk omitted; invented claim; malformed required output; meaning changed.
- **Major:** Reader cannot identify what matters, what to do, or why the result follows; excessive jargon or noise hides key information.
- **Minor:** Cosmetic layout or a small wording improvement that does not affect meaning.

Fix blockers and majors before delivery. Avoid stylistic churn when the text already meets the reader's purpose.

## Practical self-review

1. Read just the opening: does it answer the request?
2. Remove anything that would not change understanding or decisions.
3. Translate unnecessary technical wording; define necessary terms once.
4. Confirm evidence and caveats still support every important claim.
5. Check exact output restrictions and requested scope.

**Boundary:** This is a communication-quality check, not a substitute for the reviewer, testing, task-creator, or implementation skill. For review-only requests, report findings; do not silently rewrite source files. A static checklist does not prove a model will behave correctly; use [scenario evaluation](../eval/scenarios.md) to test behavior.
