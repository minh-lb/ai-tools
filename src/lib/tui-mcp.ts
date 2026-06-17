import { buildMcpInstallPlan } from "./mcp.js";
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
import type { Agent, McpMode, McpServer, SupportedOs } from "./types.js";

type WizardTab = "servers" | "agent" | "mode" | "os" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface WizardState {
  activeTab: WizardTab;
  selectedServers: Set<McpServer>;
  selectedAgents: Set<Agent>;
  selectedMode: McpMode;
  selectedOs: SupportedOs;
  listCursor: Record<WizardTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

interface TabItem {
  id: string;
  label: string;
  description: string;
  kind: WizardTab | "server";
}

const TAB_ORDER: WizardTab[] = ["servers", "agent", "mode", "os", "review"];

function buildInitialState(): WizardState {
  return {
    activeTab: "servers",
    selectedServers: new Set(),
    selectedAgents: new Set(),
    selectedMode: "install",
    selectedOs: process.platform === "darwin" ? "mac" : "linux",
    listCursor: {
      servers: 0,
      agent: 0,
      mode: 0,
      os: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function currentTabItems(state: WizardState): TabItem[] {
  if (state.activeTab === "servers") {
    return [
      {
        id: "antd",
        label: "Ant Design",
        description: "Official Ant Design MCP server exposed by `@ant-design/cli`.",
        kind: "server"
      },
      {
        id: "gitlab",
        label: "GitLab",
        description: "GitLab.com MCP endpoint with OAuth-based authorization.",
        kind: "server"
      },
      {
        id: "github",
        label: "GitHub",
        description: "GitHub's hosted MCP server using PAT-based access.",
        kind: "server"
      },
      {
        id: "figma",
        label: "Figma",
        description: "Figma's remote MCP server for design context and write-back workflows.",
        kind: "server"
      },
      {
        id: "shadcn",
        label: "Shadcn",
        description: "Shadcn/ui registry MCP server for browsing, searching, and installing components.",
        kind: "server"
      }
    ];
  }

  if (state.activeTab === "agent") {
    return [
      {
        id: "codex",
        label: "Codex",
        description: "Configure the selected MCP servers for OpenAI Codex.",
        kind: "agent"
      },
      {
        id: "claude",
        label: "Claude",
        description: "Configure the selected MCP servers for Claude Code.",
        kind: "agent"
      }
    ];
  }

  if (state.activeTab === "mode") {
    return [
      {
        id: "install",
        label: "Install",
        description: "Add or register the selected MCP servers in the chosen agent.",
        kind: "mode"
      },
      {
        id: "uninstall",
        label: "Uninstall",
        description: "Remove the selected MCP server entries from the chosen agent.",
        kind: "mode"
      }
    ];
  }

  if (state.activeTab === "os") {
    return [
      {
        id: "mac",
        label: "MacOS",
        description: "Apple macOS (darwin). Homebrew-based paths and macOS shell profiles apply.",
        kind: "os"
      },
      {
        id: "linux",
        label: "Linux",
        description: "Linux distributions. Standard XDG paths and bash/zsh shell profiles apply.",
        kind: "os"
      }
    ];
  }

  return [
    {
      id: "confirm",
      label: state.selectedMode === "install" ? "Confirm install" : "Confirm uninstall",
      description: "Run the planned MCP commands.",
      kind: "review"
    },
    {
      id: "back",
      label: "Back to main menu",
      description: "Leave this workflow and return to the main menu.",
      kind: "review"
    },
    {
      id: "cancel",
      label: "Cancel",
      description: "Exit without changing MCP configuration.",
      kind: "review"
    }
  ];
}

function isItemSelected(item: TabItem, state: WizardState): boolean {
  if (item.kind === "server") {
    return state.selectedServers.has(item.id as McpServer);
  }

  if (item.kind === "agent") {
    return state.selectedAgents.has(item.id as Agent);
  }

  if (item.kind === "mode") {
    return state.selectedMode === item.id;
  }

  if (item.kind === "os") {
    return state.selectedOs === item.id;
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: WizardState): void {
  if (item.kind === "server") {
    const server = item.id as McpServer;
    if (state.selectedServers.has(server)) {
      state.selectedServers.delete(server);
    } else {
      state.selectedServers.add(server);
    }
    return;
  }

  if (item.kind === "agent") {
    const agent = item.id as Agent;
    if (state.selectedAgents.has(agent)) {
      state.selectedAgents.delete(agent);
    } else {
      state.selectedAgents.add(agent);
    }
    return;
  }

  if (item.kind === "mode") {
    state.selectedMode = item.id as McpMode;
    return;
  }

  if (item.kind === "os") {
    state.selectedOs = item.id as SupportedOs;
    return;
  }

  state.reviewAction = item.id as ReviewAction;
}

function renderTabs(state: WizardState): string {
  const counts = {
    servers: state.selectedServers.size,
    agent: state.selectedAgents.size,
    mode: 1,
    os: 1,
    review: state.reviewAction === "confirm" ? 1 : 0
  };

  const TAB_LABELS: Record<WizardTab, string> = {
    servers: "Select MCP",
    agent: "Agent",
    mode: "Mode",
    os: "OS",
    review: "Review"
  };

  return renderTabBar(TAB_ORDER.map((tab, index) => ({
    label: `${index + 1}. ${TAB_LABELS[tab]}`,
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
  const selectedServers = selectionArray(state.selectedServers);
  const selectedAgents = selectionArray(state.selectedAgents);
  const lines = [
    "{bold}Selections{/bold}",
    `MCPs    ${selectedServers.length ? selectedServers.join(", ") : "none"}`,
    `Agents  ${selectedAgents.length ? selectedAgents.join(", ") : "none"}`,
    `Mode    ${state.selectedMode}`,
    `OS      ${state.selectedOs === "mac" ? "MacOS" : "Linux"}`
  ];

  if (selectedServers.length > 0 && selectedAgents.length > 0) {
    const plan = buildMcpInstallPlan({
      mode: state.selectedMode,
      agents: selectedAgents,
      servers: selectedServers,
      os: state.selectedOs
    });

    lines.push("", "{bold}Planned steps{/bold}");
    for (const step of plan.steps) {
      lines.push(`- ${step.title}: ${step.command}`);
    }

    if (plan.notes.length > 0) {
      lines.push("", "{bold}Notes{/bold}");
      for (const note of plan.notes) {
        lines.push(`- ${note}`);
      }
    }

    if (plan.postInstallConfig.length > 0) {
      lines.push("", "{bold}After install{/bold}");
      for (const item of plan.postInstallConfig) {
        lines.push(`- ${item}`);
      }
    }

    if (plan.sources.length > 0) {
      lines.push("", "{bold}Sources{/bold}");
      for (const source of plan.sources) {
        lines.push(`- ${source.label}: ${source.url}`);
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
  if (state.selectedServers.size === 0) {
    return "Select at least one MCP server before confirming.";
  }

  if (state.selectedAgents.size === 0) {
    return "Select at least one agent before confirming.";
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

export async function runMcpWizard(): Promise<{
  servers: McpServer[];
  agents: Agent[];
  mode: McpMode;
  os: SupportedOs;
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
      if (state.selectedAgents.size === 0) {
        finishWithError("Missing agent selection.");
        return;
      }

      cleanup();
      resolve({
        servers: selectionArray(state.selectedServers),
        agents: selectionArray(state.selectedAgents),
        mode: state.selectedMode,
        os: state.selectedOs
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
        servers: "Select MCP servers",
        agent: "Select agent",
        mode: "Select mode",
        os: "Select OS",
        review: "Review selections"
      }[state.activeTab];
      const stepDescription = {
        servers: "Choose one or more MCP servers to register or remove.",
        agent: "Choose one or both agent targets for the MCP configuration.",
        mode: "Choose whether this workflow installs or uninstalls the selected MCP servers.",
        os: "Choose the operating system where the MCP servers will be configured.",
        review: "Verify the generated MCP commands and source links before execution."
      }[state.activeTab];
      const stepStatus = {
        servers: `${state.selectedServers.size} selected`,
        agent: `${state.selectedAgents.size} selected`,
        mode: state.selectedMode,
        os: state.selectedOs === "mac" ? "MacOS" : "Linux",
        review: state.notice || "Ready for confirmation"
      }[state.activeTab];

      headerBox.setContent(
        renderBannerHeader(
          "Install mcp",
          "Plan and run MCP add/remove commands based on current official docs.",
          [
            { label: `${state.selectedServers.size} MCPs`, tone: "accent" },
            { label: `${state.selectedAgents.size} agents`, tone: "success" },
            { label: state.selectedMode, tone: "muted" },
            { label: "Internet-verified", tone: "muted" }
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
          finishWithError("MCP workflow cancelled.");
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

      if (state.activeTab === "mode") {
        const current = items[state.listCursor.mode];
        if (current) {
          state.selectedMode = current.id as McpMode;
          render();
        }
        return;
      }

      if (state.activeTab === "os") {
        const current = items[state.listCursor.os];
        if (current) {
          state.selectedOs = current.id as SupportedOs;
          render();
        }
        return;
      }

      const allSelected = items.every((item) => isItemSelected(item, state));
      for (const item of items) {
        if (allSelected === isItemSelected(item, state)) {
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

    screen.key(["space", "enter"], () => {
      handleToggleOrConfirm();
    });

    screen.key(["a"], () => {
      toggleAllInCurrentTab();
    });

    screen.key(["q", "C-c"], () => {
      finishWithError("MCP workflow cancelled.");
    });

    render();
  });
}
