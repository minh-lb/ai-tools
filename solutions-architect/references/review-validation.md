# Architecture review and validation reference

## Review the actual design

Identify the design revision or supplied assumptions and affected contracts. When a genuine separate review is authorized, give the reviewer the requirements, candidate and scope before sharing the designer's conclusions. Otherwise perform a distinct counterexample pass and call it a self-review.

For each supported finding, give an ID, severity, affected requirement or boundary, source or reproducible interleaving, impact and a practical remedy. Keep open questions and proof gaps visible and separate from demonstrated defects. Use the highest severity supported by impact and reachability, and explain any material uncertainty.

| Severity | Typical consequence |
| --- | --- |
| Critical | Plausible major irreversible loss, broad exposure of sensitive data, or failure of a mission-critical invariant with severe impact |
| High | Plausible material invariant breach, unauthorized access, persistent inconsistency, or failure of a core requirement |
| Medium | Bounded defect or material operational burden with practical recovery or workaround |
| Low | Localized issue with limited consequences |

For delta review, trace upstream and downstream readers, writers and owners. Recheck previously closed findings if their assumptions or proof changed. Stop once new iterations provide no meaningful improvement without a decision or new evidence.

## Threat model for changed boundaries

Map the relevant actors, identities, sensitive assets, data flows, and trust boundaries. Identify credible misuse or failure at those boundaries. Prioritize it by impact and reachability, name the control and the boundary that enforces it, and specify how to verify that control. Record residual exposure and revisit the model when a sensitive flow or boundary changes. [OWASP Threat Modeling](https://devguide.owasp.org/en/04-design/01-threat-modeling/07-practical-threat-modeling/)

## Choose evidence that can settle the claim

| Method | What to report |
| --- | --- |
| Tabletop walkthrough | Design revision, ordered actions, expected invariant and what follows from the specified semantics |
| Executed PoC or architecture test | Scope, environment, actual test or command, observed result and any limitations |
| Planned or blocked check | Expected result, required environment or evidence and the decision it gates |

For each significant rule, inspect at least the successful path and a relevant rejected, failed or concurrent path. Use the time between a side effect and its acknowledgment, stale or duplicate reads, authorization changes, and old/new version coexistence to find realistic counterexamples. Make interleavings specific enough to predict final state, duplicate effects and recovery. Scale the scenarios to the actual risks.

Reserve execution for evidence it can establish, such as an external contract, lock behavior, throughput or compatibility. Record such checks as planned or blocked when no authorized environment is available. Missing evidence blocks the stage that depends on it. For example, an unverified provider capability that determines the design may block implementation, while a load test that requires the implemented system may gate production rollout. A tabletop result can close a design-level finding when the revised design specifies and supports the necessary guarantee. Runtime claims require runtime evidence.

A risk acceptance record identifies who accepted the specific exposure, the accepted impact and scope, and any agreed guardrails or expiry. Record this only from explicit evidence. Carry forward material unverified requirements and unresolved decisions.
