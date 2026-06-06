import { normalizeManifestPath } from "./paths.js";
import type {
  CatalogIndex,
  GitHubClient,
  ManifestFile,
  ManifestItem,
  PackageGithubConfig,
  SkillGroup,
  TargetConfig
} from "./types.js";

interface RawManifest {
  version?: unknown;
  type?: unknown;
  label?: unknown;
  description?: unknown;
  items?: unknown;
}

interface RawManifestItem {
  id?: unknown;
  label?: unknown;
  description?: unknown;
  sourcePath?: unknown;
  targets?: Record<string, unknown>;
}

function validateTarget(target: unknown, agent: string, skillId: string): TargetConfig {
  if (!target || typeof target !== "object") {
    throw new Error(`Skill "${skillId}" has an invalid ${agent} target.`);
  }

  const targetRecord = target as { type?: unknown; outputPath?: unknown };
  const type = targetRecord.type || "directory";
  if (type !== "directory" && type !== "file") {
    throw new Error(`Skill "${skillId}" has an invalid ${agent} target type "${String(type)}".`);
  }

  const outputPath =
    typeof targetRecord.outputPath === "string" && targetRecord.outputPath.trim() !== ""
      ? normalizeManifestPath(targetRecord.outputPath, `${skillId}.${agent}.outputPath`)
      : undefined;

  return { type, outputPath };
}

function attachBranchMetadata(items: ManifestItem[], branch: string, sha: string): ManifestItem[] {
  return items.map((item) => ({
    ...item,
    sourceBranch: branch,
    sourceSha: sha
  }));
}

export function validateManifest(
  rawManifest: unknown,
  input: { branch: string; manifestPath: string }
): ManifestFile {
  if (!rawManifest || typeof rawManifest !== "object") {
    throw new Error(`Manifest "${input.manifestPath}" in branch "${input.branch}" must be an object.`);
  }

  const manifest = rawManifest as RawManifest;
  if (manifest.version !== 1) {
    throw new Error(`Manifest "${input.manifestPath}" in branch "${input.branch}" must use version 1.`);
  }

  if (manifest.type !== "skills" && manifest.type !== "group") {
    throw new Error(
      `Manifest "${input.manifestPath}" in branch "${input.branch}" must declare type "skills" or "group".`
    );
  }

  if (!Array.isArray(manifest.items)) {
    throw new Error(`Manifest "${input.manifestPath}" in branch "${input.branch}" must contain an items array.`);
  }

  const items = manifest.items.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Manifest item #${index + 1} in branch "${input.branch}" must be an object.`);
    }

    const manifestItem = item as RawManifestItem;

    if (typeof manifestItem.id !== "string" || manifestItem.id.trim() === "") {
      throw new Error(`Manifest item #${index + 1} in branch "${input.branch}" is missing a valid id.`);
    }

    if (typeof manifestItem.label !== "string" || manifestItem.label.trim() === "") {
      throw new Error(`Manifest item "${manifestItem.id}" in branch "${input.branch}" is missing a valid label.`);
    }

    const sourcePath = normalizeManifestPath(manifestItem.sourcePath as string, `${manifestItem.id}.sourcePath`);

    if (!manifestItem.targets || typeof manifestItem.targets !== "object") {
      throw new Error(`Manifest item "${manifestItem.id}" in branch "${input.branch}" is missing targets.`);
    }

    const targets: ManifestItem["targets"] = {};
    if (manifestItem.targets.codex) {
      targets.codex = validateTarget(manifestItem.targets.codex, "codex", manifestItem.id);
    }

    if (manifestItem.targets.claude) {
      targets.claude = validateTarget(manifestItem.targets.claude, "claude", manifestItem.id);
    }

    if (!targets.codex && !targets.claude) {
      throw new Error(`Manifest item "${manifestItem.id}" in branch "${input.branch}" must support at least one agent.`);
    }

    return {
      id: manifestItem.id.trim(),
      label: manifestItem.label.trim(),
      description:
        typeof manifestItem.description === "string" && manifestItem.description.trim() !== ""
          ? manifestItem.description.trim()
          : "",
      sourcePath,
      sourceBranch: input.branch,
      targets
    } satisfies ManifestItem;
  });

  return {
    branch: input.branch,
    manifestPath: input.manifestPath,
    type: manifest.type,
    label:
      typeof manifest.label === "string" && manifest.label.trim() !== ""
        ? manifest.label.trim()
        : input.branch,
    description:
      typeof manifest.description === "string" && manifest.description.trim() !== ""
        ? manifest.description.trim()
        : "",
    items
  };
}

function isSkillGroup(group: SkillGroup | null): group is SkillGroup {
  return group !== null;
}

export async function loadCatalogIndex(
  client: GitHubClient,
  githubConfig: PackageGithubConfig
): Promise<CatalogIndex> {
  const warnings: string[] = [];
  const branches = await client.listBranches();
  const branchMap = new Map(branches.map((branch) => [branch.name, branch]));
  const skillsBranch = branchMap.get(githubConfig.skillsBranch);

  if (!skillsBranch) {
    throw new Error(`Configured skills branch "${githubConfig.skillsBranch}" was not found.`);
  }

  const skillManifestRaw = await client.fetchManifest({
    branch: skillsBranch.name,
    sha: skillsBranch.sha,
    manifestPath: githubConfig.manifestPath
  });
  const skillManifest = validateManifest(skillManifestRaw, {
    branch: skillsBranch.name,
    manifestPath: githubConfig.manifestPath
  });

  const excludedBranches = new Set([
    githubConfig.skillsBranch,
    ...githubConfig.excludeBranches,
    githubConfig.defaultBranch
  ]);

  const groupBranches = branches.filter((branch) => !excludedBranches.has(branch.name));

  const groupResults = await Promise.all(
    groupBranches.map(async (branch): Promise<SkillGroup | null> => {
      try {
        const rawManifest = await client.fetchManifest({
          branch: branch.name,
          sha: branch.sha,
          manifestPath: githubConfig.manifestPath
        });

        const manifest = validateManifest(rawManifest, {
          branch: branch.name,
          manifestPath: githubConfig.manifestPath
        });

        if (manifest.type !== "group") {
          warnings.push(`Skipped branch "${branch.name}" because its manifest type is "${manifest.type}".`);
          return null;
        }

        return {
          id: branch.name,
          label: manifest.label,
          description: manifest.description,
          branch: branch.name,
          items: attachBranchMetadata(manifest.items, branch.name, branch.sha)
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        warnings.push(`Skipped branch "${branch.name}": ${message}`);
        return null;
      }
    })
  );

  return {
    individualSkills: attachBranchMetadata(skillManifest.items, skillsBranch.name, skillsBranch.sha),
    groups: groupResults.filter(isSkillGroup),
    warnings
  };
}

export function mergeSelectedItems(input: {
  individualSkills: ManifestItem[];
  groups: SkillGroup[];
  selectedSkillIds: string[];
  selectedGroupIds: string[];
}): ManifestItem[] {
  const selectedItems: ManifestItem[] = [];
  const skillMap = new Map(input.individualSkills.map((item) => [item.id, item]));
  const groupMap = new Map(input.groups.map((group) => [group.id, group]));

  for (const skillId of input.selectedSkillIds) {
    const skill = skillMap.get(skillId);
    if (!skill) {
      throw new Error(`Unknown skill id "${skillId}".`);
    }
    selectedItems.push(skill);
  }

  for (const groupId of input.selectedGroupIds) {
    const group = groupMap.get(groupId);
    if (!group) {
      throw new Error(`Unknown group id "${groupId}".`);
    }
    selectedItems.push(...group.items);
  }

  const dedupedItems = new Map<string, ManifestItem>();
  for (const item of selectedItems) {
    const existing = dedupedItems.get(item.id);
    if (!existing) {
      dedupedItems.set(item.id, item);
      continue;
    }

    const sameSource =
      existing.sourceBranch === item.sourceBranch &&
      existing.sourcePath === item.sourcePath &&
      JSON.stringify(existing.targets) === JSON.stringify(item.targets);

    if (!sameSource) {
      throw new Error(
        `Skill id "${item.id}" was selected from multiple incompatible sources. Keep ids unique across skill and group manifests.`
      );
    }
  }

  return [...dedupedItems.values()];
}
