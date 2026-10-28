# Clear, Readable, Concise Writing

## Start from the reader's task

Use the audience given in the request or evident from context. With no audience specified, make purpose and outcomes understandable to a newcomer; keep implementation detail at the level the task requires. Do not ask about audience merely to fill a template.

- Open with what this concerns, why it matters, and what the reader can learn, decide, or do.
- For mixed audiences, explain the business behavior/consequence first, then the precise rules, contracts, or technical mechanism. Short documents can do this in two sentences; a separate summary/glossary is not mandatory.
- Explain an essential term/acronym where first used, in the document's language. Keep source identifiers beside their meaning: “the order is waiting to be processed (`PENDING`).” Spell out an acronym only if that also clarifies its meaning.
- Prefer familiar words; replace unnecessary jargon rather than adding definitions for it. Use a small example when an abstract rule remains difficult; label invented examples and preserve their conditions.
- For instructions, name required expertise/access and the visible completion/check signals. A non-specialist should understand the purpose, limits, and when to seek qualified help; do not imply that readable instructions qualify anyone to operate a system.

**Example (fictional):** instead of “Consumer MUST be idempotent,” write “The receiving service must not apply the cancellation twice if it receives the same message again (idempotent processing).” Keep any exact event/field names from the real contract. This explanation does not promise that duplicate messages are never sent.

## Write each unit of information clearly

- Sentence: **subject + condition + action + result**; avoid unclear pronouns.
- Paragraph: one main idea; lead with what the reader needs to know or do.
- Heading: describe the actual content; prefer a precise name over a generic label such as "Other information."
- Numbered list: ordered steps. Bullets: unordered items. Tables: compare multiple dimensions.
- Code/JSON/CLI: include only when precision requires it; preserve syntax, escaping, and field names from the source.
- Do not repeat a business rule in three places; cross-reference its ID.

## Make claims measurable

| Vague | Verifiable |
|---|---|
| "handle errors appropriately" | "return error code E and do not update the record" |
| "fast" | "p95 ≤ 300 ms under a measured load" **only if this limit was supplied** |
| "support retries" | "retrying with the same idempotency key does not duplicate effects" **only if required** |
| "test thoroughly" | "verify AC-001 through AC-004 with unit/integration tests" |

## Test with an independent reader

Check two reading levels without requiring knowledge from the author or this chat:

1. **Understanding:** can a reader new to the subject explain the purpose, essential terms, behavior/decision, consequences, and limits in everyday language?
2. **Use:** can the intended qualified reader find the inputs/prerequisites, act or decide correctly, determine completion, and verify the result from stated checks/evidence?

For reference/decision documents that do not direct execution, provide the relevant decision status, rationale, evidence, or acceptance signals rather than inventing operational steps.

## Localization and terminology

Preserve each existing file's language unless translation is requested; keep EN/VI pairs semantically aligned when shared rules change. Preserve product/API names, identifiers, and terms needed to match sources, explaining unfamiliar ones on first use. Translate surrounding prose, including normative wording (`MUST` → `PHẢI`, `MUST NOT` → `KHÔNG ĐƯỢC`, `SHOULD` → `NÊN`, `MAY` → `CÓ THỂ`); avoid unnecessary mixed-language jargon.

## Editing rules

When asked to shorten or polish prose, preserve conditions, exceptions, thresholds, statuses, and acceptance criteria. Do not add features or make business decisions. Reduce length by removing repetition and commentary, not important error branches.
