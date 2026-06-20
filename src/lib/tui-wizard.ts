import type { Agent, InstallLocation, SelectionCatalog } from "./types.js";
import { resolveInstallRoot } from "./install.js";
import {
  canRun,
  createTabbedLayout,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  renderKeycaps,
  renderListRow,
  renderListContent,
  renderStepSummary,
  renderTabBar,
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
      label: `◈  ${skill.label}`,
      description: skill.description,
      kind: "skill" as const
    }));
  }

  if (state.activeTab === "locations") {
    return [
      {
        id: "global",
        label: "⊙  Global",
        description: "Install into the current user's home directory (~/.claude / ~/.codex).",
        kind: "locations"
      },
      {
        id: "local",
        label: "⊕  Local",
        description: "Install into this project's dot directories (.claude / .codex).",
        kind: "locations"
      }
    ];
  }

  if (state.activeTab === "agents") {
    return [
      {
        id: "codex",
        label: "◇  Codex",
        description: "Install as Codex skills.",
        kind: "agents"
      },
      {
        id: "claude",
        label: "◇  Claude",
        description: "Install as Claude custom agents.",
        kind: "agents"
      }
    ];
  }

  return [
    {
      id: "confirm",
      label: "✓  Confirm install",
      description: "Resolve sources and start installation.",
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
  const counts = {
    skills: state.selectedSkills.size + state.selectedGroups.size,
    locations: state.selectedLocations.size,
    agents: state.selectedAgents.size,
    review: state.reviewAction === "confirm" ? 1 : 0
  };

  return renderTabBar(TAB_ORDER.map((tab, index) => ({
    label: `${index + 1}. ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
    meta: tab === "review" ? "ready" : `${counts[tab]} selected`,
    active: state.activeTab === tab
  })));
}

function formatListItem(
  item: TabItem,
  state: WizardState,
  isCursorRow: boolean,
  index: number
): string {
  if (item.kind === "review") {
    return renderListRow({
      active: isCursorRow,
      selected: state.reviewAction === item.id,
      label: item.label,
      description: item.description,
      index
    });
  }

  return renderListRow({
    active: isCursorRow,
    selected: isItemSelected(item, state),
    label: item.label,
    description: item.description,
    index
  });
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

  const sep = `{cyan-fg}${"─".repeat(50)}{/cyan-fg}`;
  const none = "{gray-fg}none{/gray-fg}";

  const lines = [
    `{bold}{white-fg}◈ Summary{/white-fg}{/bold}`,
    sep,
    `{cyan-fg}◆ Skills{/cyan-fg}    ${selectedSkillLabels.length ? selectedSkillLabels.join(", ") : none}`,
    `{cyan-fg}◆ Locations{/cyan-fg} ${selectedLocations.length ? selectedLocations.join(", ") : none}`,
    `{cyan-fg}◆ Agents{/cyan-fg}    ${selectedAgents.length ? selectedAgents.join(", ") : none}`
  ];

  if (selectedGroupLabels.length > 0) {
    lines.splice(3, 0, `{cyan-fg}◆ Groups{/cyan-fg}    ${selectedGroupLabels.join(", ")}`);
  }

  if (selectedLocations.length > 0 && selectedAgents.length > 0) {
    lines.push("", sep, `{bold}{white-fg}⊕ Resolved targets{/white-fg}{/bold}`);
    for (const agent of selectedAgents) {
      for (const location of selectedLocations) {
        lines.push(`  {gray-fg}▶{/gray-fg} ${agent} + ${location}  {gray-fg}${resolveInstallRoot({ agent, location, cwd: process.cwd() })}{/gray-fg}`);
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
  const rendered = items.map((item, index) => formatListItem(item, state, index === cursor, index));
  renderListContent(listBox, rendered, cursor);
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
      const currentStep = TAB_ORDER.indexOf(state.activeTab) + 1;
      const stepTitle = {
        skills: "Select skills",
        locations: "Select installation locations",
        agents: "Select agents",
        review: "Review selections"
      }[state.activeTab];
      const stepDescription = {
        skills: "Choose the skills you want to install.",
        locations: "Pick where the installer should place the files.",
        agents: "Pick which agent format should be generated.",
        review: "Verify selections before writing anything to disk."
      }[state.activeTab];
      const stepStatus = {
        skills: `${state.selectedSkills.size + state.selectedGroups.size} selected`,
        locations: `${state.selectedLocations.size} selected`,
        agents: `${state.selectedAgents.size} selected`,
        review: state.notice || "Ready for confirmation"
      }[state.activeTab];

      headerBox.setContent(
        renderBannerHeader(
          headerTitle,
          "Browse items, move across tabs, and confirm only after review.",
          [
            { label: `${state.selectedSkills.size + state.selectedGroups.size} skills`, tone: "accent" },
            { label: `${state.selectedLocations.size} locations`, tone: "muted" },
            { label: `${state.selectedAgents.size} agents`, tone: "success" }
          ]
        )
      );
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(renderStepSummary({
        step: `STEP ${currentStep}/${TAB_ORDER.length}`,
        title: stepTitle,
        description: stepDescription,
        status: stepStatus
      }));
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
