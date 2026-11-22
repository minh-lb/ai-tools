# Developer Skill Evaluation Scenarios

Run each prompt in a fresh session using a disposable repository with the stated conventions. Make the skill available as it would be in normal use. For activation cases, leave skill selection automatic. Inspect changed files, checks, loaded guidance, and final claims. This file defines scenarios and pass criteria.

## Laravel DDD

### Ordinary CRUD in a mixed Laravel repository

**Setup:** An unrelated Billing module uses DDD. The Catalog module uses controllers, Eloquent, and resources under a modular directory layout.

**Prompt:** “Add a read-only list of public categories in Catalog.”

**Pass:** Follows existing conventions; does not add Modules/Domain, aggregates, custom DTO validation, response envelopes, or events without need.

### Aggregate invariant

**Prompt:** “In a DDD rental module, an invoice is Draft until issued. Issue only when at least one line exists and total is non-negative; reject issuing twice. Implement issue invoice and tests.”

**Pass:** Identifies Invoice as invariant owner, enforces transitions in domain behavior rather than controller/ORM callback, tests legal and rejected transitions and unchanged state on failure. Does not invent unspecified pricing policies.

### Tenant isolation

**Prompt:** “Add update room rent to a multi-organization Laravel DDD SaaS. A manager for Organization A must not fetch or change rooms belonging to Organization B, even with a known room ID.”

**Pass:** Uses trusted organization scope; enforces on reads, updates and associations, plus authorization; tests negative access and no B-state change. No unscoped repository `findOrFail`/`updateOrCreate` default.

### Concurrent updates

**Prompt:** “Two managers can update the same aggregate concurrently. Prevent silent lost updates and return a conflict result in an existing Laravel DDD service.”

**Pass:** Defines conflict semantics and appropriate DB concurrency control (e.g. expected-version conditional update), adds meaningful concurrency/integration evidence, no 'last write wins' unexamined.

### Durable events and retries

**Prompt:** “When a deposit refund is confirmed, publish an event for another bounded context. SQS may redeliver; processing can fail midway. Prevent duplicate refunds and lost events.”

**Pass:** Separates domain from versioned integration event, explains durable commit/publication and provider/consumer idempotency, covers failure then retry and duplicates. No permanently premarked success or unsupported exactly-once claim.

### Cross-context boundaries

**Prompt:** “Billing must react to a ContractActivated fact from Contract Management. Existing modules use different Contract terminology.”

**Pass:** Uses an approved published contract and translation at the receiving boundary; does not import the producer's private aggregate, repository, or Domain event class.

## General implementation and project skills

### Bug fix outside the bundled stacks

**Setup:** A Python repository uses the standard library and has existing unit tests.

**Prompt:** “Fix the invoice total so zero units gives a zero total. Preserve behavior for other quantities.”

**Pass:** Traces the calculation and its callers, adds a regression check in the existing runner, verifies the zero case and existing behavior, and avoids adding dependencies or unrelated framework guidance.

### Mechanical rename

**Setup:** An internal function in a Laravel DDD module has more than one caller and a project-defined verification command.

**Prompt:** “Rename the internal helper and update its callers.”

**Pass:** Updates callers, preserves behavior, runs relevant checks, and leaves unrelated files untouched. Uses the core workflow without opening DDD references for the rename.

### React with a project skill

**Setup:** Repository instructions point to a form skill with a shared feedback component, naming conventions, and test runner. The repo uses React without Server Components.

**Prompt:** “Show the supplied email error and associate it with the email field.”

**Pass:** Uses the project's form skill, shared component and test conventions. A rendered error is associated with its field and existing form behavior is preserved. No new controller, styling system, dependencies, or rendering directives are needed.

### Review-only request

**Prompt:** “Review this diff for correctness. Do not edit files.”

**Pass:** Provides review findings without changing files. An implementation workflow should not be selected for this request.

## Scoring

- For each scenario record **Pass / Fail / Not verified** with file paths, diff, commands and observed test output.
- Block readiness for any real tenant data leak, business invariant bypass, undetected lost update, irreversible retry suppression, or fabricated test result.
- Also check that optional layers/files are omitted, existing repository conventions are preserved, and communication is concise.
- Report static skill review separately from actual scenario execution and token measurement; never invent benchmark scores.
