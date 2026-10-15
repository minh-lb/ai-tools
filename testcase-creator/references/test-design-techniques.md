# Test Design Techniques and Coverage Rationale

No finite checklist can enumerate every possible input, state, actor, sequence, timing, failure, and deployment condition. Build a defensible, traceable set from the feature model; record assumptions and excluded combinations. Do not claim exhaustive coverage unless a precisely bounded model was enumerated.

## Model before selecting cases

Model the user goal, entry point, actor/permissions, starting and ending state, supported inputs, key transitions, observable outcomes, dependencies, and criticality from the approved test basis. Derive named test conditions (testable aspects) and select only those that can be meaningfully exercised end to end. Each deterministic E2E case has preconditions, input/test data, reproducible user actions, an approved observable oracle, and a postcondition when state changes; map it to its source/test condition. If exploration is needed, create a separate charter linked to a risk/incident, not a deterministic testcase; any finding that needs verification becomes a deterministic E2E case with an approved oracle. Keep cleanup and execution results distinct from case design.

## Choose techniques by structure

- **Equivalence partitioning:** identify valid and invalid classes that should behave alike; select representative values from each class. Split classes when behavior differs (e.g. absent vs null vs empty vs whitespace, or locked vs deleted account).
- **Boundary-value analysis:** test each numeric/string/date/count boundary at min−1, min, min+1, max−1, max, max+1 where meaningful; include zero, empty collection, one item, and limit+1. Respect type overflow, inclusive/exclusive rules, timezone, leap years, and precision.
- **Decision tables:** enumerate combinations of independent business conditions and expected actions (discount, permissions, eligibility, validation). Collapse only columns with demonstrably identical behavior; add missing/conflicting-condition cases.
- **State-transition testing:** cover applicable valid transitions, invalid transitions, guards, terminal states, repeats, retries, cancellation, and recovery through the user journey. Verify persisted state by product read-back when possible; use a scoped read-only backend assertion only when an important approved outcome is otherwise invisible. Use transition-pair/path coverage for high-risk workflows.
- **Combinatorial testing:** use pairwise or higher-strength covering arrays for large, lower-risk factor sets. Do not substitute pairwise for known three-way interactions or high-risk combinations (role × tenant × resource ownership, payment × retry × timeout). State the strength, factors, and excluded combinations.
- **Use-case / end-to-end flows:** cover primary, alternate, error, and recovery paths from user goal through observable downstream effects.
- **Error guessing / exploratory testing:** derive probes from prior incidents, architecture, changes, unusual but valid values, stale data, interrupted actions, and human behavior. Capture exploration as a separate charter: objective, scope, observation focus, timebox, safety, and risk/incident trace. Record observations and follow-up E2E cases separately; never label the charter passed/failed or count it as verification of a requirement.
- **Risk-based prioritization:** assess likelihood and impact (including security/privacy, financial/data integrity, availability, detectability, blast radius, reversibility, and exposure), then prioritize with the project's established method. If none exists, use a concise qualitative rationale rather than inventing a numeric score. Ensure material high-impact risks have explicit cases or a documented reason for exclusion; explain residual risk and accepted gaps.

## Coverage and stopping rule

- List every in-scope approved acceptance criterion and materially distinct expected behavior before drafting. Map each to one or more deterministic E2E case IDs; include applicable valid/invalid partitions, boundaries, roles, state transitions, error, and recovery paths.
- If a criterion cannot be tested end to end, mark the reason and owner as a documented gap/exclusion; never silently drop it or invent an oracle. Do not call the suite complete while an in-scope criterion is unmapped.
- Avoid test-case explosion with representative partitions and justified combinations, but keep behaviors with different oracles separate. Exploratory charters do not count as requirement coverage.
- No percentage is needed. If one is requested, state the exact denominator and method; it describes only those items, not all possible product behavior. Reassess when specs, implementation, architecture, incidents, dependencies, or risks change.
