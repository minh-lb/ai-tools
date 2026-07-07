import { mkdtemp, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import type {
  Agent,
  AiPlugin,
  GitHubClient,
  PluginInstallPlan,
  PluginInstallStep,
  PluginMode
} from "./types.js";

const LUMIN_PLUGIN_ENTRY = "plugins/lumin";
const LUMIN_MARKETPLACE_ENTRY = ".agents/plugins";
const LUMIN_TEMP_DIR_PREFIX = "ai-tools-plugin-lumin-";

function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function buildLuminSteps(input: {
  mode: PluginMode;
  agents: Agent[];
}): { steps: PluginInstallStep[]; notes: string[] } {
  const steps: PluginInstallStep[] = [];
  const notes: string[] = [
    "Lumin is loaded from the repository's dedicated plugins branch at install time.",
    "Lumin installs in global mode only through this CLI.",
    "The plugin installs namespaced host skills and an instruction layer so Codex and Claude can apply Lumin skills by context."
  ];

  for (const agent of uniq(input.agents)) {
    if (agent === "claude") {
      steps.push({
        id: `lumin-${input.mode}-claude`,
        plugin: "lumin",
        agent,
        phase: input.mode,
        title: `${input.mode === "install" ? "Install" : "Uninstall"} Lumin for Claude`,
        description: `${input.mode === "install" ? "Install" : "Remove"} Lumin in the user's Claude home directories.`,
        command: `sh plugins/lumin/scripts/${input.mode}-claude.sh --global`,
        runner: input.mode === "install" ? "setup-lumin-claude" : "remove-lumin-claude",
      });
      continue;
    }

    steps.push({
      id: `lumin-${input.mode}-codex`,
      plugin: "lumin",
      agent,
      phase: input.mode,
      title: `${input.mode === "install" ? "Install" : "Uninstall"} Lumin for Codex`,
      description: `${input.mode === "install" ? "Install" : "Remove"} the Lumin Codex plugin and global auto skill surface in the user's home directory.`,
      command: `sh plugins/lumin/scripts/${input.mode}-codex.sh`,
      runner: input.mode === "install" ? "setup-lumin-codex" : "remove-lumin-codex"
    });
  }

  if (steps.some((step) => step.agent === "codex")) {
    notes.push("Codex registration, auto skills, and the Lumin instruction layer are installed under the user's home directory.");
  }

  if (steps.some((step) => step.agent === "claude")) {
    notes.push("Claude install adds `/lumin:<skill>` commands and also installs `~/.agents/skills/lumin-*` for auto-apply behavior.");
  }

  return { steps, notes };
}

export function buildPluginInstallPlan(input: {
  mode: PluginMode;
  agents: Agent[];
  plugins: AiPlugin[];
  sourceBranch: string;
}): PluginInstallPlan {
  const plugins = uniq(input.plugins);
  const agents = uniq(input.agents);
  const steps: PluginInstallStep[] = [];
  const notes: string[] = [];

  for (const plugin of plugins) {
    if (plugin !== "lumin") {
      continue;
    }

    const lumin = buildLuminSteps({
      mode: input.mode,
      agents
    });
    steps.push(...lumin.steps);
    notes.push(...lumin.notes);
  }

  return {
    mode: input.mode,
    agents,
    plugins,
    sourceBranch: input.sourceBranch,
    steps,
    notes: uniq(notes)
  };
}

async function prepareLuminPluginRepo(input: {
  client: GitHubClient;
  branch: string;
}): Promise<{ pluginRoot: string; cleanup: () => Promise<void> }> {
  const archivePath = await input.client.getArchive({
    branch: input.branch,
    sha: "latest"
  });
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), LUMIN_TEMP_DIR_PREFIX));

  try {
    const pluginRoot = await input.client.extractArchiveEntry({
      archivePath,
      entryPath: LUMIN_PLUGIN_ENTRY,
      destinationDir: tempRoot
    });

    await input.client.extractArchiveEntry({
      archivePath,
      entryPath: LUMIN_MARKETPLACE_ENTRY,
      destinationDir: tempRoot
    });

    return {
      pluginRoot,
      cleanup: async () => {
        await rm(tempRoot, { recursive: true, force: true });
      }
    };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

function runShellCommand(command: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("/bin/sh", ["-lc", command], {
      cwd,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code}: ${command}`));
    });
  });
}

export async function executePluginInstallPlan(input: {
  cwd: string;
  client: GitHubClient;
  plan: PluginInstallPlan;
  onProgress?: (step: PluginInstallStep) => void;
}): Promise<void> {
  let luminRepo: { pluginRoot: string; cleanup: () => Promise<void> } | null = null;

  try {
    for (const step of input.plan.steps) {
      input.onProgress?.(step);

      if (step.plugin !== "lumin") {
        continue;
      }

      if (!luminRepo) {
        luminRepo = await prepareLuminPluginRepo({
          client: input.client,
          branch: input.plan.sourceBranch
        });
      }

      const scriptsDir = path.join(luminRepo.pluginRoot, "scripts");
      const codexGlobalRoot = os.homedir();

      if (step.runner === "setup-lumin-claude") {
        await runShellCommand(`sh "${path.join(scriptsDir, "install-claude.sh")}" --global`, luminRepo.pluginRoot);
        continue;
      }

      if (step.runner === "remove-lumin-claude") {
        await runShellCommand(`sh "${path.join(scriptsDir, "uninstall-claude.sh")}" --global`, luminRepo.pluginRoot);
        continue;
      }

      if (step.runner === "setup-lumin-codex") {
        await runShellCommand(`sh "${path.join(scriptsDir, "install-codex.sh")}"`, codexGlobalRoot);
        continue;
      }

      await runShellCommand(`sh "${path.join(scriptsDir, "uninstall-codex.sh")}"`, codexGlobalRoot);
    }
  } finally {
    await luminRepo?.cleanup();
  }
}
