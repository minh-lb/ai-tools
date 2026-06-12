import { buildLibInstallPlan, detectSupportedHostOs } from "./ai-libs.js";
import {
  canRun,
  createTabbedLayout,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  renderKeycaps,
  renderListRow,
  renderStepSummary,
  renderTabBar,
  selectionArray,
  type TabbedLayout
} from "./tui-utils.js";
import type { Agent, AiLibrary, InstallScope, LibraryMode, SupportedOs } from "./types.js";

type WizardTab = "libraries" | "agents" | "os" | "scope" | "mode" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface WizardState {
  activeTab: WizardTab;
  selectedLibraries: Set<AiLibrary>;
  selectedAgents: Set<Agent>;
  selectedOs: SupportedOs | null;
  selectedScope: InstallScope;
  selectedMode: LibraryMode;
  listCursor: Record<WizardTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

interface TabItem {
  id: string;
  label: string;
  description: string;
  kind: WizardTab | "library";
}

const TAB_ORDER: WizardTab[] = ["libraries", "agents", "os", "scope", "mode", "review"];

function buildInitialState(): WizardState {
  return {
    activeTab: "libraries",
    selectedLibraries: new Set(),
    selectedAgents: new Set(),
    selectedOs: detectSupportedHostOs(),
    selectedScope: "global",
    selectedMode: "install",
    listCursor: {
      libraries: 0,
      agents: 0,
      os: 0,
      scope: 0,
      mode: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function currentTabItems(state: WizardState): TabItem[] {
  if (state.activeTab === "libraries") {
    return [
      {
        id: "rtk",
        label: "Install rtk-ai/rtk",
        description: "Token-saving CLI proxy with agent-specific init for Codex and Claude.",
        kind: "library"
      },
      {
        id: "icm",
        label: "Install rtk-ai/icm",
        description: "Persistent agent memory with MCP, CLI instructions, rules, and hooks.",
        kind: "library"
      }
    ];
  }

  if (state.activeTab === "agents") {
    return [
      {
        id: "codex",
        label: "codex",
        description: "Configure the OpenAI Codex integration paths when supported upstream.",
        kind: "agents"
      },
      {
        id: "claude",
        label: "claude",
        description: "Configure the Claude integration paths when supported upstream.",
        kind: "agents"
      }
    ];
  }

  if (state.activeTab === "os") {
    return [
      {
        id: "mac",
        label: "mac",
        description: "Run the install flow for a macOS host.",
        kind: "os"
      },
      {
        id: "linux",
        label: "linux",
        description: "Run the install flow for a Linux host.",
        kind: "os"
      }
    ];
  }

  if (state.activeTab === "scope") {
    return [
      {
        id: "global",
        label: "global",
        description: "Use global agent configuration in home-directory tool config files.",
        kind: "scope"
      },
      {
        id: "local",
        label: "local",
        description: "Use project-scoped setup where the upstream library supports it.",
        kind: "scope"
      }
    ];
  }

  if (state.activeTab === "mode") {
    return [
      {
        id: "install",
        label: "Install",
        description: "Install the selected libraries and configure the chosen integrations.",
        kind: "mode"
      },
      {
        id: "uninstall",
        label: "Uninstall",
        description: "Remove library-managed integrations safely and clean up only library-specific artifacts.",
        kind: "mode"
      }
    ];
  }

  return [
    {
      id: "confirm",
      label: "Confirm install",
      description: "Run the planned install and configuration commands.",
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
  if (item.kind === "library") {
    return state.selectedLibraries.has(item.id as AiLibrary);
  }

  if (item.kind === "agents") {
    return state.selectedAgents.has(item.id as Agent);
  }

  if (item.kind === "os") {
    return state.selectedOs === item.id;
  }

  if (item.kind === "scope") {
    return state.selectedScope === item.id;
  }

  if (item.kind === "mode") {
    return state.selectedMode === item.id;
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: WizardState): void {
  if (item.kind === "library") {
    if (state.selectedLibraries.has(item.id as AiLibrary)) {
      state.selectedLibraries.delete(item.id as AiLibrary);
    } else {
      state.selectedLibraries.add(item.id as AiLibrary);
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

  if (item.kind === "os") {
    state.selectedOs = item.id as SupportedOs;
    return;
  }

  if (item.kind === "scope") {
    state.selectedScope = item.id as InstallScope;
    return;
  }

  if (item.kind === "mode") {
    state.selectedMode = item.id as LibraryMode;
    return;
  }

  state.reviewAction = item.id as ReviewAction;
}

function renderTabs(state: WizardState): string {
  const counts = {
    libraries: state.selectedLibraries.size,
    agents: state.selectedAgents.size,
    os: state.selectedOs ? 1 : 0,
    scope: 1,
    mode: 1,
    review: state.reviewAction === "confirm" ? 1 : 0
  };

  return renderTabBar(TAB_ORDER.map((tab, index) => ({
    label: `${index + 1}. ${tab === "os" ? "OS" : tab.charAt(0).toUpperCase() + tab.slice(1)}`,
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
      meta: item.description,
      index
    });
  }

  return renderListRow({
    active: isCursorRow,
    selected: isItemSelected(item, state),
    label: item.label,
    meta: item.description,
    index
  });
}

function renderReviewSummary(state: WizardState): string {
  const selectedLibraries = selectionArray(state.selectedLibraries);
  const selectedAgents = selectionArray(state.selectedAgents);
  const lines = [
    "{bold}Selections{/bold}",
    `Libraries  ${selectedLibraries.length ? selectedLibraries.join(", ") : "none"}`,
    `Agents     ${selectedAgents.length ? selectedAgents.join(", ") : "none"}`,
    `OS         ${state.selectedOs ?? "none"}`,
    `Scope      ${state.selectedScope}`,
    `Mode       ${state.selectedMode}`
  ];

  if (selectedLibraries.length > 0 && selectedAgents.length > 0 && state.selectedOs) {
    const plan = buildLibInstallPlan({
      mode: state.selectedMode,
      os: state.selectedOs,
      scope: state.selectedScope,
      agents: selectedAgents,
      libraries: selectedLibraries
    });

    lines.push("", "{bold}Planned steps{/bold}");
    for (const step of plan.steps) {
      lines.push(`- ${step.title}`);
    }

    if (plan.notes.length > 0) {
      lines.push("", "{bold}Notes{/bold}");
      for (const note of plan.notes) {
        lines.push(`- ${note}`);
      }
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
      "{bold}Selected in this step{/bold}",
      `${selectedCount} of ${items.length}`,
      "",
      "{bold}About current item{/bold}",
      current.description
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

function validateBeforeConfirm(state: WizardState): string | null {
  if (state.selectedLibraries.size === 0) {
    return "Select at least one library before confirming.";
  }

  if (state.selectedAgents.size === 0) {
    return "Select at least one agent before confirming.";
  }

  if (!state.selectedOs) {
    return "Select one OS target before confirming.";
  }

  if (!state.selectedScope) {
    return "Select one scope before confirming.";
  }

  if (!state.selectedMode) {
    return "Select one mode before confirming.";
  }

  return null;
}

function syncListSelection(
  listBox: TabbedLayout["listBox"],
  state: WizardState
): void {
  const items = currentTabItems(state);
  const maxIndex = Math.max(items.length - 1, 0);
  const cursor = Math.min(state.listCursor[state.activeTab], maxIndex);
  state.listCursor[state.activeTab] = cursor;
  listBox.setItems(items.map((item, index) => formatListItem(item, state, index === cursor, index)));
  listBox.select(cursor);
  listBox.scrollTo(cursor);
}

export async function runAiLibsWizard(): Promise<{
  libraries: AiLibrary[];
  agents: Agent[];
  os: SupportedOs;
  scope: InstallScope;
  mode: LibraryMode;
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
      if (!state.selectedOs) {
        finishWithError("Missing OS selection.");
        return;
      }

      cleanup();
      resolve({
        libraries: selectionArray(state.selectedLibraries),
        agents: selectionArray(state.selectedAgents),
        os: state.selectedOs,
        scope: state.selectedScope,
        mode: state.selectedMode
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
        libraries: "Select libraries",
        agents: "Select agents",
        os: "Select OS",
        scope: "Select scope",
        mode: "Select mode",
        review: "Review selections"
      }[state.activeTab];
      const stepDescription = {
        libraries: "Choose one or both upstream AI libraries to install.",
        agents: "Pick which agent integrations should be configured.",
        os: "Choose the current host OS for sanity checking before install.",
        scope: "Choose whether setup should target global config or project-local files.",
        mode: "Choose whether to install or uninstall the selected libraries.",
        review: "Verify selections before shell commands are executed."
      }[state.activeTab];
      const stepStatus = {
        libraries: `${state.selectedLibraries.size} selected`,
        agents: `${state.selectedAgents.size} selected`,
        os: state.selectedOs ?? "none selected",
        scope: state.selectedScope,
        mode: state.selectedMode,
        review: state.notice || "Ready for confirmation"
      }[state.activeTab];

      headerBox.setContent(
        renderBannerHeader(
          "Install libs for AI",
          "Run upstream installers and init commands for RTK and ICM.",
          [
            { label: `${state.selectedLibraries.size} libraries`, tone: "accent" },
            { label: `${state.selectedAgents.size} agents`, tone: "success" },
            { label: state.selectedOs ?? "OS pending", tone: "muted" },
            { label: state.selectedScope, tone: "muted" },
            { label: state.selectedMode, tone: "muted" }
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
      syncListSelection(listBox, state);
      detailBox.setContent(renderDetailBody(state));
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

      toggleCurrentItem(state);
      render();
    }

    function toggleAllInCurrentTab(): void {
      if (state.activeTab === "review") {
        return;
      }

      const items = currentTabItems(state);
      if (items.length === 0) {
        return;
      }

      if (state.activeTab === "os" || state.activeTab === "scope" || state.activeTab === "mode") {
        const cursor = state.listCursor[state.activeTab];
        const current = items[cursor];
        if (current && state.activeTab === "os") {
          state.selectedOs = current.id as SupportedOs;
          render();
        }
        if (current && state.activeTab === "scope") {
          state.selectedScope = current.id as InstallScope;
          render();
        }
        if (current && state.activeTab === "mode") {
          state.selectedMode = current.id as LibraryMode;
          render();
        }
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

    screen.key(["right", "tab"], () => {
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

    screen.key(["space"], handleToggleOrConfirm);
    screen.key(["enter"], handleToggleOrConfirm);
    screen.key(["a"], () => {
      if (!canRun(lastToggleAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastToggleAt = Date.now();
      toggleAllInCurrentTab();
    });

    screen.key(["q", "escape", "C-c"], () => {
      cleanup();
      reject(new Error("Installation cancelled."));
    });

    render();
  });
}
