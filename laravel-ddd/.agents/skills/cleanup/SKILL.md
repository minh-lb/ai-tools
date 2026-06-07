---
name: cleanup
description: Check or fix housekeeping issues.
argument-hint: check|run|fix
---

# Cleanup

Mode: `$ARGUMENTS` (`check` by default).

Inspect only relevant files for:

- `docs/current-feature.md` history order.
- Debug logs (`dd`, `dump`, console logs) and stale TODOs.
- Unused imports and obviously orphaned files.
- Context docs that conflict with repo state.
- `.env.production` variable parity with `.env` if both exist; never print secret values.

`check`: report findings and proposed fixes only.

`run`/`fix`: list findings, ask which item numbers to fix, then change only selected items.
