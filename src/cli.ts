import * as process from "node:process";
import { parseArgs, printHelp } from "./lib/args.js";
import { loadPackageConfig } from "./lib/config.js";
import { loadCatalogIndex, mergeSelectedItems } from "./lib/catalog.js";
import { createPromptSession, promptConfirm, promptMultiSelect, promptSingleSelect } from "./lib/prompts.js";
import { createGitHubClient } from "./lib/github.js";
import { detectExistingTargets, installPlannedItems, planInstallations, resolveInstallRoot } from "./lib/install.js";
import type {
  Agent,
  CatalogIndex,
  CliOptions,
  InstallLocation,
  ManifestItem,
  PlannedInstallation,
  PromptChoice
} from "./lib/types.js";

function formatSelectionChoices(items: ManifestItem[]): PromptChoice[] {
  return items.map((item) => {
    const compatibility = [item.targets.codex ? "codex" : null, item.targets.claude ? "claude" : null]
      .filter(Boolean)
      .join(", ");

    return {
      value: item.id,
      label: item.label,
      description: `${item.description || "No description"} [${compatibility || "unsupported"}]`
    };
  });
}

function formatGroupChoices(groups: CatalogIndex["groups"]): PromptChoice[] {
  return groups.map((group) => ({
    value: group.id,
    label: group.label,
    description: `${group.description || "No description"} (${group.items.length} skill${group.items.length === 1 ? "" : "s"})`
  }));
}

function printSelectionSummary(input: {
  location: InstallLocation;
  agent: Agent;
  installRoot: string;
  selectedSkills: string[];
  selectedGroups: string[];
  plannedItems: PlannedInstallation[];
}): void {
  console.log("");
  console.log("Install summary");
  console.log(`- Agent: ${input.agent}`);
  console.log(`- Location: ${input.location}`);
  console.log(`- Root: ${input.installRoot}`);
  console.log(`- Individual skills: ${input.selectedSkills.length ? input.selectedSkills.join(", ") : "none"}`);
  console.log(`- Groups: ${input.selectedGroups.length ? input.selectedGroups.join(", ") : "none"}`);
  console.log(`- Final items: ${input.plannedItems.map((item) => item.id).join(", ")}`);
}

async function resolveInteractiveSelections(
  index: CatalogIndex,
  options: CliOptions
): Promise<{
  selectedSkills: string[];
  selectedGroups: string[];
  location: InstallLocation;
  agent: Agent;
}> {
  const prompt = createPromptSession();

  try {
    const selectedSkills =
      options.skills.length > 0
        ? options.skills
        : await promptMultiSelect(prompt, {
            message: "Select individual skills",
            choices: formatSelectionChoices(index.individualSkills),
            allowEmpty: true
          });

    const selectedGroups =
      options.groups.length > 0
        ? options.groups
        : await promptMultiSelect(prompt, {
            message: "Select skill groups",
            choices: formatGroupChoices(index.groups),
            allowEmpty: true
          });

    const location =
      options.location ||
      (await promptSingleSelect<InstallLocation>(prompt, {
        message: "Select installation location",
        choices: [
          {
            value: "global",
            label: "global",
            description: "Install into the current user's home directory."
          },
          {
            value: "local",
            label: "local",
            description: "Install into this project's dot directories."
          }
        ]
      }));

    const agent =
      options.agent ||
      (await promptSingleSelect<Agent>(prompt, {
        message: "Select agent",
        choices: [
          {
            value: "codex",
            label: "codex",
            description: "Install as Codex skills."
          },
          {
            value: "claude",
            label: "claude",
            description: "Install as Claude custom agents."
          }
        ]
      }));

    return { selectedSkills, selectedGroups, location, agent };
  } finally {
    await prompt.close();
  }
}

function ensureNonInteractiveInputs(index: CatalogIndex, options: CliOptions): void {
  const missing: string[] = [];

  if (options.skills.length === 0 && options.groups.length === 0) {
    missing.push("--skills and/or --groups");
  }

  if (!options.location) {
    missing.push("--location");
  }

  if (!options.agent) {
    missing.push("--agent");
  }

  if (missing.length > 0) {
    throw new Error(`Non-interactive mode requires ${missing.join(", ")}. Run in a TTY for prompts.`);
  }

  const unknownSkills = options.skills.filter(
    (skillId) => !index.individualSkills.some((item) => item.id === skillId)
  );
  if (unknownSkills.length > 0) {
    throw new Error(`Unknown skill id(s): ${unknownSkills.join(", ")}`);
  }

  const unknownGroups = options.groups.filter(
    (groupId) => !index.groups.some((group) => group.id === groupId)
  );
  if (unknownGroups.length > 0) {
    throw new Error(`Unknown group id(s): ${unknownGroups.join(", ")}`);
  }
}

async function resolveSelections(
  index: CatalogIndex,
  options: CliOptions
): Promise<{
  selectedSkills: string[];
  selectedGroups: string[];
  location: InstallLocation;
  agent: Agent;
}> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    ensureNonInteractiveInputs(index, options);
    return {
      selectedSkills: options.skills,
      selectedGroups: options.groups,
      location: options.location as InstallLocation,
      agent: options.agent as Agent
    };
  }

  return resolveInteractiveSelections(index, options);
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
  const { command, options } = parseArgs(argv.slice(2));

  if (options.help || command === "help") {
    printHelp();
    return;
  }

  if (command !== "install") {
    throw new Error(`Unsupported command "${command}". Only "install" is available.`);
  }

  const config = await loadPackageConfig();
  const client = createGitHubClient(config.github);

  console.log("Loading remote catalogs...");
  const index = await loadCatalogIndex(client, config.github);

  if (index.individualSkills.length === 0 && index.groups.length === 0) {
    throw new Error("No installable skills or groups were found in the configured repository.");
  }

  const { selectedSkills, selectedGroups, location, agent } = await resolveSelections(index, options);
  const finalItems = mergeSelectedItems({
    individualSkills: index.individualSkills,
    groups: index.groups,
    selectedSkillIds: selectedSkills,
    selectedGroupIds: selectedGroups
  });

  if (finalItems.length === 0) {
    throw new Error("No skills were selected.");
  }

  const installRoot = resolveInstallRoot({ agent, location, cwd: process.cwd() });
  const plannedItems = planInstallations({
    items: finalItems,
    agent,
    installRoot
  });

  printSelectionSummary({
    location,
    agent,
    installRoot,
    selectedSkills,
    selectedGroups,
    plannedItems
  });

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

  if (index.warnings.length > 0) {
    console.log("");
    console.log("Catalog warnings");
    for (const warning of index.warnings) {
      console.log(`- ${warning}`);
    }
  }
}
