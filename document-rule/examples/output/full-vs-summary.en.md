---
id: 004ffbda-42c4-4215-9b52-a809bbaade1d
title: Output example — Full document versus summary
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, en]
---
# Output Example — Full Document vs. Summary

## Case A: The user asks, "Print the entire Specification"

- **CORRECT:** print every requested section, table, acceptance criterion, and open question in the Specification; do not omit error cases.
- **INCORRECT:** print the table of contents and say "the remaining sections are similar," or return only a summary and call it the full document.
- If chat limits make this impractical, provide a complete file that was **actually created** and clearly state that the chat text is a preview, not the full document.

## Case B: The user asks, "Summarize the Specification in 5 lines"

- **CORRECT:** provide only five key lines; mention material unresolved decisions when needed.
- **INCORRECT:** also print the full Specification/Plan.

## Case C: The user asks, "Export `spec.md` and provide a link"

- **CORRECT:** create `spec.md`, verify it is non-empty and complete, then provide the correct link supported by the runtime.
- **INCORRECT:** claim the file was created when it does not exist, or create a PDF instead of the requested Markdown.
