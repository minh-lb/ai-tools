# Information Filtering

## The filter

Classify each idea against the user's immediate goal:

| Class | Meaning | Action |
|---|---|---|
| Essential | Answer, decision, effect, required action, material constraint, important risk/exception, or evidence needed to trust the claim | Keep, put first |
| Supporting | Short explanation, cause, comparison, example, or technical detail that materially improves understanding | Condense; include only as needed |
| Noise | Restated prompt, generic introduction, repeated conclusion, obvious advice, speculative detail, irrelevant architecture, internal process narration | Remove |

**Decision test:** If deleting the sentence would not change what the reader understands, decides, does, or can verify, remove it.

## Apply in order

1. Determine the reader's real question and required deliverable.
2. Identify the smallest set of facts needed to answer it correctly.
3. Preserve any condition or uncertainty that changes the outcome; a brief but misleading answer fails.
4. Remove repeated statements, generic background, filler and side topics.
5. Move optional engineering details after the main answer, or omit them unless requested.
6. Verify that every retained detail serves the question.

## Non-removable information when relevant

- Constraints, permissions, eligibility, scope, and exceptions that change the result.
- Safety, security, data-loss, migration, compatibility, or operational risk.
- Evidence and its limits, including a failed, skipped, or unperformed check.
- Consequential uncertainty, assumptions, dependencies, and next actions.
- Exact values, error codes, APIs, field names, or commands essential to the user's task.

Do not replace specific technical facts with vague claims like "works correctly." For requested complete documents or audits, completeness of the authorized scope takes priority over brevity. Condense *presentation*, not required coverage.

## Avoid over-filtering

Do not automatically truncate to a word count or a fixed number of bullets. Do not remove negative cases, counterarguments or caveats solely because they make the output longer. Never hide a material unresolved problem in a footnote. 

## Document-level filtering

Before drafting, map mandatory facts to the smallest set of useful sections. For every optional section ask: what reader decision, action, or verification would fail if this section were absent? If none, omit it. Merge sections that answer the same question. Assign each requirement a canonical location and refer to it elsewhere only when needed. Repeat a short safety-critical condition when a standalone procedure would otherwise be ambiguous or unsafe. Minimize reader effort, not just words. Use existing verified accessible references instead of restating whole documents; preserve necessary context for standalone output. Do not remove mandated sections or specialized artifact coverage. Stop once the intended reader can use the document; avoid adding material merely because it is related.
