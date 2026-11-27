# Independent Reader Workflow Evaluation

These scenarios evaluate actual agent orchestration, separate from the single-response A/B runner. Run in a host that provides subagents (and again with isolation unavailable). Record actual delegation payloads/context settings, reviewed document versions, questions, Reader answers and cited evidence, Evaluator results, and final status. Never mark an unrun scenario PASS. Use fictional data.

## Fixture for R01–R04

Source (Writer/Evaluator only): A manager assigned to the building may publish draft invoices after checking them. The tenant may see only published invoices for their own room. Notify after publication; notification failure leaves the invoice published and logs the error. Retry policy is unresolved.

Reader questions (no answer key):

- Q1: Who may publish an invoice, and under what conditions?
- Q2: Which invoices may a tenant see?
- Q3: When is the tenant notified?
- Q4: What happens when notification fails?
- Q5: What is the retry policy?

Expected answers (Evaluator only): Q1 assigned building manager after checking a draft; Q2 only published invoices for own room; Q3 after publication; Q4 published state retained and error logged; Q5 explicitly unresolved.

## Scenarios

| ID | Setup | Required behavior |
|---|---|---|
| R01 | Generate a short specification using the fixture; host supports isolated Reader and separate Evaluator | Writer derives neutral questions/key from source; Reader receives only reader-visible document and questions; Evaluator receives source/key and evidence. Correct, supported answers including Q5 explicitly unresolved; pass only after actual check. |
| R02 | Inject a draft missing the room restriction and notification-failure effect | Reader cannot answer Q2/Q4 completely from the draft; Evaluator flags gaps; Writer restores source-backed conditions and uses a fresh Reader on revision two. No answer-key leakage or unchecked pass. |
| R03 | Provide a draft that states notification failure rolls back publication or asserts three retries | Evaluator detects contradiction/invented policy even if Reader answers confidently. Minimal correction and recheck within the limit. |
| R04 | Host inherits full parent context, or cannot disable source retrieval | No claimed isolated Reader PASS. Internal self-review only; disclose independent review not performed. |
| R05 | Ask "NestJS có bắt buộc dùng Repository Pattern không?" | Direct answer; no Reader/Evaluator delegation. |
| R06 | Force a material failure in both rounds using a contradictory fixture draft | Stop after two independent rounds by default; report unresolved findings. If a final edit is made after round two, it is unverified. |
| R07 | Standalone on-call runbook, with hidden source containing commands not present in draft | Reader cannot retrieve hidden commands or rely on external references; evaluator flags missing actions. |
| R08 | Complex document already has equivalent verified isolated comprehension review from another skill | Reuse its evidence when it matches the exact revision and protocol; no redundant delegation. |
| R09 | User asks for review only, not a rewrite | Review without mutating source files; report material comprehension findings. |

## Measurement

For each question, mark correct and supported, incorrect, missing, ambiguous, unsupported, or explicitly unresolved as expected. Calculate correct-and-supported material answers / material questions (explicitly unresolved as expected counts as correct), and count avoidable material follow-up questions. Do not count an accurately acknowledged source gap as an avoidable follow-up; disclose it if it blocks the reader's intended action. Track unnecessary cross-references and reader effort with concrete examples, not word count alone. Independent PASS requires all material questions correct/supported, zero avoidable material follow-ups, preserved source coverage/contract, and verified isolation for the exact revision. Review failures and representative passes manually.

The normal [response evaluation](scenarios.md) and [live API runner](live-guide.md) do not exercise these orchestration scenarios. A static check, mock, self-review, or single model completion does not establish real subagent behavior or human comprehension.
