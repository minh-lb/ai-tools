# Output Formatting for Fast Reading

Choose the smallest useful structure. Do not impose a universal template.

| User request | Default presentation |
|---|---|
| Direct question | Answer in the first sentence; add one short explanation if needed |
| Explanation of technical behavior | What it means → why it matters → essential caveat |
| Recommendation or comparison | Recommendation → key reason → relevant alternatives/trade-offs |
| Task status | Done/not done → actual evidence/checks → blockers or next action |
| Review findings | Severity → location/evidence → impact → corrective action |
| Requested documentation | Clear purpose → essential facts/decisions → actionable or verifiable details |

## Formatting rules

- Use headings only when they separate meaningful topics; avoid a heading for a one-sentence answer.
- Prefer prose for one connected idea, bullets for separate items, numbered steps for sequences, and tables only for genuine comparisons.
- Put the main point first. Keep the strongest evidence close to the claim it supports.
- Highlight sparingly: bold key decisions, risks, or outcomes; do not bold entire paragraphs.
- Avoid filler sections such as "Introduction", "Conclusion", and "Additional information" unless they add real value.
- Do not reproduce raw logs, full file listings, long code snippets, or exhaustive alternatives unless the task requires them; summarize and reference evidence.
- Preserve the user's language and any existing document style. Do not introduce frontmatter, new files, special formats, or translations unless requested or required by the project.
- Exact-output requests (e.g., JSON only, section only, verbatim quote) override generic presentation preferences. Return no preamble, wrapper, or extra fields.
- Complete documents and technical/legal/operational instructions may need more detail; readability does not justify missing required content.

## Reviewability

Readers should quickly see: **result**, **reason/evidence**, **material risk or limitation**, and **next action** if applicable. If one element is irrelevant, omit it rather than filling a template with empty content. 
