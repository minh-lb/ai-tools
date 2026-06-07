import * as process from "node:process";
import { loadPackageConfig } from "./lib/config.js";
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
import { blessedSelect } from "./lib/tui-utils.js";
import { runEntryMenu } from "./lib/tui-entry-menu.js";
import { runProjectDocsWizard } from "./lib/tui-project-docs.js";
import { runTabbedWizard } from "./lib/tui-wizard.js";
import type { Agent, InstallLocation, SelectionCatalog } from "./lib/types.js";

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

export async function runCli(): Promise<void> {
  while (true) {
    const entryAction = await runEntryMenu();

    if (entryAction === "cancel") {
      return;
    }

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
        continue;
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
      console.log("");
      console.log("Skipped (agent not supported by skill):");
      for (const line of skipped) {
        console.log(line);
      }
    }

    const existingTargets = await detectExistingTargets(plannedItems);
    let overwriteExisting = false;

    if (existingTargets.length > 0) {
      console.log("");
      console.log("Existing targets detected:");
      for (const item of existingTargets) {
        console.log(`- ${item.id}: ${item.targetPath}`);
      }

      const answer = await blessedSelect({
        message: "Overwrite all existing targets?",
        choices: [
          { value: "no", label: "No — keep existing files" },
          { value: "yes", label: "Yes — overwrite all" }
        ]
      });
      overwriteExisting = answer === "yes";

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
