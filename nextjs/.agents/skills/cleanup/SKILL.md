---
name: cleanup
description: Clean up project housekeeping tasks (add "run" to execute fixes)
---

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Default: do not load extra references.
- Load `docs/current-feature.md` when checking history/order issues.
- Load only files implicated by findings before proposing or applying fixes.

Review the codebase for cleanup tasks:

1. Make sure that the history in `docs/current-feature.md` is in order from oldest to newest
2. Find unnecessary debug logs
3. Find unused imports
4. Check for stale TODO comments
5. Find orphaned/unused files
6. Check that context files match actual project state
7. When both files exist, check whether `.env.production` has the same variable names as `.env` (values may differ). If something is missing, report it.

**Mode: $ARGUMENTS**

If no argument or argument is "check":

- Only report findings, don't modify anything
- List what WOULD be cleaned up

If the argument is "run" or "fix":

- First, report all findings with numbered items
- If the user already explicitly asked to fix all findings, proceed; otherwise ask: "Which items would you like me to fix? (enter numbers like 1,3,5 or 'all' or 'none')"
- Wait for user response before making changes unless the user already approved fixing all findings
- Only fix the items the user specifies
- Report what you changed
