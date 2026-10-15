# Specification Review Checklist

- [ ] Are the objective and out-of-scope boundaries clear without drifting into implementation design?
- [ ] Are actors, triggers, inputs, permissions, and preconditions clear?
- [ ] Do FR/BR IDs remain stable, with one testable idea per requirement?
- [ ] Are there contradictions among states, flows, and decision tables?
- [ ] Are alternatives, validation, authorization, invalid states, concurrency/retries considered in proportion to risk?
- [ ] Are responses, error codes, field names, and side effects consistent with the contract?
- [ ] Are applicable NFRs evidence-based and measurable/testable?
- [ ] Does every important requirement have acceptance criteria or an explicit exception?
- [ ] Can a qualified reader who did not author the Specification identify the required behavior, determine acceptance, and verify the outcome without guessing?
- [ ] Do as-is facts have evidence? Are to-be rules stated as requirements, not implementation claims?
- [ ] Does the document avoid silently choosing implementation technology unless it is a constraint?
- [ ] Are there any `TBD` items presented as approved conditions?

**Finding format:** `Severity — Location/ID — Evidence — Impact — Proposed correction`. Do not rewrite when only a review was requested.
