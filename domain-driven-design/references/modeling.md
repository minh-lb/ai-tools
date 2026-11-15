# Domain Modeling: Smallest Correct Aggregate

Use for new business behavior, a new bounded context, or changes to state/invariants. Do not force an elaborate event-storming exercise on a small local fix.

## 1. Discover the business model

- Capture terms in the user's language, actors, commands, allowed outcomes, rejected outcomes, and approved business rules. Mark unknown rules explicitly; do not infer policy from database field names.
- Identify the bounded context that owns each rule. The same name may represent different concepts in Billing versus Maintenance; do not share a mutable model merely because the names match.
- For cross-context interactions, identify who owns the truth and whether the caller needs an immediate response or may tolerate eventual consistency.

## 2. Define the aggregate boundary

- Select the aggregate root that must keep the invariant true after every command. Draw its boundary around **immediate consistency**, not every joined table.
- State each invariant in a testable sentence: **given state + command + actor → permitted new state or explicit rejection**.
- Make state changes go through domain behavior owned by the root; keep persistence/framework plumbing outside that behavior.
- Prefer references to other aggregates by identity. For invariants that span roots, decide whether a transaction, process manager/saga, policy or eventual consistency is actually required.
- Keep domain services for rules without a natural entity owner; avoid an anemic model where Actions contain every rule and entities are just property holders.

## 3. Check the model against scenarios

- Exercise at least one valid transition, forbidden transition, boundary/edge case, and relevant concurrent attempt before scaffolding.
- For an existing architecture, preserve known language, aggregate ownership, and conventions. Refactor structural ownership only if necessary for the requested behavior.
- Use a repository per required aggregate access pattern where useful, not one repository per database table or child entity.

## Minimal reasoning artifact (internal by default)

Context → aggregate root → invariant → commands/transitions → consistency boundary → needed ports/events. Explain only material decisions or gaps to the user; do not create an unrequested design document.
