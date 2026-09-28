import * as process from "node:process";
import { rm } from "node:fs/promises";
import { loadPackageConfig } from "./lib/config.js";
import { createGitHubClient } from "./lib/github.js";
import {
  detectExistingTargets,
  installPlannedItems,
  planInstallations,
  resolveInstallRoot
} from "./lib/install.js";
import { loadSelectionCatalog, resolveSelectionItems } from "./lib/selection-catalog.js";
import { blessedConfirm } from "./lib/tui-utils.js";
import { runSkillsWizard, resolveSkillsDir } from "./lib/tui-skills.js";
import { runEntryMenu } from "./lib/tui-entry-menu.js";
import { runTabbedWizard } from "./lib/tui-wizard.js";
import type { Agent, InstallLocation, SelectionCatalog } from "./lib/types.js";

const ANSI = {
  reset: "\u001B[0m",
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  cyan: "\u001B[36m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  gray: "\u001B[90m"
} as const;

type StatusTone = "info" | "success" | "warning" | "muted";

function paint(text: string, color: string, bold = false): string {
  return `${bold ? ANSI.bold : ""}${color}${text}${ANSI.reset}`;
}

function stripAnsi(value: string): string {
  return value.replace(/\u001B\[[0-9;]*m/g, "");
}

function visibleLength(value: string): number {
  return stripAnsi(value).length;
}

function wrapText(value: string, width: number): string[] {
  if (value.length === 0) {
    return [""];
  }

  const words = value.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current.length === 0 ? word : `${current} ${word}`;
    if (candidate.length <= width) {
      current = candidate;
      continue;
    }

    if (current.length > 0) {
      lines.push(current);
      current = "";
    }

    if (word.length <= width) {
      current = word;
      continue;
    }

    let remainder = word;
    while (remainder.length > width) {
      lines.push(remainder.slice(0, width));
      remainder = remainder.slice(width);
    }
    current = remainder;
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function buildPanel(title: string, lines: string[], accent: StatusTone = "info"): string {
  const accentColor = {
    info: ANSI.cyan,
    success: ANSI.green,
    warning: ANSI.yellow,
    muted: ANSI.gray
  }[accent];
  const maxWidth = Math.min(process.stdout.columns ?? 92, 100);
  const innerWidth = Math.max(
    48,
    Math.min(
      maxWidth - 4,
      Math.max(
        visibleLength(title) + 14,
        ...lines.map((line) => Math.min(stripAnsi(line).length, maxWidth - 6))
      ) + 2
    )
  );
  const wrappedLines = lines.flatMap((line) => {
    if (line.length === 0) {
      return [""];
    }

    return wrapText(line, innerWidth);
  });
  const header = paint(`[ AI TOOLS ] ${title}`, accentColor, true);
  const border = `+${"-".repeat(innerWidth + 2)}+`;

  return [
    "",
    border,
    `| ${header}${" ".repeat(Math.max(0, innerWidth - visibleLength(header)))} |`,
    ...wrappedLines.map((line) => `| ${line}${" ".repeat(Math.max(0, innerWidth - visibleLength(line)))} |`),
    border
  ].join("\n");
}

function printSectionHeader(title: string, subtitle: string): void {
  console.log(buildPanel(title, [subtitle], "info"));
  console.log("");
}

function printLabeledRows(title: string, rows: Array<[string, string]>, accent: StatusTone = "muted"): void {
  const labelWidth = Math.max(...rows.map(([label]) => label.length));
  const lines = rows.map(([label, value]) => `${paint(label.padEnd(labelWidth, " "), ANSI.gray, true)}  ${value}`);
  console.log(buildPanel(title, lines, accent));
  console.log("");
}

function printBulletPanel(title: string, items: string[], accent: StatusTone = "muted"): void {
  console.log(buildPanel(title, items.map((item) => `- ${item}`), accent));
  console.log("");
}

function printStatusLine(label: string, message: string, tone: StatusTone = "info"): void {
  const color = {
    info: ANSI.cyan,
    success: ANSI.green,
    warning: ANSI.yellow,
    muted: ANSI.gray
  }[tone];
  const badge = paint(`[${label}]`, color, true);
  console.log(`${badge} ${message}`);
}

function formatInstallProgressLine(input: {
  id: string;
  sourceBranch: string;
  targetPath: string;
}): string {
  return `${input.id}  ${paint(`[${input.sourceBranch}]`, ANSI.gray)} -> ${input.targetPath}`;
}

function printSkillSelectionSummary(input: {
  selectionCatalog: SelectionCatalog;
  selectedSkills: string[];
  selectedGroups: string[];
  locations: InstallLocation[];
  agents: Agent[];
}): void {
  const selectedSkillLabels = input.selectionCatalog.skills
    .filter((skill) => input.selectedSkills.includes(skill.id))
    .map((skill) => skill.label);
  const selectedGroupLabels = input.selectionCatalog.groups
    .filter((group) => input.selectedGroups.includes(group.id))
    .map((group) => group.label);

  const rows: Array<[string, string]> = [
    ["Skills", selectedSkillLabels.length ? selectedSkillLabels.join(", ") : "none"]
  ];

  if (selectedGroupLabels.length > 0) {
    rows.push(["Groups", selectedGroupLabels.join(", ")]);
  }

  rows.push(
    ["Locations", input.locations.length ? input.locations.join(", ") : "none"],
    ["Agents", input.agents.length ? input.agents.join(", ") : "none"]
  );

  printLabeledRows("Selected items", rows);
}

export async function runCli(): Promise<void> {
  while (true) {
    const entryAction = await runEntryMenu();

    if (entryAction === "cancel") {
      return;
    }

    if (entryAction === "manage-skills") {
      const skillsResult = await runSkillsWizard();

      if ("backToMenu" in skillsResult) {
        continue;
      }

      const { agent, skillsToDelete } = skillsResult;
      const skillsDir = resolveSkillsDir(agent);

      printSectionHeader(
        "Manage skills",
        `Deleting ${skillsToDelete.length} skill(s) for ${agent}.`
      );

      const deleted: string[] = [];
      const failed: Array<{ name: string; error: string }> = [];

      for (const skillName of skillsToDelete) {
        const skillPath = `${skillsDir}/${skillName}`;
        try {
          await rm(skillPath, { recursive: true, force: true });
          deleted.push(skillName);
          printStatusLine("delete", skillPath, "muted");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failed.push({ name: skillName, error: message });
          printStatusLine("warn", `Failed to delete ${skillPath}: ${message}`, "warning");
        }
      }

      if (deleted.length > 0) {
        printBulletPanel(`Deleted (${deleted.length})`, deleted, "success");
      }

      if (failed.length > 0) {
        printBulletPanel(
          `Failed (${failed.length})`,
          failed.map((f) => `${f.name}: ${f.error}`),
          "warning"
        );
      }

      return;
    }

    // install-skills
    const config = await loadPackageConfig();
    const selectionCatalog = await loadSelectionCatalog(config);

    if (selectionCatalog.skills.length === 0 && selectionCatalog.groups.length === 0) {
      throw new Error("Selection catalog is empty. Add skills or groups before running the installer.");
    }

    const selectionResult = await runTabbedWizard(selectionCatalog, "Install agent skills");

    if ("backToMenu" in selectionResult) {
      continue;
    }

    const { selectedSkills, selectedGroups, locations, agents } = selectionResult;

    printSectionHeader("Install agent skills", "Preparing selected skills for resolution and installation.");
    printSkillSelectionSummary({ selectionCatalog, selectedSkills, selectedGroups, locations, agents });
    printStatusLine("resolve", "Resolving selected sources...");

    const client = createGitHubClient(config.github);
    const finalItems = await resolveSelectionItems({
      client,
      config,
      selectionCatalog,
      selectedSkillIds: selectedSkills,
      selectedGroupIds: selectedGroups
    });

    if (finalItems.length === 0) {
      throw new Error("No installable items were resolved from the selected sources.");
    }

    const plannedItems: ReturnType<typeof planInstallations> = [];
    const skipped: string[] = [];

    for (const location of locations) {
      for (const agent of agents) {
        const agentItems = planInstallations({
          items: finalItems,
          agent,
          installRoot: resolveInstallRoot({ agent, location, cwd: process.cwd() })
        });
        plannedItems.push(...agentItems);

        for (const item of finalItems) {
          if (!agentItems.some((p) => p.id === item.id)) {
            skipped.push(`  - ${item.id} (no ${agent} target)`);
          }
        }
      }
    }

    if (skipped.length > 0) {
      printBulletPanel("Skipped targets", skipped.map((line) => line.trimStart().replace(/^- /, "")), "warning");
    }

    const existingTargets = await detectExistingTargets(plannedItems);
    let overwriteExisting = false;

    if (existingTargets.length > 0) {
      printBulletPanel(
        "Existing targets detected",
        existingTargets.map((item) => `${item.id} -> ${item.targetPath}`),
        "warning"
      );

      overwriteExisting = await blessedConfirm({
        message: "Overwrite all existing targets?",
        description: "Choose Yes to replace all detected targets, or No to cancel the installation."
      });

      if (!overwriteExisting) {
        throw new Error("Installation cancelled because existing targets would be overwritten.");
      }
    }

    printStatusLine("install", "Installing selected agent skills...");
    const results = await installPlannedItems({
      plannedItems,
      client,
      overwriteExisting,
      onProgress(item) {
        printStatusLine("write", formatInstallProgressLine(item), "muted");
      }
    });

    printBulletPanel(
      `Install complete (${results.length})`,
      results.map((result) => `${result.id} -> ${result.targetPath}`),
      "success"
    );
    return;
  }
}
