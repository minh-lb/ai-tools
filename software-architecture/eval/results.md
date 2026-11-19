# Behavior evaluation results

Run on 2026-11-20 with Codex CLI 0.169.0 and `gpt-6.2-sol` at low reasoning effort. Each CLI case ran in a fresh, read-only temporary directory with the candidate under `.agents/skills/`. Prompts were supplied without an explicit architecture skill mention. For H, the directory also included the repository copies of `reviewer` and `document-rule`.

Reviewed the final responses and the JSON command trace for skill reads. Reproduce a case by placing its prompt in `case.txt` in an equivalent temporary directory and running:

```sh
codex exec --ignore-user-config --ephemeral --skip-git-repo-check -s read-only \
  -m gpt-6.2-sol -c model_reasoning_effort=low --json - < case.txt
```

| Case | Result | Observed evidence |
| --- | --- | --- |
| A · CRUD | Pass | Kept the existing app and database. Proposed server-side archive permission and table-wide tag uniqueness. Traced commit and rollback outcomes for colliding writes. Labeled design walkthrough and future integration tests. |
| B · Multi-tenant SaaS | Pass | Reported four High findings for role scope, global-ID lookup, cache collisions and cross-tenant references. Preserved global ID uniqueness and returned Changes Required. |
| C · Payments | Pass | Traced accepted-but-timed-out capture and a crash after the webhook marker. Used one durable capture identity, provider reconciliation and atomic local deduplication. Returned Changes Required and reported no runtime checks. |
| D · Distributed workflow | Pass | Found the commit/publish gap, retained deployment topology, and used a transactional outbox and atomic claim. Walked through duplicate delivery, crash recovery and cancellation ordering. Held readiness pending a decision on the cancellation cutoff and execution evidence. |
| E · Legacy refactoring | Pass | Classified immediate rename and time-only removal as High. Proposed a transactionally synchronized mixed-version migration, staged cutover and evidence-based retirement with an explicit rollback boundary. |
| F · Conflicting requirements | Pass | Used the same isolated cache state with and without revocation to prove the conflict. Gave conditional policies and held readiness pending the partition policy. |
| G · Scope exclusion | Pass | Limited scope to label, accessibility and form checks. The trace contains no read of the architecture skill. |
| H · Companion skills | Pass | Read all three skill entrypoints. Returned a High inventory race finding, an atomic reservation remedy and Changes Required in chat. The trace shows no file write or publication. |

The subagent baseline covered A–G without the candidate. It found most domain defects but did not consistently classify findings or distinguish walkthroughs from planned checks. In the first CLI round, E omitted severity. The entrypoint was tightened to require severity, evidence, impact and remedy for each supported finding, then A–G were rerun before the separate companion test.

These results apply to this model, client and set of prompts. The designs were evaluated through scenario reasoning. No application, database, broker or payment provider was run against them.

## Historical functional scope update

Reran the suite with the same CLI and model. Case A now explicitly asks for an outline and architecture in one response. Cases I–K exercise the new workflow. In the baseline for J, the previous entrypoint proceeded directly to RBAC, a relational schema, and API contracts before presenting scope choices. D and E omitted finding severity in the first rerun. The review phase was clarified to report severity explicitly, then B–E and H were rerun.

| Case | Result | Observed evidence |
| --- | --- | --- |
| A · One response | Pass | Opened with browse, create/edit and archive, then recommended the existing app and database, all-row tag uniqueness and a concurrent-write check. |
| B · Multi-tenant SaaS | Pass | Found cross-organization role, lookup, cache, and association risks. Preserved global IDs and kept the submitted design blocked. |
| C · Payments | Pass | Traced duplicate capture and premature webhook deduplication. Proposed durable operation identity, reconciliation and atomic local effects. |
| D · Distributed workflow | Pass | Reported High findings and exercised the outbox, duplicate delivery and cancellation race while keeping the existing topology. |
| E · Legacy refactoring | Pass | Reported High findings for old-worker breakage and time-only removal. Preserved mixed-version writes and gated retirement on observed compatibility and rollback evidence. |
| F · Conflicting requirements | Pass | Explained the partition counterexample, gave conditional options and retained the decision gate. |
| G · Scope exclusion | Pass | Kept the work to the button label and focused UI checks. The trace shows no architecture skill read. |
| H · Companion skills | Pass | Read all three skills and returned the stock race finding and verdict in chat. |
| I · Outline only | Pass | Proposed business groups for returns and identified optional policies, shipment, refunds, inventory and notifications. Ended at the scope decision. |
| J · Open scope | Pass | Presented proposed authorization capabilities and the role/scoping choice. Left data and API design for follow-up. |
| K · Agreed scope | Pass | Developed role assignment and revocation directly. Checked same-organization administration, active membership, and fresh authorization after revocation with an existing session. |

## Architecture outline from an existing business specification

Reran the affected cases with the same CLI and model. The previous skill's baseline for the revised J prompt organized the approved rules into business groups and reopened business scope questions. The first architecture-outline candidate still proposed concrete data and authorization choices in J. The entrypoint now reserves those choices for the expanded design, and the outline cases were rerun.

| Case | Result | Observed evidence |
| --- | --- | --- |
| A · Outline and design in one response | Pass | Opened with technical sections, then specified server-side supervisor permission and all-row tag uniqueness in the existing app. Distinguished the collision walkthrough from pending integration checks. |
| B · Submitted design review | Pass | Went directly to the review and found organization-scoping, cache, and association defects. Returned Changes Required. |
| F · Conflicting requirements | Pass | Identified the partition conflict, laid out viable policy choices, and kept the readiness decision open. |
| G · Scope exclusion | Pass | Kept the response to the UI copy and related checks. The trace shows no architecture skill read. |
| I · Returns architecture outline | Pass | Proposed ownership, data, integrations, consistency, and verification sections. Connected them to receipt-before-refund and refund-once without developing detailed contracts. |
| J · Authorization architecture outline | Pass | Presented six technical sections, including isolation and next-check revocation. Kept the one-role-per-organization rule and left data and enforcement choices for follow-up. |
| K · Selected sections | Pass | Developed enforcement and verification only, with short references to boundaries and data. Covered same-organization administration, active membership, and the first check after revocation commits. |
