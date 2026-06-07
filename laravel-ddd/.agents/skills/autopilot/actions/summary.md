# Summary Action

## Prerequisites

- Implementation must be complete (code changes exist in the working tree). If no changes, inform the user there is nothing to summarize.

## Steps

Gather active spec goals plus `git status` and relevant `git diff`.

Output:

```markdown
## Summary
## Files Changed
## Tests
## Notes / Risks
## Next Step
```

Also check: no unrelated files, no secrets, no unnecessary dependency, migrations reviewed, no obvious N+1 risk.
