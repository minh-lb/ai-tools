# Test Design Techniques and Coverage Rationale

No finite checklist can enumerate every possible input, state, actor, sequence, timing, failure, and deployment condition. Build a defensible, traceable set from the feature model; record assumptions and excluded combinations. Do not claim exhaustive coverage unless a precisely bounded model was enumerated.

## Model before selecting cases

Model goals, entry points, roles, start and end states, inputs, transitions, outcomes, dependencies, and criticality from approved sources. Derive named test conditions and assign each to a test layer that can observe its outcome. For E2E documentation, focus on user journeys and link lower-level cases where relevant. Each case needs preconditions, data, reproducible actions, an approved observable oracle, and a postcondition where state changes. Exploratory observations provide risk input only; unresolved expected behavior remains `pending-spec`.

## Choose techniques by structure

- **Equivalence partitioning:** identify valid and invalid classes that should behave alike; select representative values from each class. Split classes when behavior differs (e.g. absent vs null vs empty vs whitespace, or locked vs deleted account).
- **Boundary-value analysis:** choose the boundary and its nearest representable values on the relevant sides. Use the business unit or precision, such as one day or 0.01, where appropriate. Check inclusive and exclusive limits and only add extremes such as zero or overflow when they represent a distinct condition or risk.
- **Decision tables:** map feasible combinations of business conditions to approved outcomes. Eliminate impossible combinations, collapse conditions that cannot change the outcome, and cover materially different rules. Flag gaps or contradictions in the expected behavior.
- **State-transition testing:** cover applicable valid transitions, invalid transitions, guards, terminal states, repeats, retries, cancellation, and recovery through the user journey. Verify persisted state by product read-back when possible; use a scoped read-only backend assertion only when an important approved outcome is otherwise invisible. Use transition-pair/path coverage for high-risk workflows.
- **Combinatorial testing:** use pairwise or higher-strength covering arrays for large, lower-risk factor sets. Do not substitute pairwise for known three-way interactions or high-risk combinations (role × tenant × resource ownership, payment × retry × timeout). State the strength, factors, and excluded combinations.
- **Use-case / end-to-end flows:** cover primary, alternate, error, and recovery paths from user goal through observable downstream effects.
- **Error guessing:** propose cases from past incidents, unusual data, stale state, interrupted actions and user mistakes. Make each a deterministic case only with an approved oracle; otherwise record the missing owner/source as `pending-spec`. Do not author exploratory charters or test execution notes.
- **Risk-based prioritization:** assess likelihood and impact (including security/privacy, financial/data integrity, availability, detectability, blast radius, reversibility, and exposure), then prioritize with the project's established method. If none exists, use a concise qualitative rationale rather than inventing a numeric score. Ensure material high-impact risks have explicit cases or a documented reason for exclusion; explain residual risk and accepted gaps.

## Coverage and stopping rule

- List every in-scope approved acceptance criterion and materially distinct expected behavior before drafting. Map each to an existing or new check. For E2E documentation, map each criterion to a case ID or identify the appropriate lower-level suite and any remaining gap.
- Document the reason and owner for criteria that cannot be tested in the requested scope. Do not call the suite complete while an in-scope criterion is unmapped.
- Avoid test-case explosion with representative partitions and justified combinations, but keep behaviors with different oracles separate. Exploratory charters do not count as requirement coverage.
- No percentage is needed. If one is requested, state the exact denominator and method; it describes only those items, not all possible product behavior. Reassess when specs, implementation, architecture, incidents, dependencies, or risks change.

For the underlying techniques and traceability model, see the [ISTQB Foundation syllabus](https://www.istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf), sections 1.4.4 and 4.2.
