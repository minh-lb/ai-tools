import { access, cp, lstat, mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
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

const AGENT_INSTALL_DIR: Record<Agent, Record<InstallLocation, string>> = {
  codex: { global: ".codex", local: ".codex" },
  claude: { global: ".claude", local: ".claude" },
  pi: { global: ".pi/agent", local: ".pi" }
};

export function resolveInstallRoot(input: {
  agent: Agent;
  location: InstallLocation;
  cwd: string;
}): string {
  if (input.location !== "global" && input.location !== "local") {
    throw new Error(`Unsupported install location "${input.location}".`);
  }

  const basePath = input.location === "global" ? os.homedir() : input.cwd;
  const dir = AGENT_INSTALL_DIR[input.agent][input.location];

  return path.join(basePath, dir);
}

function defaultOutputPath(item: ManifestItem): string {
  return path.posix.join("skills", item.id);
}

export function planInstallations(input: {
  items: ManifestItem[];
  agent: Agent;
  installRoot: string;
}): PlannedInstallation[] {
  return input.items.flatMap((item) => {
    const explicitTarget = item.targets[input.agent];
    const piDirectoryFallback =
      input.agent === "pi" &&
      !explicitTarget &&
      Object.values(item.targets).some((existing) => existing?.type === "directory");
    const target = explicitTarget ?? (piDirectoryFallback ? { type: "directory" as const } : undefined);
    if (!target) {
      return [];
    }

    const outputPath = normalizeManifestPath(
      target.outputPath || defaultOutputPath(item),
      `${item.id}.${input.agent}.outputPath`
    );

    return [{
      ...item,
      sourcePath: target.sourcePath ?? item.sourcePath,
      agent: input.agent,
      targetType: target.type,
      outputPath,
      targetPath: resolveInsideRoot(input.installRoot, outputPath),
      ...(piDirectoryFallback ? { piDirectoryFallback: true } : {})
    }];
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

async function validatePiFallbackSource(sourcePath: string, skillId: string): Promise<void> {
  const invalidSourceMessage = `Cannot install "${skillId}" for Pi: source must be a directory with a regular SKILL.md and no symbolic links.`;
  const sourceStat = await lstat(sourcePath);
  let skillFileStat;
  try {
    skillFileStat = await lstat(path.join(sourcePath, "SKILL.md"));
  } catch {
    throw new Error(invalidSourceMessage);
  }

  if (!sourceStat.isDirectory() || !skillFileStat.isFile()) {
    throw new Error(invalidSourceMessage);
  }

  async function rejectSymbolicLinks(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      const entryStat = await lstat(entryPath);
      if (entryStat.isSymbolicLink()) {
        throw new Error(invalidSourceMessage);
      }
      if (entryStat.isDirectory()) {
        await rejectSymbolicLinks(entryPath);
      }
    }
  }

  await rejectSymbolicLinks(sourcePath);
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

    if (item.piDirectoryFallback) {
      await validatePiFallbackSource(extractedPath, item.id);
    }

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
