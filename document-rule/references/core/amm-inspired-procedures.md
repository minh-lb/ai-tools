# Selectively Applying AMM-Inspired Principles

## Borrow principles; do not copy aviation structures

Use the Aircraft Maintenance Manual (AMM) as a writing-method reference that values accuracy, clarity, structure, actionability, and verifiability. This is a selective quality lens, not a compliance standard or mandatory schema for every document. The operational pattern **scope → readiness conditions → action → expected result → verification → recovery when needed** applies to procedures when appropriate; it is not a required structure for every document. Do not copy aviation chapter hierarchies, work cards, sign-offs, ATA/S1000D codes, or impose headings, warnings, or numbering on non-operational documents.

Use only the elements appropriate to the document type and risk. The user's requested format and the project's conventions/contracts take precedence. ADRs, designs, and specifications do not default to procedural workflows. Template headings are suggestions to select or omit, not a form that must be completed in full.

## One-step pattern for runbooks and plans

1. **Precondition:** a required condition before a consequential step.
2. **Action:** one verb and one specific operation.
3. **Expected:** an observable state or artifact after the step.
4. **Verify:** a measurement, test, or check sufficient to confirm the result.
5. **Stop / Recovery:** include only when the operation could fail severely or be difficult to reverse.

Simple steps may combine `Action + Expected`; do not force every operation into five lines.

## Warning levels

- **WARNING:** serious impact on users, production, or security; state the condition that prevents harm.
- **CAUTION:** data, compatibility, or results may be damaged; describe mitigation.
- **NOTE:** supporting condition that helps perform the operation correctly; do not use it to hide a precondition.

## Example (illustrative, not an actual procedure)

> **CAUTION:** changing a production schema may affect older application versions.
>
> **Precondition:** verify that both old and new versions can read the expanded schema.
>
> **Action:** deploy an additive migration before deploying code that uses the new column.
>
> **Expected / Verify:** the new schema exists and compatible queries pass in staging.
>
> **Recovery:** stop the rollout if compatibility checks fail; do not automatically delete a column that may contain new data.

Use this structure for **execution procedures**. ADRs and designs should emphasize decisions and trade-offs instead.
