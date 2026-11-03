# Task delivery — handoff template

Use this structure for the final user-facing response; omit irrelevant details, but never omit test failures or unresolved risks. Do not fill PASS without fresh evidence from the final tree.

## Status
READY_FOR_HUMAN_REVIEW | NEEDS_INPUT | BLOCKED | LIMIT_REACHED

## What changed
- Task objective and requirements delivered:
- Main code paths / files and the before → after behavior:
- User-visible change / how to try it locally:

## Why it works
- Relevant execution flow, explained in plain language with code references:
- Key decisions made beyond the spec (decision, reason, alternative, tradeoff):
- Any spec deviation and approval status:
- Known edge cases / limitations:

## Verification
| Check | Exact local command / action | Result and evidence | Scope / limitations |
| --- | --- | --- | --- |
| Targeted regression | | PASS / FAIL / BLOCKED / SKIPPED / FLAKY | |
| Applicable regression suite | | PASS / FAIL / BLOCKED / SKIPPED / FLAKY | |
| Lint / typecheck / build | | PASS / FAIL / BLOCKED / SKIPPED / FLAKY | |
| Local E2E (when applicable) | | PASS / FAIL / BLOCKED / SKIPPED / FLAKY | |

## Independent review
- Reviewer: independent subagent / self-review disclosed / unavailable.
- Last reviewed revision or stable working-tree state:
- Blocking findings and resolution evidence:
- Outstanding non-blocking suggestions / review gaps:

## Correction rounds
- Round(s) used: X / 3.
- Each attempt: reason → change → retest → re-review.

## Final working-tree state
- Branch, changed paths, and git diff --check result:
- Unrelated user edits preserved:
- No worktree/branch changes; task files left uncommitted.
- Remaining risks, questions, or requested human decisions:
