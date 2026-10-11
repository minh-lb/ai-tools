# Commit Message Guidance

Use the target repository's documented format and recent accepted history. This skill does not impose a scope field, naming syntax, imperative mood, or character limit when the repository does not require one.

## Before drafting

- Inspect the staged diff and the repository's contribution guidance or local commit conventions.
- Confirm the message describes the actual staged change, not just the request or intended work.
- Prefer one logical purpose per commit. Split unrelated changes only when staging intent is clear; ask before changing what is staged.
- Do not include credentials, sensitive data, or co-author attribution unless the user or repository explicitly requires it.

## Message quality

Make the subject concise and specific enough to distinguish the change in history. Describe the outcome rather than the activity. Add a body when context, rationale, compatibility, or migration information would help future maintainers. Do not force a scope, footer, ticket ID, or body when the project convention does not call for it.

If the project has no visible convention, use the user's requested format. Otherwise ask when the choice materially affects automation or team expectations; for a routine local commit, use a concise outcome-focused message and state the convention chosen.

## Intent categories

When the repository uses conventional categories, choose the category matching the primary change. Common categories include:

- `feat`: adds or expands supported behavior.
- `fix`: corrects behavior that is broken, unsafe, or inconsistent.
- `refactor`: restructures without changing intended observable behavior.
- `test`: test-only change.
- `docs`: documentation-only change.
- `ci` / `build`: CI, packaging, or dependency/build tooling, following local definitions.
- `perf`: measured or otherwise substantiated performance improvement.
- `chore` / `style` / `revert`: use only as the repository defines them.

These categories are examples, not a mandate to rename a repository's established types. If a change spans multiple concerns, choose the dominant intent only when the diff remains one coherent commit; otherwise agree on the split.

## Final check

Before committing, compare the final message to the exact staged diff and verify that the staged content is intended. Keep any repository-required metadata, omit unsupported claims, and follow the confirmation/staging rules in the calling workflow.
