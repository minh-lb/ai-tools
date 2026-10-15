# Sources of Truth, Evidence, and Assumptions

## Source priority

- **Requested outcome / constraints:** use the user's request and applicable approved project contracts/decisions. Code describes the current implementation, not necessarily the desired behavior.
- **Current behavior:** cite inspected code, schemas, logs, or observed checks. A ticket is evidence of a report, not proof that the reported behavior was reproduced; a test definition is not a passing test result.
- **Conflicts:** identify the conflicting sources and the affected requirement; do not silently choose a winner or overwrite an approved contract. Ask for a decision only if it blocks useful work; otherwise mark the draft conditional.
- **Assumptions:** use explicit, reversible drafting assumptions only when they do not decide a core business rule or unsafe action.

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
