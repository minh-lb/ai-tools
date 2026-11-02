---
name: implementation-notes
description: Use when coding tasks request implementation notes, a decision log, spec deviations, or review tradeoffs.
metadata:
  author: Minh Luu
---

Keep a Markdown note during work; approved spec defines behavior.

## Record

- Read request/spec/rules. Start early; update material choices/questions; reconcile before handoff.
- Record material ambiguities, deviations/reasons, tradeoffs, and open questions affecting behavior, scope, interfaces, or review. Summarize; omit routine choices/private reasoning.
- For ambiguity, use a concrete case; state an outcome only if confirmed, else mark `chờ xác nhận`, not an acceptance criterion. Link spec/code/tests.
- Separate decision status/approval from verification. Get approval for material deviations; update related specs/examples/tests only if scoped/authorized; else note follow-up.

## Changed flows

- For meaningful flow changes, draw Mermaid `TRƯỚC · logic cũ`/`SAU · logic hiện tại` subgraphs. Show entry, steps, decisions, outcomes, and success/error/empty paths on both sides; include unchanged old errors. Prefix old nodes `LOGIC CŨ` and every changed node `ĐÃ ĐỔI`; style old/changed distinctly, unchanged neutral. Ground old in pre-change evidence and new in final code; flag unverifiable history.

## Note

- Honor requested path; else name the file exactly `implementation-notes.md` beside the task spec. Without a spec, use `docs/implementation-notes/<task-slug>/implementation-notes.md`. Update only same-task notes; never overwrite unrelated notes. This rule is for the note only.
- Follow the [template](templates/implementation-notes.md); the [example](examples/implementation-notes.md) is optional. Omit empty sections. Link existing evidence relative to the note and verify targets exist; otherwise cite the request. Keep Markdown/secrets safe. Check Mermaid or report it unverified; state the path.
