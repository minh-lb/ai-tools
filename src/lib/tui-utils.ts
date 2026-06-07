import blessed from "blessed";

export const DEBOUNCE_MOVE_MS = 100;
export const DEBOUNCE_SELECT_MS = 120;

export function canRun(lastAt: number, thresholdMs: number): boolean {
  return Date.now() - lastAt >= thresholdMs;
}

export function selectionArray<T>(items: Set<T>): T[] {
  return [...items];
}

export function renderBannerHeader(title: string, subtitle: string): string {
  return [
    "{black-fg}{cyan-bg} AI-TOOLS {/cyan-bg}{/black-fg}",
    `{bold}${title}{/bold}`,
    `{gray-fg}${subtitle}{/gray-fg}`,
    "{cyan-fg}------------------------------------------------------------------------{/cyan-fg}"
  ].join("\n");
}

export interface TabbedLayout {
  screen: ReturnType<typeof blessed.screen>;
  headerBox: ReturnType<typeof blessed.box>;
  tabsBox: ReturnType<typeof blessed.box>;
  titleBox: ReturnType<typeof blessed.box>;
  listBox: ReturnType<typeof blessed.list>;
  detailBox: ReturnType<typeof blessed.box>;
  footerBox: ReturnType<typeof blessed.box>;
}

export interface SelectChoice {
  value: string;
  label: string;
  description?: string;
}

export async function blessedSelect(input: {
  message: string;
  choices: SelectChoice[];
}): Promise<string> {
  return new Promise((resolve) => {
    let cursor = 0;

    const screen = blessed.screen({ smartCSR: true, fullUnicode: true, title: "ai-tools" });

    const promptBox = blessed.box({
      parent: screen,
      top: "center",
      left: "center",
      width: 50,
      height: input.choices.length + 4,
      border: { type: "line" },
      tags: true
    });

    function render(): void {
      const lines = [
        `{bold}${input.message}{/bold}`,
        ""
      ];
      for (let i = 0; i < input.choices.length; i++) {
        const choice = input.choices[i];
        const row = `${i === cursor ? "> " : "  "}${choice.label}`;
        lines.push(i === cursor ? `{black-fg}{yellow-bg}${row}{/yellow-bg}{/black-fg}` : row);
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

export function createTabbedLayout(): TabbedLayout {
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

  return { screen, headerBox, tabsBox, titleBox, listBox, detailBox, footerBox };
}
