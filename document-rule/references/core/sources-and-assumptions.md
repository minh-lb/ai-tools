# Sources of Truth, Evidence, and Assumptions

## Source priority

1. The user's latest request, scope, and corrections.
2. Files, tickets, schemas, API specifications, code, or tests directly inspected.
3. Supplied project conventions, ADRs, and standards.
4. Explicitly labeled assumptions, only when missing information does not prevent a useful draft.

## Classify claims

| Label | When to use | How to write it |
|---|---|---|
| `Verified` | Supported by observable evidence | Cite the source/path/section when possible |
| `Requested` | The user states a future goal | State it as a requirement, not existing behavior |
| `Assumption` | A drafting assumption | State the assumption and the consequence if it is wrong |
| `Unknown` | An important decision or fact is missing | State a specific question and its impact |

**As-is** statements describe current behavior and may be asserted only from code or sources that were inspected. **To-be** statements describe intended behavior; do not imply they are already implemented.

## Do not invent facts

- Do not fabricate paths, files, modules, migration names, commands, endpoints, statuses, SLAs, or existing features.
- Label illustrative scenarios **Fictional example**; do not present them as real contracts.
- If much information is missing, write what is supported and group open questions. Ask the user only when a useful output cannot be produced without guessing a core decision.
- Claims such as `Verified` or `Passed` require evidence. `Proposed`, `Not inspected`, and `Not run` are not failures.
