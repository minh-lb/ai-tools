# Manage Skills Module — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Manage skills" entry to the main menu that lets the user list installed skills for Claude or Codex, multi-select them, and delete the selected skill directories.

**Architecture:** Three-tab blessed TUI wizard (`tui-skills.ts`) — agent selection → skill multi-select (read from `~/.claude/skills/` or `~/.codex/skills/`) → confirm/delete review. The `cli.ts` loop handles the result by deleting the selected directories with `fs.rm`.

**Tech Stack:** Node.js ≥22, TypeScript 5, `blessed` (TUI), `node:fs/promises` (rm, readdir), `node:os` (homedir), existing TUI utilities in `tui-utils.ts`.

## Global Constraints

- No new dependencies — use existing `blessed` and `node:fs/promises`
- Follow `tui-plugins.ts` patterns exactly: debounced key handlers, `canRun()`, `createTabbedLayout()`, `renderBannerHeader()`, `renderListRow()`, `renderKeycaps()`
- Tests use `node:test` + `node:assert/strict`, compiled then run from `dist/test/`
- Test command: `npm run build && node --test dist/test/*.test.js`
- Only skill directory basenames are stored — full paths are constructed at runtime
- All new exported functions must have explicit TypeScript return types

---

### Task 1: Extend entry menu with `manage-skills`

**Files:**
- Modify: `src/lib/tui-entry-menu.ts`

**Interfaces:**
- Produces: `EntryMenuAction` union now includes `"manage-skills"` — used by `cli.ts` in Task 3

- [ ] **Step 1: Write the failing test**

Create `test/skills.test.ts`:

```typescript
import { test } from "node:test";
import * as assert from "node:assert/strict";

// Importing the type module — verifies the literal compiles
test("EntryMenuAction includes manage-skills", async () => {
  const { MENU_ITEMS_FOR_TEST } = await import("../src/lib/tui-entry-menu.js");
  const ids = MENU_ITEMS_FOR_TEST.map((item: { id: string }) => item.id);
  assert.ok(ids.includes("manage-skills"), `manage-skills not found in menu items: ${ids.join(", ")}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run build && node --test dist/test/skills.test.js
```

Expected: FAIL — `MENU_ITEMS_FOR_TEST is not exported` or `manage-skills not found`

- [ ] **Step 3: Add `manage-skills` to the entry menu**

In `src/lib/tui-entry-menu.ts`, make these two changes:

Change the `EntryMenuAction` type (add `"manage-skills"`):

```typescript
export type EntryMenuAction =
  | "install-skills"
  | "install-project-docs"
  | "install-libs"
  | "install-plugin"
  | "install-mcp"
  | "manage-skills"
  | "cancel";
```

Add the menu item to `MENU_ITEMS` (insert before the `cancel` entry):

```typescript
  {
    id: "manage-skills",
    label: "⊘  Manage skills",
    description: "List and delete installed skills for Claude or Codex.",
    meta: "Claude + Codex"
  },
```

Export `MENU_ITEMS` for testing (add below the `MENU_ITEMS` array):

```typescript
export const MENU_ITEMS_FOR_TEST = MENU_ITEMS;
```

Also update the header chip count — change the `renderBannerHeader` call inside `render()`:

```typescript
{ label: `${MENU_ITEMS.length - 1} workflows`, tone: "accent" },
```

This line is already dynamic, so no change needed there.

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run build && node --test dist/test/skills.test.js
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tui-entry-menu.ts test/skills.test.ts
git commit -m "feat(menu): add manage-skills entry to main menu"
```

---

### Task 2: Create `tui-skills.ts` — the 3-tab wizard

**Files:**
- Create: `src/lib/tui-skills.ts`

**Interfaces:**
- Consumes: `Agent` from `./types.js`; `canRun`, `DEBOUNCE_MOVE_MS`, `DEBOUNCE_SELECT_MS`, `createTabbedLayout`, `renderBannerHeader`, `renderKeycaps`, `renderListContent`, `renderListRow`, `renderStepSummary`, `renderTabBar`, `selectionArray`, `TabbedLayout` from `./tui-utils.js`; `os.homedir()`, `fs.readdir`
- Produces: `runSkillsWizard(): Promise<{ agent: Agent; skillsToDelete: string[] } | { backToMenu: true }>`

- [ ] **Step 1: Write the failing test**

Add to `test/skills.test.ts`:

```typescript
import { readdir, mkdir, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

test("resolveSkillsDir returns correct path for claude", async () => {
  const { resolveSkillsDir } = await import("../src/lib/tui-skills.js");
  const dir = resolveSkillsDir("claude");
  const expected = path.join(os.homedir(), ".claude", "skills");
  assert.equal(dir, expected);
});

test("resolveSkillsDir returns correct path for codex", async () => {
  const { resolveSkillsDir } = await import("../src/lib/tui-skills.js");
  const dir = resolveSkillsDir("codex");
  const expected = path.join(os.homedir(), ".codex", "skills");
  assert.equal(dir, expected);
});

test("readInstalledSkills returns empty array when dir missing", async () => {
  const { readInstalledSkills } = await import("../src/lib/tui-skills.js");
  const skills = await readInstalledSkills("/tmp/__nonexistent_ai_tools_test__");
  assert.deepEqual(skills, []);
});

test("readInstalledSkills returns subdirectory names only", async () => {
  const { readInstalledSkills } = await import("../src/lib/tui-skills.js");
  const tmpDir = path.join(os.tmpdir(), "ai-tools-test-skills-" + Date.now());
  await mkdir(path.join(tmpDir, "my-skill"), { recursive: true });
  await mkdir(path.join(tmpDir, "other-skill"), { recursive: true });
  // Create a file (should be excluded)
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(tmpDir, "not-a-skill.md"), "content");

  const skills = await readInstalledSkills(tmpDir);
  skills.sort();
  assert.deepEqual(skills, ["my-skill", "other-skill"]);

  await rm(tmpDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run build && node --test dist/test/skills.test.js
```

Expected: FAIL — `Cannot find module '../src/lib/tui-skills.js'`

- [ ] **Step 3: Create `src/lib/tui-skills.ts`**

```typescript
import { readdir } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
  canRun,
  createTabbedLayout,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  renderKeycaps,
  renderListContent,
  renderListRow,
  renderStepSummary,
  renderTabBar,
  selectionArray,
  type TabbedLayout
} from "./tui-utils.js";
import type { Agent } from "./types.js";

type WizardTab = "agent" | "skills" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface WizardState {
  activeTab: WizardTab;
  selectedAgent: Agent;
  availableSkills: string[];
  selectedSkills: Set<string>;
  listCursor: Record<WizardTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

const TAB_ORDER: WizardTab[] = ["agent", "skills", "review"];

const AGENT_DIR: Record<Agent, string> = {
  claude: ".claude",
  codex: ".codex"
};

export function resolveSkillsDir(agent: Agent): string {
  return path.join(os.homedir(), AGENT_DIR[agent], "skills");
}

export async function readInstalledSkills(skillsDir: string): Promise<string[]> {
  try {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

function buildInitialState(availableSkills: string[]): WizardState {
  return {
    activeTab: "agent",
    selectedAgent: "claude",
    availableSkills,
    selectedSkills: new Set(),
    listCursor: { agent: 0, skills: 0, review: 0 },
    reviewAction: "confirm",
    notice: ""
  };
}

function agentItems(): Array<{ id: Agent; label: string }> {
  return [
    { id: "claude", label: "◇  Claude" },
    { id: "codex", label: "◇  Codex" }
  ];
}

function reviewItems(): Array<{ id: ReviewAction; label: string }> {
  return [
    { id: "confirm", label: "✓  Confirm delete" },
    { id: "back", label: "←  Back to main menu" },
    { id: "cancel", label: "✕  Cancel" }
  ];
}

function renderTabs(state: WizardState): string {
  return renderTabBar(TAB_ORDER.map((tab, index) => ({
    label: `${index + 1}. ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
    meta: tab === "agent"
      ? state.selectedAgent
      : tab === "skills"
      ? `${state.selectedSkills.size} selected`
      : "ready",
    active: state.activeTab === tab
  })));
}

function renderDetailBody(state: WizardState): string {
  const lines: string[] = [];

  if (state.notice) {
    lines.push(`{yellow-fg}${state.notice}{/yellow-fg}`, "");
  }

  if (state.activeTab === "review") {
    const selected = selectionArray(state.selectedSkills);
    const sep = `{cyan-fg}${"─".repeat(50)}{/cyan-fg}`;
    lines.push(
      `{bold}{white-fg}◈ Delete summary{/white-fg}{/bold}`,
      sep,
      `{cyan-fg}◆ Agent{/cyan-fg}  ${state.selectedAgent}`,
      `{cyan-fg}◆ Skills{/cyan-fg} ${selected.length ? selected.join(", ") : "{gray-fg}none{/gray-fg}"}`,
      "",
      `{gray-fg}This will permanently remove the selected skill directories.{/gray-fg}`
    );
    return lines.join("\n");
  }

  if (state.activeTab === "agent") {
    lines.push(
      `{cyan-fg}◆ Select the agent whose skills you want to manage.{/cyan-fg}`
    );
    return lines.join("\n");
  }

  // skills tab
  const count = state.selectedSkills.size;
  const total = state.availableSkills.length;
  lines.push(
    `{cyan-fg}◆ ${count} of ${total} selected{/cyan-fg}`,
    `{gray-fg}${"─".repeat(40)}{/gray-fg}`,
    `{gray-fg}Skills for ${state.selectedAgent} in ${resolveSkillsDir(state.selectedAgent)}{/gray-fg}`
  );
  return lines.join("\n");
}

function renderFooter(state: WizardState): string {
  if (state.activeTab === "review") {
    return renderKeycaps([
      { key: "LEFT/RIGHT", label: "switch tab" },
      { key: "UP/DOWN", label: "move" },
      { key: "ENTER", label: "confirm action" },
      { key: "Q", label: "quit" }
    ]);
  }

  if (state.activeTab === "skills") {
    return renderKeycaps([
      { key: "LEFT/RIGHT", label: "switch tab" },
      { key: "UP/DOWN", label: "move" },
      { key: "SPACE", label: "toggle" },
      { key: "A", label: "toggle all" },
      { key: "ENTER", label: "next" },
      { key: "Q", label: "quit" }
    ]);
  }

  return renderKeycaps([
    { key: "LEFT/RIGHT", label: "switch tab" },
    { key: "UP/DOWN", label: "move" },
    { key: "SPACE", label: "select" },
    { key: "ENTER", label: "next" },
    { key: "Q", label: "quit" }
  ]);
}

function moveTab(state: WizardState, delta: number): void {
  const index = TAB_ORDER.indexOf(state.activeTab);
  const nextIndex = (index + delta + TAB_ORDER.length) % TAB_ORDER.length;
  state.activeTab = TAB_ORDER[nextIndex];
  state.notice = "";
}

function moveCursor(state: WizardState, delta: number): void {
  let length = 0;
  if (state.activeTab === "agent") length = agentItems().length;
  else if (state.activeTab === "skills") length = state.availableSkills.length;
  else length = reviewItems().length;

  if (length === 0) return;

  const current = state.listCursor[state.activeTab];
  const next = (current + delta + length) % length;
  state.listCursor[state.activeTab] = next;

  if (state.activeTab === "review") {
    state.reviewAction = reviewItems()[next]?.id ?? "confirm";
  }
}

function toggleCurrentItem(state: WizardState): void {
  if (state.activeTab === "agent") {
    const item = agentItems()[state.listCursor.agent];
    if (item) {
      state.selectedAgent = item.id;
    }
    return;
  }

  if (state.activeTab === "skills") {
    const skill = state.availableSkills[state.listCursor.skills];
    if (!skill) return;
    if (state.selectedSkills.has(skill)) {
      state.selectedSkills.delete(skill);
    } else {
      state.selectedSkills.add(skill);
    }
  }
}

function toggleAllSkills(state: WizardState): void {
  if (state.activeTab !== "skills") return;
  const allSelected = state.availableSkills.every((s) => state.selectedSkills.has(s));
  state.selectedSkills.clear();
  if (!allSelected) {
    for (const s of state.availableSkills) {
      state.selectedSkills.add(s);
    }
  }
}

function validateAndAdvance(state: WizardState): boolean {
  if (state.activeTab === "agent") {
    moveTab(state, 1);
    return true;
  }

  if (state.activeTab === "skills") {
    if (state.availableSkills.length === 0) {
      state.notice = "No skills found. Install skills first.";
      return false;
    }
    if (state.selectedSkills.size === 0) {
      state.notice = "Select at least one skill to delete.";
      return false;
    }
    moveTab(state, 1);
    return true;
  }

  return false;
}

export async function runSkillsWizard(): Promise<
  | { agent: Agent; skillsToDelete: string[] }
  | { backToMenu: true }
> {
  const initialSkills = await readInstalledSkills(resolveSkillsDir("claude"));
  const state = buildInitialState(initialSkills);

  const { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox } =
    createTabbedLayout() as TabbedLayout;

  let lastMoveAt = 0;
  let lastSelectAt = 0;

  return new Promise((resolve) => {
    function cleanup(): void {
      screen.destroy();
    }

    async function refreshSkills(): Promise<void> {
      const skills = await readInstalledSkills(resolveSkillsDir(state.selectedAgent));
      state.availableSkills = skills;
      state.selectedSkills.clear();
      state.listCursor.skills = 0;
      state.notice = "";
      render();
    }

    function buildListItems(): string[] {
      if (state.activeTab === "agent") {
        return agentItems().map((item, index) =>
          renderListRow({
            active: index === state.listCursor.agent,
            selected: state.selectedAgent === item.id,
            label: item.label,
            index
          })
        );
      }

      if (state.activeTab === "skills") {
        if (state.availableSkills.length === 0) {
          return [renderListRow({ active: false, label: "{gray-fg}No skills found{/gray-fg}" })];
        }
        return state.availableSkills.map((skill, index) =>
          renderListRow({
            active: index === state.listCursor.skills,
            selected: state.selectedSkills.has(skill),
            label: `◈  ${skill}`,
            index
          })
        );
      }

      return reviewItems().map((item, index) =>
        renderListRow({
          active: index === state.listCursor.review,
          selected: state.reviewAction === item.id,
          label: item.label,
          index
        })
      );
    }

    function render(): void {
      const items = buildListItems();
      const cursor = state.listCursor[state.activeTab];

      headerBox.setContent(renderBannerHeader(
        "Manage skills",
        "List and delete installed skills for Claude or Codex.",
        [
          { label: state.selectedAgent, tone: "accent" },
          { label: `${state.selectedSkills.size} selected`, tone: "muted" },
          { label: "delete", tone: "warning" }
        ]
      ));
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(renderStepSummary({
        step: `${TAB_ORDER.indexOf(state.activeTab) + 1}/${TAB_ORDER.length}`,
        title: state.activeTab === "review" ? "Review" : state.activeTab.charAt(0).toUpperCase() + state.activeTab.slice(1),
        description: "Choose agent, select skills to remove, then confirm."
      }));
      renderListContent(listBox, items, cursor);
      detailBox.setContent(renderDetailBody(state));
      footerBox.setContent(renderFooter(state));
      screen.render();
    }

    screen.key(["left"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) return;
      lastMoveAt = Date.now();
      moveTab(state, -1);
      render();
    });

    screen.key(["right"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) return;
      lastMoveAt = Date.now();
      moveTab(state, 1);
      render();
    });

    screen.key(["up"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) return;
      lastMoveAt = Date.now();
      moveCursor(state, -1);
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) return;
      lastMoveAt = Date.now();
      moveCursor(state, 1);
      render();
    });

    screen.key(["space"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) return;
      lastSelectAt = Date.now();
      toggleCurrentItem(state);
      render();
    });

    screen.key(["a"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) return;
      lastSelectAt = Date.now();
      toggleAllSkills(state);
      render();
    });

    screen.key(["enter"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) return;
      lastSelectAt = Date.now();

      if (state.activeTab !== "review") {
        const prevAgent = state.selectedAgent;

        if (state.activeTab === "agent") {
          const item = agentItems()[state.listCursor.agent];
          if (item) state.selectedAgent = item.id;
        }

        const advanced = validateAndAdvance(state);

        if (advanced && state.activeTab === "skills" && state.selectedAgent !== prevAgent) {
          void refreshSkills();
          return;
        }

        render();
        return;
      }

      cleanup();
      if (state.reviewAction === "back" || state.reviewAction === "cancel") {
        resolve({ backToMenu: true });
        return;
      }
      resolve({
        agent: state.selectedAgent,
        skillsToDelete: selectionArray(state.selectedSkills)
      });
    });

    screen.key(["q", "escape", "C-c"], () => {
      cleanup();
      resolve({ backToMenu: true });
    });

    render();
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run build && node --test dist/test/skills.test.js
```

Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tui-skills.ts test/skills.test.ts
git commit -m "feat(skills): add tui-skills wizard with agent/list/review tabs"
```

---

### Task 3: Wire `manage-skills` into `cli.ts`

**Files:**
- Modify: `src/cli.ts`

**Interfaces:**
- Consumes: `runSkillsWizard` from `./lib/tui-skills.js` (returns `{ agent, skillsToDelete }` or `{ backToMenu: true }`)
- Consumes: `resolveSkillsDir` from `./lib/tui-skills.js`
- Consumes: `rm` from `node:fs/promises`

No new test file needed — the delete logic is a thin orchestration over `fs.rm` which is a Node built-in. Manual smoke test is sufficient.

- [ ] **Step 1: Add import at top of `src/cli.ts`**

After the existing imports block, add:

```typescript
import { rm } from "node:fs/promises";
import { runSkillsWizard, resolveSkillsDir } from "./lib/tui-skills.js";
```

- [ ] **Step 2: Add `manage-skills` handler in the `while (true)` loop**

Inside `runCli()`, after the `if (entryAction === "install-mcp")` block and before the `// install-skills` fallthrough, add:

```typescript
    if (entryAction === "manage-skills") {
      const skillsResult = await runSkillsWizard();

      if ("backToMenu" in skillsResult) {
        continue;
      }

      const { agent, skillsToDelete } = skillsResult;
      const skillsDir = resolveSkillsDir(agent);

      printSectionHeader(
        "Manage skills",
        `Deleting ${skillsToDelete.length} skill(s) for ${agent}.`
      );

      const deleted: string[] = [];
      const failed: Array<{ name: string; error: string }> = [];

      for (const skillName of skillsToDelete) {
        const skillPath = `${skillsDir}/${skillName}`;
        try {
          await rm(skillPath, { recursive: true, force: true });
          deleted.push(skillName);
          printStatusLine("delete", skillPath, "muted");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failed.push({ name: skillName, error: message });
          printStatusLine("warn", `Failed to delete ${skillPath}: ${message}`, "warning");
        }
      }

      if (deleted.length > 0) {
        printBulletPanel(
          `Deleted (${deleted.length})`,
          deleted,
          "success"
        );
      }

      if (failed.length > 0) {
        printBulletPanel(
          `Failed (${failed.length})`,
          failed.map((f) => `${f.name}: ${f.error}`),
          "warning"
        );
      }

      return;
    }
```

- [ ] **Step 3: Build and verify TypeScript compiles cleanly**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors

- [ ] **Step 4: Smoke test the new menu item**

```bash
node dist/src/bin/ai-tools.js
```

Navigate to "Manage skills" in the menu, press ENTER, and verify the 3-tab wizard launches. Navigate through tabs, select a skill if any are installed, and confirm the flow returns to the terminal after delete.

- [ ] **Step 5: Run full test suite**

```bash
npm run build && node --test dist/test/*.test.js
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/cli.ts
git commit -m "feat(cli): wire manage-skills action to delete selected skills"
```

---

## Self-Review

**Spec coverage:**
- ✅ Both Claude and Codex supported (agent tab)
- ✅ List skills from `~/.{claude|codex}/skills/`
- ✅ Multi-select with SPACE / toggle-all with A
- ✅ Confirm dialog before delete (review tab)
- ✅ Missing/empty dir shows notice, blocks advance
- ✅ Delete failure warns per-skill, continues
- ✅ Back/Cancel return `{ backToMenu: true }`

**Placeholder scan:** None found.

**Type consistency:**
- `resolveSkillsDir(agent: Agent): string` — used in Task 2 and Task 3 ✅
- `readInstalledSkills(dir: string): Promise<string[]>` — used in Task 2 tests and wizard ✅
- `runSkillsWizard()` return type matches Task 3 destructuring ✅
- `Agent` type (`"claude" | "codex"`) consistent throughout ✅
