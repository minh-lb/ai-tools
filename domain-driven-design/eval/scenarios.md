# Behavior Evaluation Scenarios (not executed)

Use these prompts in a fresh agent session with this skill available and a disposable Laravel test repository. Observe generated design, code, tests, and final claims; do not score from the instructions alone. This is a rubric, not evidence of a completed benchmark.

## Scenario A — Ordinary CRUD in a non-DDD Laravel repository

**Prompt:** “Add a simple read-only list of public categories in our existing conventional Laravel app. Do not change architecture.”

**Pass:** Follows existing conventions; does not add Modules/Domain, aggregates, custom DTO validation, response envelopes, or events without need.

## Scenario B — Aggregate invariant

**Prompt:** “In a DDD rental module, an invoice is Draft until issued. Issue only when at least one line exists and total is non-negative; reject issuing twice. Implement issue invoice and tests.”

**Pass:** Identifies Invoice as invariant owner, enforces transitions in domain behavior rather than controller/ORM callback, tests legal and rejected transitions and unchanged state on failure. Does not invent unspecified pricing policies.

## Scenario C — Tenant isolation

**Prompt:** “Add update room rent to a multi-organization Laravel DDD SaaS. A manager for Organization A must not fetch or change rooms belonging to Organization B, even with a known room ID.”

**Pass:** Uses trusted organization scope; enforces on reads, updates and associations, plus authorization; tests negative access and no B-state change. No unscoped repository `findOrFail`/`updateOrCreate` default.

## Scenario D — Concurrent updates

**Prompt:** “Two managers can update the same aggregate concurrently. Prevent silent lost updates and return a conflict result in an existing Laravel DDD service.”

**Pass:** Defines conflict semantics and appropriate DB concurrency control (e.g. expected-version conditional update), adds meaningful concurrency/integration evidence, no 'last write wins' unexamined.

## Scenario E — Durable events and retries

**Prompt:** “When a deposit refund is confirmed, publish an event for another bounded context. SQS may redeliver; processing can fail midway. Prevent duplicate refunds and lost events.”

**Pass:** Separates domain from versioned integration event, explains durable commit/publication and provider/consumer idempotency, covers failure then retry and duplicates. No permanently premarked success or unsupported exactly-once claim.

## Scenario F — Cross-context boundaries

**Prompt:** “Billing must react to a ContractActivated fact from Contract Management. Existing modules use different Contract terminology.”

**Pass:** Uses an approved published contract and translation at the receiving boundary; does not import the producer's private aggregate, repository, or Domain event class.

## Scoring

- For each scenario record **Pass / Fail / Not verified** with file paths, diff, commands and observed test output.
- Block readiness for any real tenant data leak, business invariant bypass, undetected lost update, irreversible retry suppression, or fabricated test result.
- Also check that optional layers/files are omitted, existing repository conventions are preserved, and communication is concise.
- Report static skill review separately from actual scenario execution and token measurement; never invent benchmark scores.

Suggested local flow: run `plugin-eval analyze <skill-path> --format markdown`, then `plugin-eval init-benchmark <skill-path>` and tailor the resulting benchmark to these scenarios before any measured run.
