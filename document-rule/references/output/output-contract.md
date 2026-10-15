# Output Contract — Match the User's Request

## Resolve these attributes before drafting

- **Deliverables:** Specification? Plan? report? one section? file? How many files?
- **Scope:** required/excluded content; source and time boundaries.
- **Mode:** create, revise, review, summarize, print/display, or export.
- **Format:** Markdown, JSON-only, YAML, Mermaid, plain text, DOCX/PDF/file.
- **Language and depth:** follow the user's choice; preserve exact casing for code/schema/IDs.

## Mandatory rules

1. A request to "write/print/display" requires the **actual content**, not merely a statement that it was written.
2. A request to "print only X" means **only X**—no preamble, summary, conclusion, or extra section.
3. A request for "the complete" document must not be cut off or hidden behind `...`, `[truncated]`, or `[TODO]`. If chat is unsuitable, create the complete file and state clearly that the chat output is an excerpt.
4. Follow any requested schema/headings/order exactly; do not add keys/sections outside the contract.
5. If Specification + Plan are requested, provide Spec first and map Plan to its IDs; Plan-only does not authorize Spec or implementation. A fix request does not authorize Spec/Plan files unless project policy requires them. Clarify material behavior/scope/contract questions without adding deliverables; see [Plan decision](../plan/plan-decision.md). For a requested bug-fix Spec, follow the [Specification workflow](../spec/workflow.md); do not add a Plan automatically.
6. For review-only, report findings without rewriting. For explicit review-and-fix/iteration requests, fix in-scope findings that require action, rerun appropriate checks, and review again until none remain under the requested quality bar; report deferred findings, blockers, and unverified points. A rewrite-only request does not imply a lengthy review.
7. Do not fabricate evidence, test results, or claims that a file was created.
8. If both content and a file are requested, provide both.
9. Apply the metadata and schema-preservation rules in [file export](file-export.md) only to file output; do not add frontmatter to inline/raw output.
10. For existing documents, preserve each file's language and bilingual pairs unless translation is requested; editing, reviewing, or exporting unchanged content does not require language confirmation. For a new document file, use the language selected in the request or confirmed context; if neither supplies it, ask `Vietnamese` or `English` and wait. Inline output follows the conversation unless otherwise requested.

## Priorities

The user's latest specific request defines the output scope unless it conflicts with platform constraints or tool capabilities. Templates are aids, not mandatory forms when the user has specified a format.

See [inline output](inline-and-scoped-output.md) and [file export](file-export.md).
