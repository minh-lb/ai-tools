import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { mergeSelectedItems, validateManifest } from "./catalog.js";
import type {
  GitHubClient,
  ManifestFile,
  ManifestItem,
  PackageConfig,
  SelectionCatalog,
  SelectionGroup,
  SelectionSkill,
  SkillGroup
} from "./types.js";

interface RawSelectionEntry {
  id?: unknown;
  label?: unknown;
  description?: unknown;
  sourceBranch?: unknown;
}

interface RawSelectionCatalog {
  version?: unknown;
  skills?: unknown;
  groups?: unknown;
}

function validateSelectionEntry(
  rawEntry: unknown,
  kind: "skill" | "group",
  index: number
): SelectionSkill | SelectionGroup {
  if (!rawEntry || typeof rawEntry !== "object") {
    throw new Error(`Selection catalog ${kind} #${index + 1} must be an object.`);
  }

  const entry = rawEntry as RawSelectionEntry;
  if (typeof entry.id !== "string" || entry.id.trim() === "") {
    throw new Error(`Selection catalog ${kind} #${index + 1} is missing a valid id.`);
  }

  if (typeof entry.label !== "string" || entry.label.trim() === "") {
    throw new Error(`Selection catalog ${kind} "${entry.id}" is missing a valid label.`);
  }

  const sourceBranch =
    typeof entry.sourceBranch === "string" && entry.sourceBranch.trim() !== ""
      ? entry.sourceBranch.trim()
      : undefined;

  return {
    id: entry.id.trim(),
    label: entry.label.trim(),
    description:
      typeof entry.description === "string" && entry.description.trim() !== ""
        ? entry.description.trim()
        : "",
    sourceBranch
  };
}

export async function loadSelectionCatalog(config: PackageConfig): Promise<SelectionCatalog> {
  const catalogPath = path.join(config.packageRoot, config.selectionCatalogPath);
  const rawCatalogText = await readFile(catalogPath, "utf8");
  const rawCatalog = JSON.parse(rawCatalogText) as RawSelectionCatalog;

  if (rawCatalog.version !== 1) {
    throw new Error(`Selection catalog "${config.selectionCatalogPath}" must use version 1.`);
  }

  if (!Array.isArray(rawCatalog.skills) || !Array.isArray(rawCatalog.groups)) {
    throw new Error(`Selection catalog "${config.selectionCatalogPath}" must contain skills and groups arrays.`);
  }

  const skills = rawCatalog.skills.map((entry, index) => validateSelectionEntry(entry, "skill", index)) as SelectionSkill[];
  const groups = rawCatalog.groups.map((entry, index) => validateSelectionEntry(entry, "group", index)) as SelectionGroup[];

  return {
    version: 1,
    skills,
    groups
  };
}

async function fetchBranchManifest(
  client: GitHubClient,
  branch: string,
  manifestPath: string
): Promise<ManifestFile> {
  const rawManifest = await client.fetchManifest({
    branch,
    sha: "latest",
    manifestPath
  });

  return validateManifest(rawManifest, {
    branch,
    manifestPath
  });
}

export async function resolveSelectionItems(input: {
  client: GitHubClient;
  config: PackageConfig;
  selectionCatalog: SelectionCatalog;
  selectedSkillIds: string[];
  selectedGroupIds: string[];
}): Promise<ManifestItem[]> {
  const skillEntries = new Map(input.selectionCatalog.skills.map((entry) => [entry.id, entry]));
  const groupEntries = new Map(input.selectionCatalog.groups.map((entry) => [entry.id, entry]));
  const manifestCache = new Map<string, ManifestFile>();

  async function getManifest(branch: string): Promise<ManifestFile> {
    const cached = manifestCache.get(branch);
    if (cached) {
      return cached;
    }

    const manifest = await fetchBranchManifest(input.client, branch, input.config.github.manifestPath);
    manifestCache.set(branch, manifest);
    return manifest;
  }

  const selectedSkills: ManifestItem[] = [];
  for (const skillId of input.selectedSkillIds) {
    const selection = skillEntries.get(skillId);
    if (!selection) {
      throw new Error(`Unknown skill id "${skillId}" in selection catalog.`);
    }

    const sourceBranch = selection.sourceBranch || input.config.github.skillsBranch;
    const manifest = await getManifest(sourceBranch);
    const manifestItem = manifest.items.find((item) => item.id === selection.id);

    if (!manifestItem) {
      throw new Error(`Skill "${selection.id}" was not found in branch "${sourceBranch}".`);
    }

    selectedSkills.push(manifestItem);
  }

  const selectedGroups: SkillGroup[] = [];
  for (const groupId of input.selectedGroupIds) {
    const selection = groupEntries.get(groupId);
    if (!selection) {
      throw new Error(`Unknown group id "${groupId}" in selection catalog.`);
    }

    const sourceBranch = selection.sourceBranch || selection.id;
    const manifest = await getManifest(sourceBranch);
    if (manifest.type !== "group") {
      throw new Error(`Branch "${sourceBranch}" does not expose a group manifest.`);
    }

    selectedGroups.push({
      id: selection.id,
      label: selection.label,
      description: selection.description,
      branch: sourceBranch,
      items: manifest.items
    });
  }

  return mergeSelectedItems({
    individualSkills: selectedSkills,
    groups: selectedGroups,
    selectedSkillIds: input.selectedSkillIds,
    selectedGroupIds: input.selectedGroupIds
  });
}
