import { access, cp, mkdir, mkdtemp, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { normalizeManifestPath, resolveInsideRoot } from "./paths.js";
import type {
  Agent,
  GitHubClient,
  InstallLocation,
  InstallResult,
  ManifestItem,
  PlannedInstallation
} from "./types.js";

export function resolveInstallRoot(input: {
  agent: Agent;
  location: InstallLocation;
  cwd: string;
}): string {
  const homeDir = os.homedir();
  const globalRoot = input.agent === "codex" ? path.join(homeDir, ".codex") : path.join(homeDir, ".claude");
  const localRoot = input.agent === "codex" ? path.join(input.cwd, ".codex") : path.join(input.cwd, ".claude");

  if (input.location === "global") {
    return globalRoot;
  }

  if (input.location === "local") {
    return localRoot;
  }

  throw new Error(`Unsupported install location "${input.location}".`);
}

function defaultOutputPath(item: ManifestItem, agent: Agent): string {
  if (agent === "codex") {
    return path.posix.join("skills", item.id);
  }

  return path.posix.join("agents", `${item.id}.md`);
}

export function planInstallations(input: {
  items: ManifestItem[];
  agent: Agent;
  installRoot: string;
}): PlannedInstallation[] {
  return input.items.map((item) => {
    const target = item.targets[input.agent];
    if (!target) {
      throw new Error(`Skill "${item.id}" does not support the "${input.agent}" agent.`);
    }

    const outputPath = normalizeManifestPath(
      target.outputPath || defaultOutputPath(item, input.agent),
      `${item.id}.${input.agent}.outputPath`
    );

    return {
      ...item,
      agent: input.agent,
      targetType: target.type,
      outputPath,
      targetPath: resolveInsideRoot(input.installRoot, outputPath)
    };
  });
}

export async function detectExistingTargets(plannedItems: PlannedInstallation[]): Promise<PlannedInstallation[]> {
  const existingItems: PlannedInstallation[] = [];

  for (const item of plannedItems) {
    try {
      await access(item.targetPath);
      existingItems.push(item);
    } catch {
      // Target does not exist.
    }
  }

  return existingItems;
}

async function copyToTarget(input: {
  sourcePath: string;
  targetPath: string;
  targetType: "directory" | "file";
  overwriteExisting: boolean;
}): Promise<void> {
  await mkdir(path.dirname(input.targetPath), { recursive: true });

  if (input.overwriteExisting) {
    await rm(input.targetPath, { recursive: true, force: true });
  }

  const recursive = input.targetType === "directory";
  await cp(input.sourcePath, input.targetPath, {
    recursive,
    force: input.overwriteExisting,
    errorOnExist: !input.overwriteExisting
  });
}

export async function installPlannedItems(input: {
  plannedItems: PlannedInstallation[];
  client: GitHubClient;
  overwriteExisting: boolean;
  onProgress?: (item: PlannedInstallation) => void;
}): Promise<InstallResult[]> {
  const results: InstallResult[] = [];
  const archiveCache = new Map<string, string>();

  for (const item of input.plannedItems) {
    input.onProgress?.(item);

    let archivePath = archiveCache.get(item.sourceBranch);
    if (!archivePath) {
      archivePath = await input.client.getArchive({
        branch: item.sourceBranch,
        sha: item.sourceSha || "latest"
      });
      archiveCache.set(item.sourceBranch, archivePath);
    }

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "ai-tools-install-"));
    const extractedPath = await input.client.extractArchiveEntry({
      archivePath,
      entryPath: item.sourcePath,
      destinationDir: tempDir
    });

    await copyToTarget({
      sourcePath: extractedPath,
      targetPath: item.targetPath,
      targetType: item.targetType,
      overwriteExisting: input.overwriteExisting
    });

    results.push({
      id: item.id,
      targetPath: item.targetPath
    });
  }

  return results;
}
