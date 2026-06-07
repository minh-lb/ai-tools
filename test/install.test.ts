import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import {
  installPlannedItems,
  installProjectDocsItems,
  planInstallations,
  planProjectDocsInstallations,
  resolveInstallRoot
} from "../src/lib/install.js";
import type { GitHubClient, PlannedInstallation, ProjectDocsPlannedInstallation } from "../src/lib/types.js";

function runTar(args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("tar", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `tar exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

test("resolveInstallRoot maps agent and location", () => {
  const cwd = "/tmp/project";

  assert.equal(resolveInstallRoot({ agent: "codex", location: "local", cwd }), "/tmp/project/.codex");
  assert.equal(resolveInstallRoot({ agent: "claude", location: "local", cwd }), "/tmp/project/.claude");
});

test("planInstallations applies codex default output path", () => {
  const planned = planInstallations({
    items: [
      {
        id: "skill-1",
        label: "Skill One",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "skills/skill-1",
        targets: {
          codex: {
            type: "directory"
          }
        }
      }
    ],
    agent: "codex",
    installRoot: "/tmp/.codex"
  });

  assert.equal(planned[0].outputPath, "skills/skill-1");
  assert.equal(planned[0].targetPath, path.resolve("/tmp/.codex/skills/skill-1"));
});

test("installPlannedItems extracts and copies a skill directory", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ai-tools-test-"));
  const archiveSourceRoot = path.join(tempRoot, "repo-main");
  const skillDir = path.join(archiveSourceRoot, "skills", "skill-1");
  const installRoot = path.join(tempRoot, "install-root");
  const archivePath = path.join(tempRoot, "skill-general-latest.tar.gz");

  await mkdir(skillDir, { recursive: true });
  await writeFile(path.join(skillDir, "SKILL.md"), "# Skill One\n");
  await runTar(["-czf", archivePath, path.basename(archiveSourceRoot)], tempRoot);

  const plannedItems: PlannedInstallation[] = [
    {
      id: "skill-1",
      label: "Skill One",
      description: "",
      sourceBranch: "skill-general",
      sourcePath: "skills/skill-1",
      targets: {},
      agent: "codex",
      targetType: "directory",
      outputPath: "skills/skill-1",
      targetPath: path.join(installRoot, "skills", "skill-1")
    }
  ];

  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [];
    },
    async fetchManifest() {
      return {};
    },
    async getArchive() {
      return archivePath;
    },
    async extractArchiveEntry(input) {
      const extractedRoot = path.join(input.destinationDir, "repo-main");
      await runTar(["-xzf", input.archivePath, "-C", input.destinationDir, `repo-main/${input.entryPath}`], tempRoot);
      return path.join(extractedRoot, input.entryPath);
    }
  };

  await installPlannedItems({
    plannedItems,
    client,
    overwriteExisting: true
  });

  const installedSkill = await readFile(
    path.join(installRoot, "skills", "skill-1", "SKILL.md"),
    "utf8"
  );

  assert.equal(installedSkill, "# Skill One\n");
});

test("planProjectDocsInstallations targets the current working directory", () => {
  const planned = planProjectDocsInstallations({
    cwd: "/tmp/project",
    skills: [
      {
        id: "laravel-ddd",
        label: "Laravel DDD",
        description: "",
        sourceBranch: "project-docs",
        sourcePath: "laravel-ddd"
      }
    ]
  });

  assert.equal(planned[0].targetPath, "/tmp/project");
});

test("installProjectDocsItems copies only the folder contents into cwd", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ai-tools-project-docs-test-"));
  const archiveSourceRoot = path.join(tempRoot, "repo-main");
  const docsDir = path.join(archiveSourceRoot, "laravel-ddd");
  const installRoot = path.join(tempRoot, "install-root");
  const archivePath = path.join(tempRoot, "project-docs-latest.tar.gz");

  await mkdir(path.join(docsDir, "guides"), { recursive: true });
  await mkdir(installRoot, { recursive: true });
  await writeFile(path.join(docsDir, "README.md"), "# Laravel DDD\n");
  await writeFile(path.join(docsDir, "guides", "intro.md"), "intro\n");
  await runTar(["-czf", archivePath, path.basename(archiveSourceRoot)], tempRoot);

  const plannedItems: ProjectDocsPlannedInstallation[] = [
    {
      id: "laravel-ddd",
      label: "Laravel DDD",
      description: "",
      sourceBranch: "project-docs",
      sourcePath: "laravel-ddd",
      targetPath: installRoot
    }
  ];

  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [];
    },
    async fetchManifest() {
      return {};
    },
    async getArchive() {
      return archivePath;
    },
    async extractArchiveEntry(input) {
      const extractedRoot = path.join(input.destinationDir, "repo-main");
      await runTar(["-xzf", input.archivePath, "-C", input.destinationDir, `repo-main/${input.entryPath}`], tempRoot);
      return path.join(extractedRoot, input.entryPath);
    }
  };

  await installProjectDocsItems({
    plannedItems,
    client,
    overwriteExisting: true
  });

  const installedReadme = await readFile(path.join(installRoot, "README.md"), "utf8");
  const installedGuide = await readFile(path.join(installRoot, "guides", "intro.md"), "utf8");
  const installRootEntries = await readdir(installRoot);

  assert.equal(installedReadme, "# Laravel DDD\n");
  assert.equal(installedGuide, "intro\n");
  assert.ok(!installRootEntries.includes("laravel-ddd"));
});
