# Clear, Readable, Concise Writing

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

Identify the intended reader and the expertise the document assumes. Check that a qualified reader who did not author it can:

1. Find the relevant task, decision, or requirement.
2. Understand prerequisites, inputs, constraints, and expected results.
3. Determine what completion means for this document's purpose.
4. Verify the result using stated evidence, acceptance criteria, or checks.

For reference/decision documents that do not direct execution, provide the relevant decision status, rationale, evidence, or acceptance signals rather than inventing operational steps.

## Localization and terminology

When translating/localizing, preserve specialized industry/domain terms in their canonical original form. Do not translate technical terms, acronyms, product/API names, or code identifiers. Translate the surrounding prose while retaining the source's intended meaning and terminology.

## Editing rules

When asked to shorten or polish prose, preserve conditions, exceptions, thresholds, statuses, and acceptance criteria. Do not add features or make business decisions. Reduce length by removing repetition and commentary, not important error branches.
