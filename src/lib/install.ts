import { access, cp, mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { normalizeManifestPath, resolveInsideRoot } from "./paths.js";
import type {
  Agent,
  GitHubClient,
  InstallLocation,
  InstallResult,
  ManifestItem,
  PlannedInstallation,
  ProjectDocsPlannedInstallation,
  ProjectDocsSkill
} from "./types.js";

const AGENT_INSTALL_DIR: Record<Agent, string> = {
  codex: ".codex",
  claude: ".claude"
};

export function resolveInstallRoot(input: {
  agent: Agent;
  location: InstallLocation;
  cwd: string;
}): string {
  const dir = AGENT_INSTALL_DIR[input.agent];

  if (input.location === "global") {
    return path.join(os.homedir(), dir);
  }

  if (input.location === "local") {
    return path.join(input.cwd, dir);
  }

  throw new Error(`Unsupported install location "${input.location}".`);
}

export function resolveProjectDocsRoot(cwd: string): string {
  return cwd;
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
    const target = item.targets[input.agent];
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
      targetPath: resolveInsideRoot(input.installRoot, outputPath)
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

export function planProjectDocsInstallations(input: {
  skills: ProjectDocsSkill[];
  cwd: string;
}): ProjectDocsPlannedInstallation[] {
  const installRoot = resolveProjectDocsRoot(input.cwd);

  return input.skills.map((skill) => {
    if (!skill.sourceBranch) {
      throw new Error(`Project docs skill "${skill.id}" is missing sourceBranch.`);
    }

    if (!skill.sourcePath) {
      throw new Error(`Project docs skill "${skill.id}" is missing sourcePath.`);
    }

    return {
      id: skill.id,
      label: skill.label,
      description: skill.description,
      sourceBranch: skill.sourceBranch,
      sourcePath: skill.sourcePath,
      targetPath: installRoot
    };
  });
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

async function copyDirectoryContents(input: {
  sourceDir: string;
  targetDir: string;
  overwriteExisting: boolean;
}): Promise<void> {
  await mkdir(input.targetDir, { recursive: true });
  const entries = await readdir(input.sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(input.sourceDir, entry.name);
    const targetPath = path.join(input.targetDir, entry.name);

    if (input.overwriteExisting) {
      await rm(targetPath, { recursive: true, force: true });
    }

    await cp(sourcePath, targetPath, {
      recursive: entry.isDirectory(),
      force: input.overwriteExisting,
      errorOnExist: !input.overwriteExisting
    });
  }
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

export async function installProjectDocsItems(input: {
  plannedItems: ProjectDocsPlannedInstallation[];
  client: GitHubClient;
  overwriteExisting: boolean;
  onProgress?: (item: ProjectDocsPlannedInstallation) => void;
}): Promise<InstallResult[]> {
  const results: InstallResult[] = [];
  const archiveCache = new Map<string, string>();

  for (const item of input.plannedItems) {
    input.onProgress?.(item);

    let archivePath = archiveCache.get(item.sourceBranch);
    if (!archivePath) {
      archivePath = await input.client.getArchive({
        branch: item.sourceBranch,
        sha: "latest"
      });
      archiveCache.set(item.sourceBranch, archivePath);
    }

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "ai-tools-project-docs-"));
    const extractedPath = await input.client.extractArchiveEntry({
      archivePath,
      entryPath: item.sourcePath,
      destinationDir: tempDir
    });

    await copyDirectoryContents({
      sourceDir: extractedPath,
      targetDir: item.targetPath,
      overwriteExisting: input.overwriteExisting
    });

    results.push({
      id: item.id,
      targetPath: item.targetPath
    });
  }

  return results;
}
