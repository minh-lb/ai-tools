---
id: 2add03ef-0d17-4327-93c3-9e277e21bae6
title: Output example — Print only the Acceptance Criteria section
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, output, en]
---
# Output Example — Print Only One Section

**User:** "Print only the Acceptance Criteria for the cancel-order Specification. No explanation."

**CORRECT — the response contains only this (no preamble):**

```markdown
## Acceptance Criteria

- **AC-001:** Given the user's own PENDING order, when they cancel it, then return HTTP 200 and status CANCELLED.
- **AC-002:** Given the user's own SHIPPED order, when they cancel it, then return HTTP 409 and leave the order unchanged.
- **AC-003:** Given an unauthenticated caller, a non-owner, or a missing order, when cancellation is attempted, then return 401/403/404 respectively with no mutation.
- **AC-004:** Given the user's own `PENDING` order and two authorized concurrent requests, when both complete without an unrelated infrastructure failure, then exactly one returns HTTP 200 and transitions the order to `CANCELLED`; the other returns `409 ORDER_NOT_CANCELLABLE` without another mutation, and only one cancellation timestamp is stored.
```

The Markdown code fence only displays this example in the file. In the actual response, output the heading and bullets without the fence.

**INCORRECT:** "Here are your ACs" + the entire Specification + implementation recommendations.

**Principle:** In actual use, print the Acceptance Criteria exactly as stated in the source document; the block above is self-contained fictional content.
