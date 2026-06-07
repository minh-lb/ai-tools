import { mkdtemp, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import type { BranchInfo, GitHubClient, PackageGithubConfig } from "./types.js";

async function ensureDirectory(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

function apiHeaders(): Record<string, string> {
  return {
    accept: "application/vnd.github+json",
    "user-agent": "ai-tools"
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: apiHeaders()
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

function runTar(args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("tar", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `tar exited with code ${code}`));
        return;
      }
      resolve(stdout);
    });
  });
}

async function getArchivePrefix(archivePath: string): Promise<string> {
  const output = await runTar(["-tf", archivePath], process.cwd());
  const firstLine = output.split(/\r?\n/).find(Boolean);

  if (!firstLine) {
    throw new Error(`Archive "${archivePath}" is empty.`);
  }

  const [prefix] = firstLine.split("/");
  if (!prefix) {
    throw new Error(`Could not detect archive prefix for "${archivePath}".`);
  }

  return prefix;
}

async function extractArchiveEntry(input: {
  archivePath: string;
  entryPath: string;
  destinationDir: string;
}): Promise<string> {
  const prefix = await getArchivePrefix(input.archivePath);
  await runTar(
    ["-xzf", input.archivePath, "-C", input.destinationDir, `${prefix}/${input.entryPath}`],
    process.cwd()
  );
  return path.join(input.destinationDir, prefix, input.entryPath);
}

async function readArchiveEntryText(input: {
  archivePath: string;
  entryPath: string;
}): Promise<string> {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ai-tools-manifest-"));
  try {
    const extractedPath = await extractArchiveEntry({
      archivePath: input.archivePath,
      entryPath: input.entryPath,
      destinationDir: tempRoot
    });
    return await readFile(extractedPath, "utf8");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

interface GitHubBranchApiResponse {
  name: string;
  commit?: {
    sha?: string;
  };
}

export function createGitHubClient(config: PackageGithubConfig): GitHubClient {
  const cacheRoot = path.join(os.homedir(), ".ai-tools", "cache");
  const archiveCacheRoot = path.join(cacheRoot, "archives");

  async function listBranches(): Promise<BranchInfo[]> {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/branches?per_page=100`;
    const branches = await fetchJson<GitHubBranchApiResponse[]>(url);
    return branches.map((branch) => ({
      name: branch.name,
      sha: branch.commit?.sha || "unknown"
    }));
  }

  async function getArchive(input: { branch: string; sha: string }): Promise<string> {
    await ensureDirectory(archiveCacheRoot);
    const archivePath = path.join(archiveCacheRoot, `${input.branch}-${input.sha}.tar.gz`);
    const shouldBypassCache = input.sha === "latest";

    if (!shouldBypassCache) {
      try {
        await stat(archivePath);
        return archivePath;
      } catch {
        // Download on cache miss.
      }
    }

    const archiveUrl = `https://codeload.github.com/${config.owner}/${config.repo}/tar.gz/refs/heads/${encodeURIComponent(input.branch)}`;
    const response = await fetch(archiveUrl, {
      headers: {
        "user-agent": "ai-tools"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download branch "${input.branch}" (${response.status}).`);
    }

    const archiveBuffer = Buffer.from(await response.arrayBuffer());
    const tempArchivePath = `${archivePath}.tmp`;
    await writeFile(tempArchivePath, archiveBuffer);
    await rename(tempArchivePath, archivePath);
    return archivePath;
  }

  async function fetchManifest(input: {
    branch: string;
    sha: string;
    manifestPath: string;
  }): Promise<unknown> {
    const archivePath = await getArchive({ branch: input.branch, sha: input.sha });
    const text = await readArchiveEntryText({
      archivePath,
      entryPath: input.manifestPath
    });
    return JSON.parse(text) as unknown;
  }

  return {
    config,
    listBranches,
    fetchManifest,
    getArchive,
    extractArchiveEntry
  };
}
