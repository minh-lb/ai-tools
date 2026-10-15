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
5. If Specification + Plan are requested, provide the Specification first and link the Plan to requirement IDs; if only a Plan is requested, provide only the Plan. For a **small fix** with no document request, do **not** create a Specification/Plan file automatically. If a bug-fix Specification is requested or needed to settle material behavior/scope/interface-contract questions, write a concise Spec stating the verified cause or explicitly marking it unknown, following [Plan decision](../plan/plan-decision.md) and the [Specification workflow](../spec/workflow.md); do not add a Plan automatically.
6. For review-only, report findings without rewriting. For explicit review-and-fix/iteration requests, fix in-scope findings that require action, rerun appropriate checks, and review again until none remain under the requested quality bar; report deferred findings, blockers, and unverified points. A rewrite-only request does not imply a lengthy review.
7. Do not fabricate evidence, test results, or claims that a file was created.
8. If both content and a file are requested, provide both.
9. For a Markdown document created as a file, use the YAML frontmatter properties in [file export rules](file-export.md), unless the user or an existing schema specifies otherwise. Use an available unique task/ticket ID for `id`; otherwise generate a UUID. Keep it stable and unique within the repository/vault. When frontmatter `status` is present, it MUST be exactly `draft` or `approved`; use `draft` unless the user explicitly approves the document. Domain states in the document body are separate. Do not add metadata to inline output or a plain format that does not permit frontmatter.
10. Before writing a document to a file, ask the user to choose the display language—`Vietnamese` or `English`—unless the request already specifies the language. If the choice is missing, wait for it before writing. For bilingual example files, preserve both localized versions.

## Priorities

The user's latest specific request defines the output scope unless it conflicts with platform constraints or tool capabilities. Templates are aids, not mandatory forms when the user has specified a format.

See [inline output](inline-and-scoped-output.md) and [file export](file-export.md).
