# Estimating Task Effort

Use only when the user requests an estimate. This guide is a reasoning aid, not a universal scale or promise.

## Basis

Estimate from the known outcome and scope, calibrated to the team's own completed work where available. Consider:

- Discovery and uncertainty, including unresolved requirements or dependencies.
- Implementation, migration, integration, and coordination work.
- Review effort, including affected contracts and risk.
- Verification, including relevant tests, manual checks, rollout and recovery evidence.
- Work that can be done independently versus blocked work and critical-path dependencies.

Do not infer effort from file count, class count, or a generic complexity label. Similar-looking changes may differ substantially in test setup, compatibility, data volume, review, or operational risk.

## Communicating uncertainty

- Use the target team's preferred unit and estimate format. If none exists, prefer a range over false precision.
- State the assumptions that materially shape the estimate and what evidence could change it.
- Separate implementation, review, and verification only when that breakdown is useful; do not imply that AI-generated code has predictable elapsed time.
- If scope is too unclear for a meaningful estimate, say so and identify the smallest discovery step needed. Ask only if the user wants that discovery included in the task.
- Suggest splitting work when independently deliverable outcomes, ownership, dependencies, or review boundaries make one task difficult to plan—not because it crossed a generic size threshold.
