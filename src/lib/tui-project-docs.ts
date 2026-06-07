import type { ProjectDocsCatalog, ProjectDocsSkill } from "./types.js";
import {
  canRun,
  createTabbedLayout,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  type TabbedLayout
} from "./tui-utils.js";

type ProjectDocsTab = "skills" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface ProjectDocsState {
  activeTab: ProjectDocsTab;
  selectedSkills: Set<string>;
  listCursor: Record<ProjectDocsTab, number>;
  reviewAction: ReviewAction;
  notice: string;
}

interface TabItem {
  id: string;
  label: string;
  description: string;
  kind: ProjectDocsTab;
}

const TAB_ORDER: ProjectDocsTab[] = ["skills", "review"];

function buildInitialState(): ProjectDocsState {
  return {
    activeTab: "skills",
    selectedSkills: new Set<string>(),
    listCursor: {
      skills: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function currentTabItems(state: ProjectDocsState, catalog: ProjectDocsCatalog): TabItem[] {
  if (state.activeTab === "skills") {
    return catalog.skills.map((skill) => ({
      id: skill.id,
      label: skill.label,
      description: skill.description,
      kind: "skills" as const
    }));
  }

  return [
    {
      id: "confirm",
      label: "Confirm install",
      description: "Continue with the selected skills.",
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

function renderTabs(state: ProjectDocsState): string {
  return TAB_ORDER.map((tab) => {
    const label = tab.charAt(0).toUpperCase() + tab.slice(1);
    return state.activeTab === tab ? `{inverse}${label}{/inverse}` : label;
  }).join("  ");
}

function isItemSelected(item: TabItem, state: ProjectDocsState): boolean {
  if (item.kind === "skills") {
    return state.selectedSkills.has(item.id);
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: ProjectDocsState): void {
  if (item.kind === "skills") {
    if (state.selectedSkills.has(item.id)) {
      state.selectedSkills.delete(item.id);
    } else {
      state.selectedSkills.add(item.id);
    }
    return;
  }

  state.reviewAction = item.id as ReviewAction;
}

function formatListItem(item: TabItem, state: ProjectDocsState, isCursorRow: boolean): string {
  const cursorPrefix = isCursorRow ? "> " : "  ";
  const wrapCursorRow = (value: string): string =>
    isCursorRow ? `{black-fg}{yellow-bg}${value}{/yellow-bg}{/black-fg}` : value;

  if (item.kind === "review") {
    return wrapCursorRow(`${cursorPrefix}${state.reviewAction === item.id ? "[x]" : "[ ]"} ${item.label}`);
  }

  const checked = isItemSelected(item, state) ? "x" : " ";
  return wrapCursorRow(`${cursorPrefix}[${checked}] ${item.label}`);
}

function renderReviewSummary(state: ProjectDocsState, catalog: ProjectDocsCatalog): string {
  const selectedSkills = catalog.skills
    .filter((skill) => state.selectedSkills.has(skill.id))
    .map((skill) => skill.label);

  const lines = [
    "{bold}Selections{/bold}",
    `Skills: ${selectedSkills.length ? selectedSkills.join(", ") : "none"}`
  ];

  if (state.notice) {
    lines.push("", `{yellow-fg}${state.notice}{/yellow-fg}`);
  }

  return lines.join("\n");
}

function renderDetailBody(state: ProjectDocsState, catalog: ProjectDocsCatalog): string {
  if (state.activeTab === "review") {
    return renderReviewSummary(state, catalog);
  }

  const items = currentTabItems(state, catalog);
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

function renderFooter(state: ProjectDocsState): string {
  if (state.activeTab === "review") {
    return "← → switch tab • ↑ ↓ move • enter confirm action • q quit";
  }

  return "← → switch tab • ↑ ↓ move • space/enter toggle • a toggle all • q quit";
}

function moveTab(state: ProjectDocsState, delta: number): void {
  const index = TAB_ORDER.indexOf(state.activeTab);
  const nextIndex = (index + delta + TAB_ORDER.length) % TAB_ORDER.length;
  state.activeTab = TAB_ORDER[nextIndex];
  state.notice = "";
}

function moveCursor(state: ProjectDocsState, catalog: ProjectDocsCatalog, delta: number): void {
  const items = currentTabItems(state, catalog);
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

function validateBeforeConfirm(state: ProjectDocsState): string | null {
  if (state.selectedSkills.size === 0) {
    return "Select at least one skill before confirming.";
  }

  return null;
}

function syncListSelection(
  listBox: TabbedLayout["listBox"],
  state: ProjectDocsState,
  catalog: ProjectDocsCatalog
): void {
  const items = currentTabItems(state, catalog);
  const maxIndex = Math.max(items.length - 1, 0);
  const cursor = Math.min(state.listCursor[state.activeTab], maxIndex);
  state.listCursor[state.activeTab] = cursor;
  listBox.setItems(items.map((item, index) => formatListItem(item, state, index === cursor)));
  listBox.select(cursor);
  listBox.scrollTo(cursor);
}

export async function runProjectDocsWizard(
  catalog: ProjectDocsCatalog
): Promise<{ selectedSkills: ProjectDocsSkill[] } | { backToMenu: true }> {
  return new Promise((resolve, reject) => {
    const state = buildInitialState();
    let lastTabSwitchAt = 0;
    let lastMoveAt = 0;
    let lastToggleAt = 0;
    const { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox } = createTabbedLayout();

    function cleanup(): void {
      screen.destroy();
    }

    function render(): void {
      const stepTitle = state.activeTab === "skills" ? "Select skills" : "Review selections";
      headerBox.setContent(renderBannerHeader("Install project docs", "Choose skills first, then confirm from review."));
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(`{bold}${stepTitle}{/bold}`);
      syncListSelection(listBox, state, catalog);
      detailBox.setContent(renderDetailBody(state, catalog));
      footerBox.setContent(renderFooter(state));
      screen.render();
    }

    function finishBackToMenu(): void {
      cleanup();
      resolve({ backToMenu: true });
    }

    function finishSuccess(): void {
      cleanup();
      resolve({
        selectedSkills: catalog.skills.filter((skill) => state.selectedSkills.has(skill.id))
      });
    }

    function finishWithError(message: string): void {
      cleanup();
      reject(new Error(message));
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
          state.notice = validationMessage;
          render();
          return;
        }

        finishSuccess();
        return;
      }

      const items = currentTabItems(state, catalog);
      const current = items[state.listCursor.skills];
      if (current) {
        toggleItem(current, state);
      }
      render();
    }

    function toggleAllSkills(): void {
      if (state.activeTab !== "skills") {
        return;
      }

      const items = currentTabItems(state, catalog);
      const allSelected = items.every((item) => state.selectedSkills.has(item.id));
      for (const item of items) {
        const selected = state.selectedSkills.has(item.id);
        if (allSelected && selected) {
          state.selectedSkills.delete(item.id);
        } else if (!allSelected && !selected) {
          state.selectedSkills.add(item.id);
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
      moveCursor(state, catalog, -1);
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, catalog, 1);
      render();
    });

    screen.key(["space", "enter"], () => {
      handleToggleOrConfirm();
    });

    screen.key(["a"], () => {
      toggleAllSkills();
    });

    screen.key(["q", "C-c"], () => {
      finishWithError("Installation cancelled.");
    });

    render();
  });
}
