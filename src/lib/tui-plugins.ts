import { buildPluginInstallPlan } from "./plugins.js";
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
import type { Agent, AiPlugin, PluginMode } from "./types.js";

type WizardTab = "plugins" | "agents" | "mode" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface WizardState {
  activeTab: WizardTab;
  selectedPlugins: Set<AiPlugin>;
  selectedAgents: Set<Agent>;
  selectedMode: PluginMode;
  listCursor: Record<WizardTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

interface TabItem {
  id: string;
  label: string;
  description: string;
  kind: WizardTab | "plugin";
}

const TAB_ORDER: WizardTab[] = ["plugins", "agents", "mode", "review"];

function buildInitialState(): WizardState {
  return {
    activeTab: "plugins",
    selectedPlugins: new Set(),
    selectedAgents: new Set(),
    selectedMode: "install",
    listCursor: {
      plugins: 0,
      agents: 0,
      mode: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function currentTabItems(state: WizardState): TabItem[] {
  if (state.activeTab === "plugins") {
    return [{
      id: "lumin",
      label: "◈  Lumin",
      description: "Cross-harness skill plugin for Codex and Claude with explicit commands and auto-apply skill surfaces.",
      kind: "plugin"
    }];
  }

  if (state.activeTab === "agents") {
    return [
      {
        id: "codex",
        label: "◇  Codex",
        description: "Install the Codex-side plugin and global auto skill surface in the user home directory.",
        kind: "agents"
      },
      {
        id: "claude",
        label: "◇  Claude",
        description: "Install Claude slash commands and namespaced host skills in the user home directory.",
        kind: "agents"
      }
    ];
  }

  if (state.activeTab === "mode") {
    return [
      {
        id: "install",
        label: "▶  Install",
        description: "Install the selected plugins.",
        kind: "mode"
      },
      {
        id: "uninstall",
        label: "←  Uninstall",
        description: "Remove the selected plugins safely.",
        kind: "mode"
      }
    ];
  }

  return [
    {
      id: "confirm",
      label: `✓  Confirm ${state.selectedMode}`,
      description: "Run the planned plugin actions.",
      kind: "review"
    },
    {
      id: "back",
      label: "←  Back to main menu",
      description: "Leave this installer and return to the main menu.",
      kind: "review"
    },
    {
      id: "cancel",
      label: "✕  Cancel",
      description: "Exit without changing plugins.",
      kind: "review"
    }
  ];
}

function isItemSelected(item: TabItem, state: WizardState): boolean {
  if (item.kind === "plugin") {
    return state.selectedPlugins.has(item.id as AiPlugin);
  }

  if (item.kind === "agents") {
    return state.selectedAgents.has(item.id as Agent);
  }

  if (item.kind === "mode") {
    return state.selectedMode === item.id;
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: WizardState): void {
  if (item.kind === "plugin") {
    if (state.selectedPlugins.has(item.id as AiPlugin)) {
      state.selectedPlugins.delete(item.id as AiPlugin);
    } else {
      state.selectedPlugins.add(item.id as AiPlugin);
    }
    return;
  }

  if (item.kind === "agents") {
    const agent = item.id as Agent;
    if (state.selectedAgents.has(agent)) {
      state.selectedAgents.delete(agent);
    } else {
      state.selectedAgents.add(agent);
    }
    return;
  }

  if (item.kind === "mode") {
    state.selectedMode = item.id as PluginMode;
    return;
  }

  state.reviewAction = item.id as ReviewAction;
}

function renderTabs(state: WizardState): string {
  const counts = {
    plugins: state.selectedPlugins.size,
    agents: state.selectedAgents.size,
    mode: 1,
    review: state.reviewAction === "confirm" ? 1 : 0
  };

  return renderTabBar(TAB_ORDER.map((tab, index) => ({
    label: `${index + 1}. ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
    meta: tab === "review" ? "ready" : `${counts[tab]} selected`,
    active: state.activeTab === tab
  })));
}

function formatListItem(item: TabItem, state: WizardState, isCursorRow: boolean, index: number): string {
  if (item.kind === "review") {
    return renderListRow({
      active: isCursorRow,
      selected: state.reviewAction === item.id,
      label: item.label,
      index
    });
  }

  return renderListRow({
    active: isCursorRow,
    selected: isItemSelected(item, state),
    label: item.label,
    index
  });
}

function renderReviewSummary(state: WizardState): string {
  const selectedPlugins = selectionArray(state.selectedPlugins);
  const selectedAgents = selectionArray(state.selectedAgents);
  const sep = `{cyan-fg}${"─".repeat(50)}{/cyan-fg}`;
  const none = "{gray-fg}none{/gray-fg}";
  const lines = [
    `{bold}{white-fg}◈ Summary{/white-fg}{/bold}`,
    sep,
    `{cyan-fg}◆ Plugins{/cyan-fg} ${selectedPlugins.length ? selectedPlugins.join(", ") : none}`,
    `{cyan-fg}◆ Agents{/cyan-fg}  ${selectedAgents.length ? selectedAgents.join(", ") : none}`,
    `{cyan-fg}◆ Install{/cyan-fg} global`,
    `{cyan-fg}◆ Mode{/cyan-fg}    ${state.selectedMode}`
  ];

  if (selectedPlugins.length > 0 && selectedAgents.length > 0) {
    try {
      const plan = buildPluginInstallPlan({
        mode: state.selectedMode,
        agents: selectedAgents,
        plugins: selectedPlugins,
        sourceBranch: "plugins"
      });

      lines.push("", sep, `{bold}{white-fg}⊕ Planned steps{/white-fg}{/bold}`);
      for (const step of plan.steps) {
        lines.push(`  {gray-fg}▶{/gray-fg} ${step.title}`);
      }

      if (plan.notes.length > 0) {
        lines.push("", `{bold}{white-fg}◎ Notes{/white-fg}{/bold}`);
        for (const note of plan.notes) {
          lines.push(`  {gray-fg}·{/gray-fg} ${note}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lines.push("", `{yellow-fg}${message}{/yellow-fg}`);
    }
  }

  if (state.notice) {
    lines.push("", `{yellow-fg}${state.notice}{/yellow-fg}`);
  }

  return lines.join("\n");
}

function renderDetailBody(state: WizardState): string {
  if (state.activeTab === "review") {
    return renderReviewSummary(state);
  }

  const items = currentTabItems(state);
  const current = items[state.listCursor[state.activeTab]];
  const lines: string[] = [];

  if (state.notice) {
    lines.push(`{yellow-fg}${state.notice}{/yellow-fg}`, "");
  }

  if (current) {
    const selectedCount = items.filter((item) => isItemSelected(item, state)).length;
    lines.push(
      `{cyan-fg}◆ ${selectedCount} of ${items.length} selected{/cyan-fg}`,
      `{gray-fg}${"─".repeat(40)}{/gray-fg}`,
      `{bold}{white-fg}${current.label}{/white-fg}{/bold}`,
      `{gray-fg}${current.description}{/gray-fg}`
    );
  }

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

  return renderKeycaps([
    { key: "LEFT/RIGHT", label: "switch tab" },
    { key: "UP/DOWN", label: "move" },
    { key: "SPACE", label: "toggle" },
    { key: "A", label: "toggle all" },
    { key: "Q", label: "quit" }
  ]);
}

function setNotice(state: WizardState, message: string): void {
  state.notice = message;
}

function moveTab(state: WizardState, delta: number): void {
  const index = TAB_ORDER.indexOf(state.activeTab);
  const nextIndex = (index + delta + TAB_ORDER.length) % TAB_ORDER.length;
  state.activeTab = TAB_ORDER[nextIndex];
  state.notice = "";
}

function moveCursor(state: WizardState, delta: number): void {
  const items = currentTabItems(state);
  if (items.length === 0) {
    return;
  }

  const current = state.listCursor[state.activeTab];
  const next = (current + delta + items.length) % items.length;
  state.listCursor[state.activeTab] = next;

  if (state.activeTab === "review") {
    state.reviewAction = items[next]?.id as ReviewAction;
  }
}

function toggleCurrentItem(state: WizardState): void {
  if (state.activeTab === "review") {
    return;
  }

  const items = currentTabItems(state);
  const current = items[state.listCursor[state.activeTab]];
  if (!current) {
    return;
  }

  toggleItem(current, state);
}

function toggleAllItems(state: WizardState): void {
  if (state.activeTab !== "plugins" && state.activeTab !== "agents") {
    return;
  }

  const items = currentTabItems(state);

  if (state.activeTab === "plugins") {
    const allSelected = items.every((item) => state.selectedPlugins.has(item.id as AiPlugin));
    state.selectedPlugins.clear();
    if (!allSelected) {
      for (const item of items) {
        state.selectedPlugins.add(item.id as AiPlugin);
      }
    }
    return;
  }

  const allSelected = items.every((item) => state.selectedAgents.has(item.id as Agent));
  state.selectedAgents.clear();
  if (!allSelected) {
    for (const item of items) {
      state.selectedAgents.add(item.id as Agent);
    }
  }
}

function validateReview(state: WizardState): ReviewAction | null {
  if (state.reviewAction !== "confirm") {
    return state.reviewAction;
  }

  if (state.selectedPlugins.size === 0) {
    setNotice(state, "Select at least one plugin before continuing.");
    return null;
  }

  if (state.selectedAgents.size === 0) {
    setNotice(state, "Select at least one agent before continuing.");
    return null;
  }

  return "confirm";
}

export async function runPluginWizard(): Promise<
  | {
    plugins: AiPlugin[];
    agents: Agent[];
    mode: PluginMode;
  }
  | { backToMenu: true }
> {
  const state = buildInitialState();
  const { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox } = createTabbedLayout() as TabbedLayout;

  let lastMoveAt = 0;
  let lastSelectAt = 0;

  return await new Promise((resolve) => {
    function cleanup(): void {
      screen.destroy();
    }

    function render(): void {
      const items = currentTabItems(state);
      const cursor = state.listCursor[state.activeTab];
      const detail = renderDetailBody(state);
      const renderedItems = items.map((item, index) => formatListItem(item, state, index === cursor, index));

      headerBox.setContent(renderBannerHeader(
        "Install plugin",
        "Install or remove shared plugins such as Lumin.",
        [
          { label: `${state.selectedPlugins.size} plugins`, tone: "accent" },
          { label: `${state.selectedAgents.size} agents`, tone: "muted" },
          { label: `${state.selectedMode}`, tone: "success" }
        ]
      ));
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(renderStepSummary({
        step: `${TAB_ORDER.indexOf(state.activeTab) + 1}/${TAB_ORDER.length}`,
        title: state.activeTab === "review" ? "Review" : "Details",
        description: "Choose plugin options and confirm the execution plan."
      }));
      renderListContent(listBox, renderedItems, cursor);
      detailBox.setContent(detail);
      footerBox.setContent(renderFooter(state));
      screen.render();
    }

    screen.key(["left"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveTab(state, -1);
      render();
    });

    screen.key(["right"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveTab(state, 1);
      render();
    });

    screen.key(["up"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, -1);
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, 1);
      render();
    });

    screen.key(["space"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastSelectAt = Date.now();
      toggleCurrentItem(state);
      render();
    });

    screen.key(["a"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastSelectAt = Date.now();
      toggleAllItems(state);
      render();
    });

    screen.key(["enter"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastSelectAt = Date.now();

      if (state.activeTab !== "review") {
        moveTab(state, 1);
        render();
        return;
      }

      const action = validateReview(state);
      if (!action) {
        render();
        return;
      }

      cleanup();
      if (action === "back") {
        resolve({ backToMenu: true });
        return;
      }

      if (action === "cancel") {
        process.exitCode = 1;
        resolve({ backToMenu: true });
        return;
      }

      resolve({
        plugins: selectionArray(state.selectedPlugins),
        agents: selectionArray(state.selectedAgents),
        mode: state.selectedMode
      });
    });

    screen.key(["q", "escape", "C-c"], () => {
      cleanup();
      resolve({ backToMenu: true });
    });

    render();
  });
}
