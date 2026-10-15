# Inline Output and Exact Scope

## Distinguish requests

| Request | Required output |
|---|---|
| "Print the Acceptance Criteria" | Only the Acceptance Criteria section |
| "JSON only" | Valid raw JSON; no prose or Markdown fence |
| "Print the complete Specification" | The entire requested Specification; do not replace it with a summary |
| "Summarize the Plan in 5 lines" | Exactly the requested summary; do not print the full Plan |
| "Review; findings only" | Findings + location + impact + proposed fix; do not rewrite |
| "Review and fix over multiple rounds until clean" | Fix in-scope findings requiring action, run appropriate checks, review the entire scope again until none remain under the requested quality bar; report blockers/limitations instead of overstating cleanliness |
| "Write a Specification and Plan" | Both deliverables, in the order Specification → Plan |
| "Fix the validation message" (small change, no document requested) | Code change + verification result; **do not create a Plan file automatically** |

## Do not

- Add "Here you go" or "I prepared this" when the user requested output only.
- Add an `Open Questions` section or explanation when the user requested a specific section and unknowns do not belong there (except for a required disclosure).
- Put JSON in a code fence when the output contract is raw JSON only.
- Reformat for appearance if doing so loses extracted fields, rules, errors, or requested ordering.

## Preserve vs. transform

- **Verbatim extraction:** preserve exact wording, symbols, numbers, IDs, and source order; do not paraphrase.
- **Restructure/normalize:** presentation may change while preserving meaning.
- **Summarize:** condense as requested; do not claim it is complete.
- **Proofread:** fix language without deciding missing rules.

Examples: [only section](../../examples/output/only-acceptance-criteria.en.md), [JSON only](../../examples/output/json-only.en.md), [full vs. summary](../../examples/output/full-vs-summary.en.md).
