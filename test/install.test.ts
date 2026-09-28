import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import {
  installPlannedItems,
  planInstallations,
  resolveInstallRoot
} from "../src/lib/install.js";
import type { GitHubClient, PlannedInstallation } from "../src/lib/types.js";

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
  assert.equal(resolveInstallRoot({ agent: "pi", location: "global", cwd }), path.join(os.homedir(), ".pi", "agent"));
  assert.equal(resolveInstallRoot({ agent: "pi", location: "local", cwd }), "/tmp/project/.pi");
});

test("planInstallations uses Pi skill folders when a manifest has a directory source", () => {
  const planned = planInstallations({
    items: [
      {
        id: "skill-1",
        label: "Skill One",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "skills/skill-1",
        targets: {
          codex: { type: "directory" }
        }
      }
    ],
    agent: "pi",
    installRoot: "/home/user/.pi/agent"
  });

  assert.equal(planned[0].targetType, "directory");
  assert.equal(planned[0].targetPath, "/home/user/.pi/agent/skills/skill-1");
});

test("planInstallations skips Pi fallback for file-only manifest targets", () => {
  const planned = planInstallations({
    items: [
      {
        id: "skill-1",
        label: "Skill One",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "skills/skill-1.md",
        targets: {
          claude: { type: "file" }
        }
      }
    ],
    agent: "pi",
    installRoot: "/home/user/.pi/agent"
  });

  assert.deepEqual(planned, []);
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

test("installPlannedItems copies a validated Pi skill directory to its target path", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ai-tools-test-"));
  const archiveSourceRoot = path.join(tempRoot, "repo-main");
  const skillDir = path.join(archiveSourceRoot, "skills", "skill-1");
  const nonSkillDir = path.join(archiveSourceRoot, "misc");
  const symlinkSkillDir = path.join(archiveSourceRoot, "with-symlink");
  const installRoot = path.join(tempRoot, ".pi", "agent");
  const archivePath = path.join(tempRoot, "skill-general-latest.tar.gz");

  await mkdir(skillDir, { recursive: true });
  await mkdir(nonSkillDir, { recursive: true });
  await mkdir(path.join(symlinkSkillDir, "nested"), { recursive: true });
  await writeFile(path.join(skillDir, "SKILL.md"), "# Skill One\n");
  await writeFile(path.join(nonSkillDir, "README.md"), "Not a Pi skill.\n");
  await writeFile(path.join(symlinkSkillDir, "SKILL.md"), "# Unsafe Pi skill\n");
  await symlink("../../skills/skill-1/SKILL.md", path.join(symlinkSkillDir, "nested", "linked.md"));
  await runTar(["-czf", archivePath, path.basename(archiveSourceRoot)], tempRoot);

  const plannedItems: PlannedInstallation[] = planInstallations({
    items: [
      {
        id: "skill-1",
        label: "Skill One",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "skills/skill-1",
        targets: { codex: { type: "directory" } }
      }
    ],
    agent: "pi",
    installRoot
  });

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

  const invalidPiPlan = planInstallations({
    items: [
      {
        id: "not-a-skill",
        label: "Not a skill",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "misc",
        targets: { codex: { type: "directory" } }
      }
    ],
    agent: "pi",
    installRoot
  });
  await assert.rejects(
    installPlannedItems({
      plannedItems: invalidPiPlan,
      client,
      overwriteExisting: true
    }),
    /source must be a directory with a regular SKILL\.md and no symbolic links/
  );
  await assert.rejects(
    readFile(path.join(installRoot, "skills", "not-a-skill", "README.md"), "utf8"),
    { code: "ENOENT" }
  );

  const symlinkPiPlan = planInstallations({
    items: [
      {
        id: "symlink-skill",
        label: "Symlink skill",
        description: "",
        sourceBranch: "skill-general",
        sourcePath: "with-symlink",
        targets: { codex: { type: "directory" } }
      }
    ],
    agent: "pi",
    installRoot
  });
  await assert.rejects(
    installPlannedItems({
      plannedItems: symlinkPiPlan,
      client,
      overwriteExisting: true
    }),
    /no symbolic links/
  );
  await assert.rejects(
    readFile(path.join(installRoot, "skills", "symlink-skill", "SKILL.md"), "utf8"),
    { code: "ENOENT" }
  );
});
