import blessed from "blessed";
import {
  canRun,
  DEBOUNCE_MOVE_MS,
  DEBOUNCE_SELECT_MS,
  renderBannerHeader,
  renderKeycaps,
  renderListRow
} from "./tui-utils.js";

export type EntryMenuAction = "install-skills" | "install-project-docs" | "install-libs" | "cancel";

interface EntryMenuItem {
  id: EntryMenuAction;
  label: string;
  description: string;
  meta: string;
}

const MENU_ITEMS: EntryMenuItem[] = [
  {
    id: "install-skills",
    label: "Install agent skills",
    description: "Open the guided installer for Codex skills and Claude custom agents.",
    meta: "Codex + Claude"
  },
  {
    id: "install-project-docs",
    label: "Install project docs",
    description: "Copy selected project docs and workflow templates into the current repository.",
    meta: "Current repo"
  },
  {
    id: "install-libs",
    label: "Install libs for AI",
    description: "Install shared AI libraries and tooling.",
    meta: "Coming soon"
  },
  {
    id: "cancel",
    label: "Cancel",
    description: "Exit without running any installer.",
    meta: "Safe exit"
  }
];

function renderItem(item: EntryMenuItem, isActive: boolean): string {
  return renderListRow({
    active: isActive,
    label: item.label,
    meta: item.meta
  });
}

export async function runEntryMenu(): Promise<EntryMenuAction> {
  return new Promise((resolve) => {
    let cursor = 0;
    let lastMoveAt = 0;
    let lastSelectAt = 0;

    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      dockBorders: true,
      title: "ai-tools"
    });

    const headerBox = blessed.box({
      parent: screen,
      top: 1,
      left: 2,
      width: "100%-4",
      height: 6,
      tags: true,
      border: { type: "line" },
      label: " overview ",
      padding: {
        left: 1,
        right: 1
      },
      style: {
        border: {
          fg: "cyan"
        }
      }
    });

    const listBox = blessed.list({
      parent: screen,
      top: 8,
      left: 2,
      width: "100%-4",
      height: 8,
      tags: true,
      keys: false,
      vi: false,
      mouse: false,
      interactive: false,
      border: { type: "line" },
      label: " workflows ",
      padding: {
        left: 1,
        right: 1
      },
      style: {
        border: {
          fg: "blue"
        },
        selected: {
          bold: true,
          fg: "black",
          bg: "yellow"
        }
      }
    });

    const detailBox = blessed.box({
      parent: screen,
      top: 17,
      left: 2,
      width: "100%-4",
      height: 7,
      tags: true,
      wrap: true,
      border: { type: "line" },
      label: " preview ",
      padding: {
        left: 1,
        right: 1
      },
      style: {
        border: {
          fg: "green"
        }
      }
    });

    const footerBox = blessed.box({
      parent: screen,
      bottom: 0,
      left: 2,
      width: "100%-4",
      height: 1,
      tags: true,
      style: {
        fg: "gray"
      }
    });

    function cleanup(): void {
      screen.destroy();
    }

    function render(): void {
      headerBox.setContent(renderBannerHeader(
        "Main menu",
        "Choose the workflow you want to run.",
        [
          { label: `${MENU_ITEMS.length - 1} workflows`, tone: "accent" },
          { label: "Keyboard only", tone: "muted" },
          { label: "Safe by default", tone: "success" }
        ]
      ));
      listBox.setItems(MENU_ITEMS.map((item, index) => renderItem(item, index === cursor)));
      listBox.select(cursor);
      detailBox.setContent([
        `{bold}${MENU_ITEMS[cursor].label}{/bold}  {gray-fg}${MENU_ITEMS[cursor].meta}{/gray-fg}`,
        "",
        MENU_ITEMS[cursor].description,
        "",
        "{gray-fg}Tip: complete one workflow, then rerun the CLI for another task.{/gray-fg}"
      ].join("\n"));
      footerBox.setContent(renderKeycaps([
        { key: "UP/DOWN", label: "move" },
        { key: "ENTER", label: "select" },
        { key: "Q", label: "quit" }
      ]));
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
