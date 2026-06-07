import * as process from "node:process";
import { parseArgs, printHelp } from "./lib/args.js";
import { loadPackageConfig } from "./lib/config.js";
import { createPromptSession, promptConfirm } from "./lib/prompts.js";
import { createGitHubClient } from "./lib/github.js";
import {
  detectExistingTargets,
  installPlannedItems,
  installProjectDocsItems,
  planInstallations,
  planProjectDocsInstallations,
  resolveInstallRoot,
  resolveProjectDocsRoot
} from "./lib/install.js";
import { loadProjectDocsCatalog } from "./lib/project-docs-catalog.js";
import { loadSelectionCatalog, resolveSelectionItems } from "./lib/selection-catalog.js";
import { runEntryMenu, type EntryMenuAction } from "./lib/tui-entry-menu.js";
import { runProjectDocsWizard } from "./lib/tui-project-docs.js";
import { runTabbedWizard } from "./lib/tui-wizard.js";
import type { Agent, CliOptions, InstallLocation, SelectionCatalog } from "./lib/types.js";

function printSectionHeader(title: string, subtitle: string): void {
  const lines = [
    `AI-TOOLS :: ${title}`,
    subtitle
  ];
  const width = Math.max(...lines.map((line) => line.length)) + 4;
  const border = "+".padEnd(width - 1, "-") + "+";

  console.log("");
  console.log(border);
  for (const line of lines) {
    console.log(`| ${line.padEnd(width - 4, " ")} |`);
  }
  console.log(border);
  console.log("");
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

  console.log("Selected items:");
  console.log(`- Skills: ${selectedSkillLabels.length ? selectedSkillLabels.join(", ") : "none"}`);

  if (selectedGroupLabels.length > 0) {
    console.log(`- Groups: ${selectedGroupLabels.join(", ")}`);
  }

  console.log(`- Locations: ${input.locations.length ? input.locations.join(", ") : "none"}`);
  console.log(`- Agents: ${input.agents.length ? input.agents.join(", ") : "none"}`);
}

function printProjectDocsSelectionSummary(input: {
  selectedSkills: { label: string }[];
  cwd: string;
}): void {
  console.log("Selected items:");
  console.log(`- Skills: ${input.selectedSkills.map((skill) => skill.label).join(", ")}`);
  console.log(`- Install root: ${resolveProjectDocsRoot(input.cwd)}`);
}

function ensureNonInteractiveInputs(selectionCatalog: SelectionCatalog, options: CliOptions): void {
  const missing: string[] = [];

  if (options.skills.length === 0 && options.groups.length === 0) {
    missing.push("--skills and/or --groups");
  }

  if (options.locations.length === 0) {
    missing.push("--location");
  }

  if (options.agents.length === 0) {
    missing.push("--agent");
  }

  if (missing.length > 0) {
    throw new Error(`Non-interactive mode requires ${missing.join(", ")}. Run in a TTY for prompts.`);
  }

  const unknownSkills = options.skills.filter(
    (skillId) => !selectionCatalog.skills.some((item) => item.id === skillId)
  );
  if (unknownSkills.length > 0) {
    throw new Error(`Unknown skill id(s): ${unknownSkills.join(", ")}`);
  }

  const unknownGroups = options.groups.filter(
    (groupId) => !selectionCatalog.groups.some((group) => group.id === groupId)
  );
  if (unknownGroups.length > 0) {
    throw new Error(`Unknown group id(s): ${unknownGroups.join(", ")}`);
  }
}

async function resolveSelections(
  selectionCatalog: SelectionCatalog,
  options: CliOptions
): Promise<{
  selectedSkills: string[];
  selectedGroups: string[];
  locations: InstallLocation[];
  agents: Agent[];
} | {
  backToMenu: true;
}> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    ensureNonInteractiveInputs(selectionCatalog, options);
    return {
      selectedSkills: options.skills,
      selectedGroups: options.groups,
      locations: options.locations,
      agents: options.agents
    };
  }

  return runTabbedWizard(selectionCatalog, options, "Install agent skills");
}

async function resolveEntryAction(rawArgs: string[]): Promise<EntryMenuAction | null> {
  if (rawArgs.length > 0 || !process.stdin.isTTY || !process.stdout.isTTY) {
    return null;
  }

  return runEntryMenu();
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
  const rawArgs = argv.slice(2);
  const useMainMenu = rawArgs.length === 0 && process.stdin.isTTY && process.stdout.isTTY;

  while (true) {
    const entryAction = useMainMenu ? await resolveEntryAction(rawArgs) : null;

    if (entryAction === "install-libs") {
      printSectionHeader("Install libs for AI", "Shared AI libraries and tooling are not implemented yet.");
      console.log("Install libs for AI is not implemented yet.");
      return;
    }

    if (entryAction === "install-project-docs") {
      const config = await loadPackageConfig();
      const projectDocsCatalog = await loadProjectDocsCatalog(config);
      const projectDocsResult = await runProjectDocsWizard(projectDocsCatalog);

      if ("backToMenu" in projectDocsResult) {
        if (useMainMenu) {
          continue;
        }
        return;
      }

      printSectionHeader("Install project docs", "Preparing selected project docs for resolution and installation.");
      printProjectDocsSelectionSummary({
        selectedSkills: projectDocsResult.selectedSkills,
        cwd: process.cwd()
      });
      console.log("Resolving selected sources...");

      const client = createGitHubClient(config.github);
      const plannedItems = planProjectDocsInstallations({
        skills: projectDocsResult.selectedSkills,
        cwd: process.cwd()
      });

      console.log("");
      console.log("Installing...");
      const results = await installProjectDocsItems({
        plannedItems,
        client,
        overwriteExisting: false,
        onProgress(item) {
          console.log(`- ${item.id} from ${item.sourceBranch} -> ${item.targetPath}`);
        }
      });

      console.log("");
      console.log("Install complete");
      for (const result of results) {
        console.log(`- ${result.id}: ${result.targetPath}`);
      }
      return;
    }

    if (entryAction === "cancel") {
      return;
    }

    const effectiveArgs = entryAction === "install-skills" ? ["install"] : rawArgs;
    const { command, options } = parseArgs(effectiveArgs);

    if (options.help || command === "help") {
      printHelp();
      return;
    }

    if (command !== "install") {
      throw new Error(`Unsupported command "${command}". Only "install" is available.`);
    }

    const config = await loadPackageConfig();
    const selectionCatalog = await loadSelectionCatalog(config);

    if (selectionCatalog.skills.length === 0 && selectionCatalog.groups.length === 0) {
      throw new Error("Selection catalog is empty. Add skills or groups before running the installer.");
    }

    const selectionResult = await resolveSelections(selectionCatalog, options);
    if ("backToMenu" in selectionResult) {
      if (useMainMenu) {
        continue;
      }
      return;
    }

    const { selectedSkills, selectedGroups, locations, agents } = selectionResult;

    printSectionHeader("Install agent skills", "Preparing selected skills for resolution and installation.");
    printSkillSelectionSummary({
      selectionCatalog,
      selectedSkills,
      selectedGroups,
      locations,
      agents
    });
    console.log("Resolving selected sources...");
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

    const plannedItems = locations.flatMap((location) =>
      agents.flatMap((agent) =>
        planInstallations({
          items: finalItems,
          agent,
          installRoot: resolveInstallRoot({ agent, location, cwd: process.cwd() })
        })
      )
    );

    const existingTargets = await detectExistingTargets(plannedItems);
    let overwriteExisting = options.yes;

    if (existingTargets.length > 0 && !overwriteExisting) {
      console.log("");
      console.log("Existing targets detected:");
      for (const item of existingTargets) {
        console.log(`- ${item.id}: ${item.targetPath}`);
      }

      if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw new Error("Existing targets require --yes in non-interactive mode.");
      }

      const prompt = createPromptSession();
      try {
        overwriteExisting = await promptConfirm(prompt, {
          message: "Overwrite all existing targets?",
          defaultValue: false
        });
      } finally {
        await prompt.close();
      }

      if (!overwriteExisting) {
        throw new Error("Installation cancelled because existing targets would be overwritten.");
      }
    }

    console.log("");
    console.log("Installing...");
    const results = await installPlannedItems({
      plannedItems,
      client,
      overwriteExisting,
      onProgress(item) {
        console.log(`- ${item.id} from ${item.sourceBranch} -> ${item.targetPath}`);
      }
    });

    console.log("");
    console.log("Install complete");
    for (const result of results) {
      console.log(`- ${result.id}: ${result.targetPath}`);
    }
    return;
  }
}
