import blessed from "blessed";
import { canRun, DEBOUNCE_MOVE_MS, DEBOUNCE_SELECT_MS, renderBannerHeader } from "./tui-utils.js";

export type EntryMenuAction = "install-skills" | "install-project-docs" | "install-libs" | "cancel";

interface EntryMenuItem {
  id: EntryMenuAction;
  label: string;
  description: string;
}

const MENU_ITEMS: EntryMenuItem[] = [
  {
    id: "install-skills",
    label: "Install agent skills",
    description: "Open the terminal UI to install skills for Codex and Claude."
  },
  {
    id: "install-project-docs",
    label: "Install project docs",
    description: "Install project documentation templates and guidance."
  },
  {
    id: "install-libs",
    label: "Install libs for AI",
    description: "Install shared AI libraries and tooling."
  },
  {
    id: "cancel",
    label: "Cancel",
    description: "Exit without running any installer."
  }
];

function renderItem(item: EntryMenuItem, isActive: boolean): string {
  const text = `${isActive ? "> " : "  "}${item.label}`;
  return isActive ? `{black-fg}{yellow-bg}${text}{/yellow-bg}{/black-fg}` : text;
}

export async function runEntryMenu(): Promise<EntryMenuAction> {
  return new Promise((resolve) => {
    let cursor = 0;
    let lastMoveAt = 0;
    let lastSelectAt = 0;

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
      tags: true
    });

    const listBox = blessed.list({
      parent: screen,
      top: 6,
      left: 0,
      width: "100%",
      height: 6,
      tags: true,
      keys: false,
      vi: false,
      mouse: false,
      interactive: false,
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
      top: 14,
      left: 0,
      width: "100%",
      height: 3,
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
      headerBox.setContent(renderBannerHeader("Main menu", "Choose the workflow you want to run."));
      listBox.setItems(MENU_ITEMS.map((item, index) => renderItem(item, index === cursor)));
      listBox.select(cursor);
      detailBox.setContent(`{bold}Details{/bold}\n${MENU_ITEMS[cursor].description}`);
      footerBox.setContent("↑ ↓ move • enter select • q quit");
      screen.render();
    }

    screen.key(["up"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      cursor = (cursor - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
      render();
    });

    screen.key(["down"], () => {
      if (!canRun(lastMoveAt, DEBOUNCE_MOVE_MS)) {
        return;
      }
      lastMoveAt = Date.now();
      cursor = (cursor + 1) % MENU_ITEMS.length;
      render();
    });

    screen.key(["enter"], () => {
      if (!canRun(lastSelectAt, DEBOUNCE_SELECT_MS)) {
        return;
      }
      lastSelectAt = Date.now();
      const action = MENU_ITEMS[cursor].id;
      cleanup();
      resolve(action);
    });

    screen.key(["q", "escape", "C-c"], () => {
      cleanup();
      resolve("cancel");
    });

    render();
  });
}
