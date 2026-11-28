# Plain Language Without Losing Accuracy

## Default reader

Assume the reader may not know programming. Explain the consequence first; add the mechanism only when it is necessary to judge the answer or act on it. Preserve terminology and precise identifiers where they matter to a developer or a contract.

| Instead of | Write |
|---|---|
| "Implement optimistic concurrency control to mitigate race conditions" | "Prevent two people from overwriting each other's changes; only accept an update if the data is still current." |
| "Redis acts as a caching layer to optimize read throughput" | "Store frequently used data in Redis so the system reads the database less often." |
| "Authorization failed due to insufficient privileges" | "This account does not have permission to perform the action." |

These are **illustrative rewrites**, not project-specific design decisions or measured performance claims.

## How to rewrite

- Prefer familiar words and active verbs. Explain what changes for the user, not just what a component does.
- Use short sentences with one main point; keep conditions close to their effects.
- Explain a necessary unfamiliar term in context on first use. In Vietnamese, retain the English term when it helps the reader recognize or look it up. For example, "Hệ thống giới hạn số yêu cầu mỗi phút cho từng tài khoản (rate limit)." When the label adds no value for the reader, give just the explanation.
- Keep the exact names of fields, endpoints, states, commands, and error codes if readers need them to implement, search, or verify.
- Show one small example if the explanation would otherwise remain abstract; omit examples for self-evident requests.
- Match depth to the question: quick explanation, decision memo, technical contract, and runbook need different detail.
- Avoid claiming users can safely perform specialist operations merely because the language is clear.

## Fidelity check

Before accepting a simplified sentence, compare it with the source: did it keep **who**, **when**, **condition**, **expected effect**, **exception**, and **uncertainty** when these matter? Preserve technical precision in code blocks/tables if prose alone would be ambiguous. Do not claim a proposed approach is already implemented.
