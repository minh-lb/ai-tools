# Task Draft and Preview

Use this as a compact starting point, not a mandatory schema. Prefer the target board's existing fields and conventions. Omit sections that add no information; do not invent facts to fill a template.

## Chat preview

```text
Target: <platform / workspace / project / list>
Title: <concise, searchable title following the target's convention>

Description:
<Concise problem/context, desired outcome or acceptance evidence, and known scope. Add references or material open questions when relevant.>

<Optional fields: assignee, priority, labels, due date, estimate — only when supplied or required>

Will remain unset: <any optional fields intentionally left blank>
```

Write in the language used by the user or the target board when evident. Ask only if language is consequential and unclear. Preserve technical detail where it helps the intended assignee; do not force a BA-only or code-only style.

Before a write, show the entire preview and wait for explicit approval. Approval covers the exact destination and fields shown. Any change requires a new preview and approval.

## Optional estimate block

Include only when requested and useful for the target board:

```text
Estimate: <project-conventional point/range>
Basis: <known scope, assumptions, dependencies, review and verification effort>
Confidence: <brief qualitative confidence and what could change it>
```

Avoid a precise number when scope or historical calibration does not support it. Do not use the example scale as a universal commitment.

## Local Markdown file

Use only after the user explicitly chooses or approves local storage. Resolve the destination from the project root and verify it remains inside the root and does not escape through a symlink. Follow any existing task-file convention; do not assume a sequential-ID scheme unless the project already uses one.

A minimal example, with optional metadata omitted when unknown:

```markdown
---
id: "<existing-project ID, if used>"
title: "<approved title; serialize/escape as valid YAML>"
status: open
created: YYYY-MM-DD
---

# <approved title>

## Context / problem
<verified facts>

## Desired outcome
<approved outcome or acceptance evidence>

## Scope / non-goals
<only what is known and relevant>

## References
<omit when none>

## Open questions
<omit when none>
```

Do not write a secret, credential, unnecessary personal data, placeholder, or unapproved claim into the file.
