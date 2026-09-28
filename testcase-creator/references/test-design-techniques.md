# Test Design Techniques and Coverage Rationale

No finite checklist can enumerate every possible input, state, actor, sequence, timing, failure, and deployment condition. Build a defensible, traceable set from the feature model; record assumptions and excluded combinations. Do not claim exhaustive coverage unless a precisely bounded model was enumerated.

## Model before selecting cases

List entry points and operations, inputs/domains/constraints, user roles and ownership, state machine and transitions, outputs, side effects, external dependencies, timing/concurrency, configuration/feature flags, and criticality. Draw a data-flow or sequence diagram for multi-service paths and a state-transition table/diagram for lifecycle features. Map each requirement/risk to one or more case IDs and each case back to a source or explicitly marked exploratory risk.

## Choose techniques by structure

- **Equivalence partitioning:** identify valid and invalid classes that should behave alike; select representative values from each class. Split classes when behavior differs (e.g. absent vs null vs empty vs whitespace, or locked vs deleted account).
- **Boundary-value analysis:** test each numeric/string/date/count boundary at min−1, min, min+1, max−1, max, max+1 where meaningful; include zero, empty collection, one item, and limit+1. Respect type overflow, inclusive/exclusive rules, timezone, leap years, and precision.
- **Decision tables:** enumerate combinations of independent business conditions and expected actions (discount, permissions, eligibility, validation). Collapse only columns with demonstrably identical behavior; add missing/conflicting-condition cases.
- **State-transition testing:** cover each valid transition, invalid transition, guard, terminal state, repeated event, retry, cancellation, and recovery; verify both visible result and persisted state. Use transition-pair/path coverage for high-risk workflows.
- **Combinatorial testing:** use pairwise or higher-strength covering arrays for large, lower-risk factor sets. Do not substitute pairwise for known three-way interactions or high-risk combinations (role × tenant × resource ownership, payment × retry × timeout). State the strength, factors, and excluded combinations.
- **Use-case / end-to-end flows:** cover primary, alternate, error, and recovery paths from user goal through observable downstream effects.
- **Error guessing / exploratory testing:** derive probes from prior incidents, architecture, changes, unusual but valid values, stale data, interrupted actions, and human behavior. Mark exploratory cases and capture the charter, timebox, observations, and follow-up cases.
- **Risk-based prioritization:** rate likelihood and impact (including security/privacy, financial/data integrity, availability, and detectability), then prioritize. If the project has no scale, use a documented ordinal score such as likelihood 1–3 × impact 1–3; define what each rating means for this feature rather than treating the number as objective truth. Critical/high risks get explicit cases and review; explain residual medium/low risk and accepted exclusions. Consider blast radius, reversibility, exposure, and whether monitoring can detect the failure.

## Coverage and stopping rule

Use requirement-to-case traceability and risk-to-case traceability. Report coverage status by requirement, transition, role/resource boundary, and relevant failure mechanism; do not report a single percentage without naming its denominator. Stop when agreed critical/high risks and acceptance criteria have cases, applicable model transitions/classes/boundaries are covered, and remaining gaps/exclusions have an owner or acceptance. If scope/time prevents this, label the suite partial and name the uncovered surfaces. Reassess after spec, code, architecture, incident, dependency, or risk changes.
