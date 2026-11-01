---
name: implementation-notes
description: Use when a coding task explicitly asks for implementation notes, a decision log, deviations from the spec, or tradeoffs to hand off for review.
metadata:
  author: Minh Luu
---

# Implementation Notes

Keep a short, reviewer-facing record of how implementation interprets or departs from the spec. Start it during the work and reconcile it before handoff. The approved spec remains the source of expected behavior.

## Workflow

- Read the request, spec, and applicable project instructions. Create the note early; update it when a material choice or question arises. Keep provisional decisions marked as provisional.
- Capture **decisions** where the spec is ambiguous, **deviations** from the request and why, **tradeoffs** and why an option was chosen, and **open questions** the requester should confirm or revise. Include only choices that affect behavior, scope, interfaces, or review. Omit routine naming and formatting; summarize decisions rather than a private reasoning transcript.
- For an ambiguous behavior rule, give one concrete input or situation and the expected outcome. If the outcome is unknown, label it `chờ xác nhận`; do not present a guess as an acceptance criterion. Link the relevant spec, code, and existing test where practical. No new BDD framework is required.
- When implementation affects a flow, show **before and after** paths in one Mermaid diagram. Include the affected entry, relevant steps and components, decision branches, important error or empty paths, and outcomes on both sides. Label and style old logic (`LOGIC CŨ`) and changed current logic (`ĐÃ ĐỔI`) distinctly; keep unchanged context neutral. Derive the before path from the pre-change code, tests, or spec and the after path from final code; cite key files. If old behavior cannot be verified, say so instead of inventing it. Keep proposed or unknown behavior outside the implemented flow. Omit the diagram only when the change has no meaningful flow.
- Keep **decision status** (`chờ xác nhận` or `đã chốt`, with approval source) separate from **verification** (what actually ran and its result). Surface material deviations for approval before treating them as accepted. If maintaining the spec is in task scope, update the approved rule and relevant examples/tests after authorization; otherwise record the exact spec change needed as follow-up.
- Before handoff, compare the note with the approved spec, final diff, and actual checks. Remove stale claims; show failures, skipped checks, and unresolved questions. A note alone is not an executable or verified spec.

## Output

- Write only `implementation-notes.md`. Honor a requested Markdown path; otherwise place it beside a task-specific spec, or at `docs/implementation-notes/<task-slug>/implementation-notes.md`. Update an existing note only when it belongs to the same task; choose a separate path for a different task. Never silently overwrite unrelated notes.
- Read the [Markdown template](templates/implementation-notes.md) when writing; open the [example](examples/implementation-notes.md) only if needed. The example is fictional. Adapt language to the request; replace every placeholder and omit inapplicable sections.
- Put open questions first, then an optional implementation diagram, decisions, optional behavior examples, deviations, tradeoffs, verification, and other reviewer context. Use working relative links when the spec, code, or tests exist as files; otherwise cite the request. Keep sections scannable; use tables only for useful comparisons.
- Draw the before and after paths in a fenced `mermaid` flowchart inside the note, using clearly titled subgraphs. Explain the old, changed, and unchanged styles in one sentence. Check Mermaid syntax in the target renderer when available; if rendering cannot be checked, say so. Keep secrets out of the note, check local links when practical, and report its path in the final handoff.
