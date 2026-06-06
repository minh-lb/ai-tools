import * as process from "node:process";
import { parseArgs, printHelp } from "./lib/args.js";
import { loadPackageConfig } from "./lib/config.js";
import { createPromptSession, promptConfirm, promptSingleSelect } from "./lib/prompts.js";
import { createGitHubClient } from "./lib/github.js";
import { detectExistingTargets, installPlannedItems, planInstallations, resolveInstallRoot } from "./lib/install.js";
import { loadSelectionCatalog, resolveSelectionItems } from "./lib/selection-catalog.js";
import { runTabbedWizard } from "./lib/tui-wizard.js";
import type { Agent, CliOptions, InstallLocation, SelectionCatalog } from "./lib/types.js";

type EntryAction = "install-skills" | "install-libs";

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

  return runTabbedWizard(selectionCatalog, options);
}

async function resolveEntryAction(rawArgs: string[]): Promise<EntryAction | null> {
  if (rawArgs.length > 0 || !process.stdin.isTTY || !process.stdout.isTTY) {
    return null;
  }

  const prompt = createPromptSession();
  try {
    return await promptSingleSelect<EntryAction>(prompt, {
      message: "Choose an action",
      choices: [
        {
          value: "install-skills",
          label: "Install agent skills",
          description: "Open the terminal UI to install skills for Codex and Claude."
        },
        {
          value: "install-libs",
          label: "Install libs for AI",
          description: "Install shared AI libraries and tooling."
        }
      ]
    });
  } finally {
    await prompt.close();
  }
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
  const rawArgs = argv.slice(2);
  const entryAction = await resolveEntryAction(rawArgs);

  if (entryAction === "install-libs") {
    console.log("Install libs for AI is not implemented yet.");
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

  const { selectedSkills, selectedGroups, locations, agents } = await resolveSelections(selectionCatalog, options);

  console.log("");
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
}
