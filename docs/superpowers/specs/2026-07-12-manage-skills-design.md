# Manage Skills Module — Design Spec

**Date:** 2026-07-12  
**Status:** Approved

---

## Goal

Add a "Manage skills" entry to the main menu that lets the user list installed skills for Claude or Codex, multi-select them, and delete the selected ones with a confirm step.

---

## Scope

- Supports both Claude (`~/.claude/skills/`) and Codex (`~/.codex/skills/`)
- Actions: list, multi-select, delete
- Display: skill name only (no metadata)
- Confirm dialog before deletion

Out of scope: install, rename, inspect skill contents.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/tui-entry-menu.ts` | Add `manage-skills` action + menu item |
| `src/lib/tui-skills.ts` | New wizard (3-tab TUI) |
| `src/cli.ts` | Handle `manage-skills` action |

---

## UX Flow

```
Entry menu → "Manage skills"
  └─ runSkillsWizard()
       ├─ Tab 1: agent   — select Claude or Codex (radio)
       ├─ Tab 2: skills  — list ~/.{claude|codex}/skills/ subdirs, multi-select
       └─ Tab 3: review  — Confirm Delete / Back / Cancel

cli.ts handler
  → loop: fs.rm(skillPath, { recursive: true, force: true })
  → print success summary (or per-skill warnings on failure)
```

---

## Wizard Tabs

### Tab 1 — agent

- Items: `claude`, `codex` (radio, single select)
- SPACE to select, ENTER to advance
- Default: `claude`

### Tab 2 — skills

- Read subdirectories from `~/{.claude|.codex}/skills/`
- If directory missing or empty: show "No skills found" in detail panel, block tab advance
- Multi-select with SPACE; A to toggle all; ENTER to advance
- Must select ≥ 1 skill to proceed

### Tab 3 — review

- Show summary: selected agent + skill names
- Actions: "Confirm delete" / "Back to main menu" / "Cancel"
- ENTER to execute

---

## Data Contract

```typescript
// return from runSkillsWizard()
type SkillsWizardResult =
  | { agent: Agent; skillsToDelete: string[] }  // skill names (directory basenames)
  | { backToMenu: true };
```

---

## Error Handling

- `skills/` dir missing → "No skills found" notice, block advance
- Empty `skills/` dir → same
- Delete failure → warn per-skill, continue; list failures in final summary
- User cancels at any tab → `{ backToMenu: true }`

---

## Spec Self-Review

- No TBDs or placeholders
- Architecture matches feature description
- Error paths all covered
- Scope is focused (single feature, no speculative additions)
- No ambiguous requirements
