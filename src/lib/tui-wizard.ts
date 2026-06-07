import type { Agent, InstallLocation, SelectionCatalog } from "./types.js";
import { resolveInstallRoot } from "./install.js";
import {
  canRun,
  createTabbedLayout,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  selectionArray,
  type TabbedLayout
} from "./tui-utils.js";

type WizardTab = "skills" | "locations" | "agents" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface WizardState {
  activeTab: WizardTab;
  selectedSkills: Set<string>;
  selectedGroups: Set<string>;
  selectedLocations: Set<InstallLocation>;
  selectedAgents: Set<Agent>;
  listCursor: Record<WizardTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

interface TabItem {
  id: string;
  label: string;
  description: string;
  kind: WizardTab | "skill";
}

const TAB_ORDER: WizardTab[] = ["skills", "locations", "agents", "review"];

function buildInitialState(): WizardState {
  return {
    activeTab: "skills",
    selectedSkills: new Set(),
    selectedGroups: new Set(),
    selectedLocations: new Set(),
    selectedAgents: new Set(),
    listCursor: {
      skills: 0,
      locations: 0,
      agents: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function currentTabItems(
  state: WizardState,
  selectionCatalog: SelectionCatalog
): TabItem[] {
  if (state.activeTab === "skills") {
    return selectionCatalog.skills.map((skill) => ({
      id: skill.id,
      label: `[Skill] ${skill.label}`,
      description: skill.description,
      kind: "skill" as const
    }));
  }

  if (state.activeTab === "locations") {
    return [
      {
        id: "global",
        label: "global",
        description: "Install into the current user's home directory.",
        kind: "locations"
      },
      {
        id: "local",
        label: "local",
        description: "Install into this project's dot directories.",
        kind: "locations"
      }
    ];
  }

  if (state.activeTab === "agents") {
    return [
      {
        id: "codex",
        label: "codex",
        description: "Install as Codex skills.",
        kind: "agents"
      },
      {
        id: "claude",
        label: "claude",
        description: "Install as Claude custom agents.",
        kind: "agents"
      }
    ];
  }

  return [
    {
      id: "confirm",
      label: "Confirm install",
      description: "Resolve sources and start installation.",
      kind: "review"
    },
    {
      id: "back",
      label: "Back to main menu",
      description: "Leave this installer and return to the main menu.",
      kind: "review"
    },
    {
      id: "cancel",
      label: "Cancel",
      description: "Exit without installing anything.",
      kind: "review"
    }
  ];
}

function isItemSelected(item: TabItem, state: WizardState): boolean {
  if (item.kind === "skill") {
    return state.selectedSkills.has(item.id);
  }

  if (item.kind === "locations") {
    return state.selectedLocations.has(item.id as InstallLocation);
  }

  if (item.kind === "agents") {
    return state.selectedAgents.has(item.id as Agent);
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: WizardState): void {
  if (item.kind === "skill") {
    if (state.selectedSkills.has(item.id)) {
      state.selectedSkills.delete(item.id);
    } else {
      state.selectedSkills.add(item.id);
    }
    return;
  }

  if (item.kind === "locations") {
    const location = item.id as InstallLocation;
    if (state.selectedLocations.has(location)) {
      state.selectedLocations.delete(location);
    } else {
      state.selectedLocations.add(location);
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

  state.reviewAction = item.id as ReviewAction;
}

function renderTabs(state: WizardState): string {
  return TAB_ORDER.map((tab) => {
    const label = tab.charAt(0).toUpperCase() + tab.slice(1);
    return state.activeTab === tab ? `{inverse}${label}{/inverse}` : label;
  }).join("  ");
}

function formatListItem(
  item: TabItem,
  state: WizardState,
  isCursorRow: boolean
): string {
  const cursorPrefix = isCursorRow ? "> " : "  ";
  const wrapCursorRow = (value: string): string =>
    isCursorRow ? `{black-fg}{yellow-bg}${value}{/yellow-bg}{/black-fg}` : value;

  if (item.kind === "review") {
    return wrapCursorRow(`${cursorPrefix}${state.reviewAction === item.id ? "[x]" : "[ ]"} ${item.label}`);
  }

  const checked = isItemSelected(item, state) ? "x" : " ";
  return wrapCursorRow(`${cursorPrefix}[${checked}] ${item.label}`);
}

function renderReviewSummary(state: WizardState, selectionCatalog: SelectionCatalog): string {
  const selectedSkillLabels = selectionCatalog.skills
    .filter((skill) => state.selectedSkills.has(skill.id))
    .map((skill) => skill.label);
  const selectedGroupLabels = selectionCatalog.groups
    .filter((group) => state.selectedGroups.has(group.id))
    .map((group) => group.label);
  const selectedLocations = selectionArray(state.selectedLocations);
  const selectedAgents = selectionArray(state.selectedAgents);

  const lines = [
    "{bold}Selections{/bold}",
    `Skills: ${selectedSkillLabels.length ? selectedSkillLabels.join(", ") : "none"}`,
    `Locations: ${selectedLocations.length ? selectedLocations.join(", ") : "none"}`,
    `Agents: ${selectedAgents.length ? selectedAgents.join(", ") : "none"}`
  ];

  if (selectedGroupLabels.length > 0) {
    lines.splice(2, 0, `Groups: ${selectedGroupLabels.join(", ")}`);
  }

  if (selectedLocations.length > 0 && selectedAgents.length > 0) {
    lines.push("", "{bold}Targets{/bold}");
    for (const agent of selectedAgents) {
      for (const location of selectedLocations) {
        lines.push(`- ${agent} + ${location}: ${resolveInstallRoot({ agent, location, cwd: process.cwd() })}`);
      }
    }
  }

  if (state.notice) {
    lines.push("", `{yellow-fg}${state.notice}{/yellow-fg}`);
  }

  return lines.join("\n");
}

function renderDetailBody(state: WizardState, selectionCatalog: SelectionCatalog): string {
  if (state.activeTab === "review") {
    return renderReviewSummary(state, selectionCatalog);
  }

  const items = currentTabItems(state, selectionCatalog);
  const current = items[state.listCursor[state.activeTab]];
  const lines: string[] = [];

  if (state.notice) {
    lines.push(`{yellow-fg}${state.notice}{/yellow-fg}`, "");
  }

  if (current) {
    lines.push("{bold}Details{/bold}", current.description);
  }

  return lines.join("\n");
}

function renderFooter(state: WizardState): string {
  if (state.activeTab === "review") {
    return "← → switch tab • ↑ ↓ move • enter confirm action • q quit";
  }

  return "← → switch tab • ↑ ↓ move • space/enter toggle • a toggle all • q quit";
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

function moveCursor(state: WizardState, selectionCatalog: SelectionCatalog, delta: number): void {
  const items = currentTabItems(state, selectionCatalog);
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

function toggleCurrentItem(state: WizardState, selectionCatalog: SelectionCatalog): void {
  if (state.activeTab === "review") {
    return;
  }

  const items = currentTabItems(state, selectionCatalog);
  const current = items[state.listCursor[state.activeTab]];
  if (!current) {
    return;
  }

  toggleItem(current, state);
}

function validateBeforeConfirm(state: WizardState): string | null {
  if (state.selectedSkills.size === 0 && state.selectedGroups.size === 0) {
    return "Select at least one skill or group before confirming.";
  }

  if (state.selectedLocations.size === 0) {
    return "Select at least one installation location before confirming.";
  }

  if (state.selectedAgents.size === 0) {
    return "Select at least one agent before confirming.";
  }

  return null;
}

function syncListSelection(
  listBox: TabbedLayout["listBox"],
  state: WizardState,
  selectionCatalog: SelectionCatalog
): void {
  const items = currentTabItems(state, selectionCatalog);
  const maxIndex = Math.max(items.length - 1, 0);
  const cursor = Math.min(state.listCursor[state.activeTab], maxIndex);
  state.listCursor[state.activeTab] = cursor;
  listBox.setItems(items.map((item, index) => formatListItem(item, state, index === cursor)));
  listBox.select(cursor);
  listBox.scrollTo(cursor);
}

export async function runTabbedWizard(
  selectionCatalog: SelectionCatalog,
  headerTitle = "Install agent skills"
): Promise<{
  selectedSkills: string[];
  selectedGroups: string[];
  locations: InstallLocation[];
  agents: Agent[];
} | {
  backToMenu: true;
}> {
  return new Promise((resolve, reject) => {
    const state = buildInitialState();
    let lastTabSwitchAt = 0;
    let lastMoveAt = 0;
    let lastToggleAt = 0;
    const { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox } = createTabbedLayout();

    function cleanup(): void {
      screen.destroy();
    }

    function finishWithError(message: string): void {
      cleanup();
      reject(new Error(message));
    }

    function finishSuccess(): void {
      cleanup();
      resolve({
        selectedSkills: selectionArray(state.selectedSkills),
        selectedGroups: selectionArray(state.selectedGroups),
        locations: selectionArray(state.selectedLocations),
        agents: selectionArray(state.selectedAgents)
      });
    }

    function finishBackToMenu(): void {
      cleanup();
      resolve({
        backToMenu: true
      });
    }

    function render(): void {
      const stepTitle = {
        skills: "Select skills",
        locations: "Select installation locations",
        agents: "Select agents",
        review: "Review selections"
      }[state.activeTab];

      headerBox.setContent(
        renderBannerHeader(headerTitle, "Browse items, move across tabs, and confirm only after review.")
      );
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(`{bold}${stepTitle}{/bold}`);
      syncListSelection(listBox, state, selectionCatalog);
      detailBox.setContent(renderDetailBody(state, selectionCatalog));
      footerBox.setContent(renderFooter(state));
      screen.render();
    }

    function handleToggleOrConfirm(): void {
      if (!canRun(lastToggleAt, DEBOUNCE_SELECT_MS)) {
        return;
      }

      lastToggleAt = Date.now();

      if (state.activeTab === "review") {
        if (state.reviewAction === "back") {
          finishBackToMenu();
          return;
        }

        if (state.reviewAction === "cancel") {
          finishWithError("Installation cancelled.");
          return;
        }

        const validationMessage = validateBeforeConfirm(state);
        if (validationMessage) {
          setNotice(state, validationMessage);
          render();
          return;
        }

        finishSuccess();
        return;
      }

      toggleCurrentItem(state, selectionCatalog);
      render();
    }

    function toggleAllInCurrentTab(): void {
      if (state.activeTab === "review") {
        return;
      }

      const items = currentTabItems(state, selectionCatalog);
      if (items.length === 0) {
        return;
      }

      const allSelected = items.every((item) => isItemSelected(item, state));
      for (const item of items) {
        const selected = isItemSelected(item, state);
        if (allSelected && selected) {
          toggleItem(item, state);
        } else if (!allSelected && !selected) {
          toggleItem(item, state);
        }
      }

      render();
    }

    screen.key(["left"], () => {
      if (!canRun(lastTabSwitchAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastTabSwitchAt = Date.now();
      moveTab(state, -1);
      render();
    });

    screen.key(["right"], () => {
      if (!canRun(lastTabSwitchAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastTabSwitchAt = Date.now();
      moveTab(state, 1);
      render();
    });

    screen.key(["up"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, selectionCatalog, -1);
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, selectionCatalog, 1);
      render();
    });

    screen.key(["space", "enter"], () => {
      handleToggleOrConfirm();
    });

    screen.key(["a"], () => {
      toggleAllInCurrentTab();
    });

    screen.key(["q", "C-c"], () => {
      finishWithError("Installation cancelled.");
    });

    render();
  });
}
