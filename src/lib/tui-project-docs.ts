import blessed from "blessed";
import type { ProjectDocsCatalog, ProjectDocsDocument } from "./types.js";

type ProjectDocsTab = "documents" | "review";
type ReviewAction = "confirm" | "back" | "cancel";

interface ProjectDocsState {
  activeTab: ProjectDocsTab;
  selectedDocuments: Set<string>;
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

const TAB_ORDER: ProjectDocsTab[] = ["documents", "review"];

function buildInitialState(): ProjectDocsState {
  return {
    activeTab: "documents",
    selectedDocuments: new Set<string>(),
    listCursor: {
      documents: 0,
      review: 0
    },
    reviewAction: "confirm",
    notice: ""
  };
}

function selectionArray<T>(items: Set<T>): T[] {
  return [...items];
}

function currentTabItems(state: ProjectDocsState, catalog: ProjectDocsCatalog): TabItem[] {
  if (state.activeTab === "documents") {
    return catalog.documents.map((document) => ({
      id: document.id,
      label: document.label,
      description: document.description,
      kind: "documents" as const
    }));
  }

  return [
    {
      id: "confirm",
      label: "Confirm install",
      description: "Continue with the selected documents.",
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
  if (item.kind === "documents") {
    return state.selectedDocuments.has(item.id);
  }

  return state.reviewAction === item.id;
}

function toggleItem(item: TabItem, state: ProjectDocsState): void {
  if (item.kind === "documents") {
    if (state.selectedDocuments.has(item.id)) {
      state.selectedDocuments.delete(item.id);
    } else {
      state.selectedDocuments.add(item.id);
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

function renderHeader(): string {
  return [
    "{black-fg}{cyan-bg} AI-TOOLS {/cyan-bg}{/black-fg}",
    "{bold}Install project docs{/bold}",
    "{gray-fg}Choose documents first, then confirm from review.{/gray-fg}",
    "{cyan-fg}------------------------------------------------------------------------{/cyan-fg}"
  ].join("\n");
}

function renderReviewSummary(state: ProjectDocsState, catalog: ProjectDocsCatalog): string {
  const selectedDocuments = catalog.documents
    .filter((document) => state.selectedDocuments.has(document.id))
    .map((document) => document.label);

  const lines = [
    "{bold}Selections{/bold}",
    `Documents: ${selectedDocuments.length ? selectedDocuments.join(", ") : "none"}`
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
  if (state.selectedDocuments.size === 0) {
    return "Select at least one document before confirming.";
  }

  return null;
}

function syncListSelection(
  listBox: ReturnType<typeof blessed.list>,
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
): Promise<{ selectedDocuments: ProjectDocsDocument[] } | { backToMenu: true }> {
  return new Promise((resolve, reject) => {
    const state = buildInitialState();
    let lastTabSwitchAt = 0;
    let lastMoveAt = 0;
    let lastToggleAt = 0;

    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      title: "ai-tools"
    });

    const headerBox = blessed.box({
      parent: screen,
      top: 0,
      left: 0,
      width: "100%",
      height: 4,
      tags: true,
      wrap: true
    });

    const tabsBox = blessed.box({
      parent: screen,
      top: 4,
      left: 0,
      width: "100%",
      height: 1,
      tags: true
    });

    const titleBox = blessed.box({
      parent: screen,
      top: 6,
      left: 0,
      width: "100%",
      height: 1,
      tags: true
    });

    const listBox = blessed.list({
      parent: screen,
      top: 8,
      left: 0,
      width: "100%",
      height: "100%-13",
      tags: true,
      keys: false,
      vi: false,
      mouse: false,
      interactive: false,
      scrollable: true,
      alwaysScroll: true,
      style: {
        selected: {
          bold: true,
          fg: "black",
          bg: "yellow"
        }
      }
    });

    const detailBox = blessed.box({
      parent: screen,
      left: 0,
      bottom: 1,
      width: "100%",
      height: 4,
      tags: true,
      wrap: true
    });

    const footerBox = blessed.box({
      parent: screen,
      bottom: 0,
      left: 0,
      width: "100%",
      height: 1,
      tags: true
    });

    function cleanup(): void {
      screen.destroy();
    }

    function render(): void {
      const stepTitle = state.activeTab === "documents" ? "Select documents" : "Review selections";
      headerBox.setContent(renderHeader());
      tabsBox.setContent(renderTabs(state));
      titleBox.setContent(`{bold}${stepTitle}{/bold}`);
      syncListSelection(listBox, state, catalog);
      detailBox.setContent(renderDetailBody(state, catalog));
      footerBox.setContent(renderFooter(state));
      screen.render();
    }

    function canRun(lastAt: number, thresholdMs: number): boolean {
      return Date.now() - lastAt >= thresholdMs;
    }

    function finishBackToMenu(): void {
      cleanup();
      resolve({ backToMenu: true });
    }

    function finishSuccess(): void {
      cleanup();
      resolve({
        selectedDocuments: catalog.documents.filter((document) => state.selectedDocuments.has(document.id))
      });
    }

    function finishWithError(message: string): void {
      cleanup();
      reject(new Error(message));
    }

    function handleToggleOrConfirm(): void {
      if (!canRun(lastToggleAt, 120)) {
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
      const current = items[state.listCursor.documents];
      if (current) {
        toggleItem(current, state);
      }
      render();
    }

    function toggleAllDocuments(): void {
      if (state.activeTab !== "documents") {
        return;
      }

      const items = currentTabItems(state, catalog);
      const allSelected = items.every((item) => state.selectedDocuments.has(item.id));
      for (const item of items) {
        const selected = state.selectedDocuments.has(item.id);
        if (allSelected && selected) {
          state.selectedDocuments.delete(item.id);
        } else if (!allSelected && !selected) {
          state.selectedDocuments.add(item.id);
        }
      }

      render();
    }

    screen.key(["left"], () => {
      if (!canRun(lastTabSwitchAt, 120)) {
        return;
      }
      lastTabSwitchAt = Date.now();
      moveTab(state, -1);
      render();
    });

    screen.key(["right"], () => {
      if (!canRun(lastTabSwitchAt, 120)) {
        return;
      }
      lastTabSwitchAt = Date.now();
      moveTab(state, 1);
      render();
    });

    screen.key(["up"], () => {
      if (!canRun(lastMoveAt, 100)) {
        return;
      }
      lastMoveAt = Date.now();
      moveCursor(state, catalog, -1);
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, 100)) {
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
      toggleAllDocuments();
    });

    screen.key(["q", "C-c"], () => {
      finishWithError("Installation cancelled.");
    });

    render();
  });
}
