# Behavior evaluation rubric

Use a fresh session with standard skill discovery for each prompt in [cases.md](cases.md). For the baseline, omit the candidate. For the candidate, expose its name, description and folder without requiring invocation. Leave other capabilities constant when comparing. For H, also expose the repository's `reviewer` and `document-rule` skills. A manual metadata-selection simulation tests routing judgment only. Read traces when available to confirm which instructions actually loaded. Keep the evaluator's rubric out of the tested session.

Score each row Pass, Fail or Unverified using observable evidence from the response and trace.

| Case | Required observations |
| --- | --- |
| A | Starts with technical document sections and continues to architecture in the same response as requested. Retains app/database and testable supervisor permission. Enforces all-time uniqueness at the DB write boundary and handles a concurrent collision. Fits the scale and distinguishes tabletop checks from execution. |
| B | Finds cross-tenant authorization and cache leakage plus same-tenant association risk. Uses a verified active organization and tenant scope through reads, writes, cache and relationships. Shows a scenario for each material defect and withholds readiness on the submitted design. |
| C | Finds double-capture risk after an ambiguous timeout and lost webhook update on crash after marking. Uses a durable logical capture identity and reconciliation, couples local deduplication with durable effect, and addresses concurrent capture and delivery. Withholds readiness on the submitted design and labels runtime evidence unavailable. |
| D | Finds the commit/publish gap and explains durable publication, duplicate handling and release/cancellation ordering with explicit state or version semantics. Stays within the existing topology and exercises crash, duplicate and reordering interleavings. |
| E | Finds version skew. Uses a backward-compatible expand, backfill, switch and contract sequence with a data-correct coexistence and rollback strategy. Gates removal on observed cutover criteria and identifies the affected worker. |
| F | Explains the conflict with a partition example. Asks only decision-changing questions, offers conditional alternatives and withholds readiness. Records unknowns without turning them into requirements. |
| G | Keeps the work to the label and focused UI checks. Architecture skill stays unloaded in the trace where discovery is available. |
| H | Applies the architecture, embedded reviewer and writing scopes. Shows a two-request stock counterexample and a practical fix, withholds readiness for the submitted design, and returns the result in chat without writing or publishing. |
| I | Produces technical document sections tied to the approved return rules and existing integrations. Includes the receive-before-refund and refund-once constraints. Stops at the outline and leaves concrete endpoints, schemas, and technology choices for follow-up. |
| J | Loads the skill and starts with a technical outline that derives its sections from the approved authorization rules. Addresses isolation and timely revocation as design questions. Keeps confirmed role and scope choices fixed and leaves detailed design for follow-up. |
| K | Expands only the requested enforcement and verification sections. Grounds design and scenarios in same-organization authority, active membership, and next-check revocation. Refers briefly to adjacent sections where needed. |

For material findings, require evidence or a concrete counterexample, impact and remediation. Treat any invented requirement, executed check or approval as a failure. A proposal may resolve a finding on paper only after it is reviewed and the available validation supports closure. Keep static checks, tabletop validation, and executed/runtime evidence distinct.

Record per-case observations, verification methods, model, discovery method and unresolved gaps. After changing the skill, rerun affected cases and any routing or readiness case affected by the edit. Stop once the criteria pass or an external blocker is documented.
