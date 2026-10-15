---
id: 9e8ebc92-2618-4b94-b0a8-3d186b8ad116
title: Output example — JSON only
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, en]
---
# Output Example — JSON Only

**User:** "Output JSON only with keys `id`, `status`, `rules`; no Markdown."

**CORRECT — raw payload in the actual response:**

```json
{"id":"SPEC-ORDER-001","status":"draft","rules":["BR-001","BR-002"]}
```

**Note about this example document:** the code fence only presents the example in this Markdown file. **When the user actually requests JSON only, omit the code fence, heading, and all explanation.**

**INCORRECT:** adding a `notes` key or preamble, or wrapping the JSON in a Markdown fence in the response.
