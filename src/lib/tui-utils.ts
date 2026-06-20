import blessed from "blessed";

export const DEBOUNCE_MOVE_MS = 100;
export const DEBOUNCE_SELECT_MS = 120;

type ChipTone = "accent" | "success" | "muted" | "warning";

interface HeaderChip {
  label: string;
  tone?: ChipTone;
}

export function canRun(lastAt: number, thresholdMs: number): boolean {
  return Date.now() - lastAt >= thresholdMs;
}

export function selectionArray<T>(items: Set<T>): T[] {
  return [...items];
}

function renderChip(label: string, tone: ChipTone = "accent"): string {
  if (tone === "success") {
    return `{black-fg}{green-bg} ${label} {/green-bg}{/black-fg}`;
  }

  if (tone === "warning") {
    return `{black-fg}{yellow-bg} ${label} {/yellow-bg}{/black-fg}`;
  }

  if (tone === "muted") {
    return `{white-fg}{gray-bg} ${label} {/gray-bg}{/white-fg}`;
  }

  return `{black-fg}{cyan-bg} ${label} {/cyan-bg}{/black-fg}`;
}

export function renderKeycaps(items: Array<{ key: string; label: string }>): string {
  return items
    .map((item) => `${renderChip(item.key, "muted")} {gray-fg}${item.label}{/gray-fg}`)
    .join("   ");
}

export function renderBannerHeader(
  title: string,
  subtitle: string,
  chips: HeaderChip[] = []
): string {
  const chipLine = chips.length > 0
    ? chips.map((chip) => renderChip(chip.label, chip.tone)).join(" ")
    : renderChip("Terminal installer", "muted");

  return [
    `{bold}${renderChip("◈ AI TOOLS")} {white-fg}${title}{/white-fg}{/bold}`,
    `{gray-fg}${subtitle}{/gray-fg}`,
    chipLine,
    `{cyan-fg}${"─".repeat(70)}{/cyan-fg}`
  ].join("\n");
}

export function renderTabBar(
  tabs: Array<{ label: string; meta?: string; active: boolean }>
): string {
  return tabs
    .map((tab) => {
      const indicator = tab.active ? "●" : "○";
      const meta = tab.meta ? ` {gray-fg}${tab.meta}{/gray-fg}` : "";
      const content = ` ${indicator} ${tab.label}${meta} `;
      return tab.active
        ? `{bold}{black-fg}{cyan-bg}${content}{/cyan-bg}{/black-fg}{/bold}`
        : `{gray-fg}${content}{/gray-fg}`;
    })
    .join("  ");
}

export function renderStepSummary(input: {
  step: string;
  title: string;
  description: string;
  status?: string;
}): string {
  const statusPart = input.status ? `  ${renderChip(input.status, "muted")}` : "";
  return [
    `{bold}${renderChip(input.step, "accent")} {white-fg}${input.title}{/white-fg}${statusPart}{/bold}`,
    `{gray-fg}${input.description}{/gray-fg}`
  ].join("\n");
}

export function renderListRow(input: {
  active: boolean;
  selected?: boolean;
  label: string;
  meta?: string;
  description?: string;
  index?: number;
}): string {
  const marker = input.selected === undefined ? " " : input.selected ? "◆" : "◇";
  const indexLabel = input.index === undefined ? "" : `${String(input.index + 1).padStart(2, "0")} `;
  const cursor = input.active ? "▶" : " ";
  const row = `${cursor} ${marker} ${indexLabel}${input.label}`;
  const metaPart = input.meta ? `  {gray-fg}${input.meta}{/gray-fg}` : "";

  const labelLine = input.active
    ? `{black-fg}{yellow-bg}${row}${metaPart}{/yellow-bg}{/black-fg}`
    : input.selected
    ? `{cyan-fg}${row}${metaPart}{/cyan-fg}`
    : row + metaPart;

  const indent = " ".repeat(4 + indexLabel.length);
  const descLine = input.description
    ? `\n${indent}{gray-fg}${input.description}{/gray-fg}`
    : "";

  return labelLine + descLine;
}

export interface TabbedLayout {
  screen: ReturnType<typeof blessed.screen>;
  headerBox: ReturnType<typeof blessed.box>;
  tabsBox: ReturnType<typeof blessed.box>;
  titleBox: ReturnType<typeof blessed.box>;
  listBox: ReturnType<typeof blessed.box>;
  detailBox: ReturnType<typeof blessed.box>;
  footerBox: ReturnType<typeof blessed.box>;
}

export interface SelectChoice {
  value: string;
  label: string;
  description?: string;
}

function renderActionButton(label: string, active: boolean, tone: "success" | "muted"): string {
  if (active && tone === "success") {
    return `{black-fg}{green-bg}  ${label}  {/green-bg}{/black-fg}`;
  }

  if (active) {
    return `{black-fg}{yellow-bg}  ${label}  {/yellow-bg}{/black-fg}`;
  }

  if (tone === "success") {
    return `{green-fg}[ ${label} ]{/green-fg}`;
  }

  return `{gray-fg}[ ${label} ]{/gray-fg}`;
}

export async function blessedSelect(input: {
  message: string;
  choices: SelectChoice[];
}): Promise<string> {
  return new Promise((resolve) => {
    let cursor = 0;

    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      dockBorders: true,
      title: "ai-tools"
    });

    const promptBox = blessed.box({
      parent: screen,
      top: "center",
      left: "center",
      width: "70%",
      height: Math.max(input.choices.length + 8, 10),
      border: { type: "line" },
      label: " confirm ",
      tags: true,
      padding: {
        top: 1,
        left: 2,
        right: 2,
        bottom: 1
      },
      style: {
        border: {
          fg: "cyan"
        }
      }
    });

    function render(): void {
      const lines = [
        `{bold}${renderChip("ATTENTION", "warning")} ${input.message}{/bold}`,
        "{gray-fg}This applies to every conflicting target in the current run.{/gray-fg}",
        "",
        renderKeycaps([
          { key: "UP/DOWN", label: "move" },
          { key: "ENTER", label: "select" },
          { key: "Q", label: "cancel" }
        ]),
        ""
      ];

      for (let i = 0; i < input.choices.length; i++) {
        const choice = input.choices[i];
        lines.push(renderListRow({
          active: i === cursor,
          label: choice.label,
          description: choice.description
        }));
      }

      promptBox.setContent(lines.join("\n"));
      screen.render();
    }

    screen.key(["up"], () => {
      cursor = (cursor - 1 + input.choices.length) % input.choices.length;
      render();
    });

    screen.key(["down"], () => {
      cursor = (cursor + 1) % input.choices.length;
      render();
    });

    screen.key(["enter", "space"], () => {
      const value = input.choices[cursor].value;
      screen.destroy();
      resolve(value);
    });

    screen.key(["escape", "q", "C-c"], () => {
      screen.destroy();
      resolve(input.choices[0].value);
    });

    render();
  });
}

export async function blessedConfirm(input: {
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    let accept = false;

    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      dockBorders: true,
      title: "ai-tools"
    });

    const promptBox = blessed.box({
      parent: screen,
      top: "center",
      left: "center",
      width: "70%",
      height: 11,
      border: { type: "line" },
      label: " confirm ",
      tags: true,
      padding: {
        top: 1,
        left: 2,
        right: 2,
        bottom: 1
      },
      style: {
        border: {
          fg: "cyan"
        }
      }
    });

    const confirmLabel = input.confirmLabel ?? "Yes";
    const cancelLabel = input.cancelLabel ?? "No";

    function finish(value: boolean): void {
      screen.destroy();
      resolve(value);
    }

    function toggle(): void {
      accept = !accept;
      render();
    }

    function render(): void {
      const actionRow = `${renderActionButton(confirmLabel, accept, "success")}   ${renderActionButton(cancelLabel, !accept, "muted")}`;
      const lines = [
        `{bold}${renderChip("ATTENTION", "warning")} ${input.message}{/bold}`,
        `{gray-fg}${input.description ?? "This applies to every conflicting target in the current run."}{/gray-fg}`,
        "",
        actionRow,
        "",
        renderKeycaps([
          { key: "LEFT/RIGHT", label: "switch" },
          { key: "ENTER", label: "confirm" },
          { key: "ESC", label: "cancel" }
        ])
      ];

      promptBox.setContent(lines.join("\n"));
      screen.render();
    }

    screen.key(["left", "right", "tab", "S-tab", "h", "l"], () => {
      toggle();
    });

    screen.key(["up", "down"], () => {
      toggle();
    });

    screen.key(["enter", "space"], () => {
      finish(accept);
    });

    screen.key(["escape", "q", "C-c"], () => {
      finish(false);
    });

    render();
  });
}

export function createTabbedLayout(): TabbedLayout {
  const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    dockBorders: true,
    title: "ai-tools"
  });

  const headerBox = blessed.box({
    parent: screen,
    top: 0,
    left: 2,
    width: "100%-4",
    height: 6,
    tags: true,
    wrap: true,
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

  const tabsBox = blessed.box({
    parent: screen,
    top: 6,
    left: 2,
    width: "100%-4",
    height: 3,
    tags: true,
    border: { type: "line" },
    label: " flow ",
    padding: {
      left: 1,
      right: 1
    },
    style: {
      border: {
        fg: "blue"
      }
    }
  });

  const titleBox = blessed.box({
    parent: screen,
    top: 9,
    left: 2,
    width: "100%-4",
    height: 4,
    tags: true,
    border: { type: "line" },
    label: " current step ",
    padding: {
      left: 1,
      right: 1
    },
    style: {
      border: {
        fg: "magenta"
      }
    }
  });

  const listBox = blessed.box({
    parent: screen,
    top: 13,
    left: 2,
    width: "100%-4",
    height: "100%-20",
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    border: { type: "line" },
    label: " options ",
    padding: {
      left: 1,
      right: 1
    },
    style: {
      border: {
        fg: "blue"
      }
    },
    scrollbar: {
      ch: "│",
      track: {
        bg: "gray"
      },
      style: {
        bg: "cyan"
      }
    }
  });

  const detailBox = blessed.box({
    parent: screen,
    left: 2,
    bottom: 2,
    width: "100%-4",
    height: 4,
    tags: true,
    wrap: true,
    border: { type: "line" },
    label: " details ",
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

  return { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox };
}

export function renderListContent(
  listBox: ReturnType<typeof blessed.box>,
  renderedItems: string[],
  cursorIndex: number
): void {
  listBox.setContent(renderedItems.join("\n"));
  let visualRow = 0;
  for (let i = 0; i < cursorIndex; i++) {
    visualRow += renderedItems[i].split("\n").length;
  }
  listBox.scrollTo(visualRow);
}
