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
    lines.push(`{cyan-fg}◆ Select the agent whose skills you want to manage.{/cyan-fg}`);
    return lines.join("\n");
  }

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

function buildListItems(state: WizardState): string[] {
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

    function render(): void {
      const items = buildListItems(state);
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
        title: state.activeTab === "review"
          ? "Review"
          : state.activeTab.charAt(0).toUpperCase() + state.activeTab.slice(1),
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
