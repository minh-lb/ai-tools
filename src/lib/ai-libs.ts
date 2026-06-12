import { rm, stat, writeFile, readFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import type {
  Agent,
  AiLibrary,
  InstallScope,
  LibInstallPlan,
  LibInstallStep,
  LibraryMode,
  SupportedOs
} from "./types.js";

const ICM_INSTALL_COMMAND = "curl -fsSL https://raw.githubusercontent.com/rtk-ai/icm/main/install.sh | sh";
const RTK_INSTALL_COMMAND = "curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh";
const ICM_MARKER_START = "<!-- icm:start -->";
const ICM_MARKER_END = "<!-- icm:end -->";

export function detectSupportedHostOs(platform = process.platform): SupportedOs | null {
  if (platform === "darwin") {
    return "mac";
  }

  if (platform === "linux") {
    return "linux";
  }

  return null;
}

function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function quickInstallBinaryPath(binaryName: string): string {
  return path.join(os.homedir(), ".local", "bin", binaryName);
}

function buildRtkInstallSteps(agents: Agent[], scope: InstallScope): LibInstallStep[] {
  const steps: LibInstallStep[] = [
    {
      id: "rtk-install",
      library: "rtk",
      phase: "install",
      title: "Install RTK binary",
      description: "Install the upstream RTK binary with the verified quick installer.",
      command: RTK_INSTALL_COMMAND,
      runner: "shell"
    }
  ];

  if (agents.includes("claude")) {
    steps.push({
      id: "rtk-configure-claude",
      library: "rtk",
      phase: "configure",
      title: "Configure RTK for Claude",
      description: scope === "global"
        ? "Install RTK's Claude-oriented global integration."
        : "Install RTK's Claude-oriented local integration for the current project.",
      command: scope === "global" ? "rtk init -g" : "rtk init",
      runner: "shell"
    });
  }

  if (agents.includes("codex")) {
    steps.push({
      id: "rtk-configure-codex",
      library: "rtk",
      phase: "configure",
      title: "Configure RTK for Codex",
      description: scope === "global"
        ? "Install RTK's Codex hook configuration."
        : "Install RTK's Codex hook configuration for the current project.",
      command: scope === "global" ? "rtk init -g --codex" : "rtk init --codex",
      runner: "shell"
    });
  }

  return steps;
}

function buildRtkUninstallSteps(agents: Agent[], scope: InstallScope): LibInstallStep[] {
  const steps: LibInstallStep[] = [];

  if (agents.includes("claude")) {
    steps.push({
      id: "rtk-uninstall-claude",
      library: "rtk",
      phase: "uninstall",
      title: "Remove RTK Claude integration",
      description: scope === "global"
        ? "Remove RTK global artifacts for the default Claude mode."
        : "Remove RTK local artifacts for the default Claude mode in the current project.",
      command: scope === "global" ? "rtk init -g --uninstall" : "rtk init --uninstall",
      runner: "shell"
    });
  }

  if (agents.includes("codex")) {
    steps.push({
      id: "rtk-uninstall-codex",
      library: "rtk",
      phase: "uninstall",
      title: "Remove RTK Codex integration",
      description: scope === "global"
        ? "Remove RTK global Codex artifacts."
        : "Remove RTK local Codex artifacts in the current project.",
      command: scope === "global" ? "rtk init -g --codex --uninstall" : "rtk init --codex --uninstall",
      runner: "shell"
    });
  }

  if (scope === "global") {
    steps.push({
      id: "rtk-remove-binary",
      library: "rtk",
      phase: "cleanup",
      title: "Remove RTK quick-install binary",
      description: "Delete the RTK binary only from the standard quick-install path if it exists there.",
      command: `remove ${quickInstallBinaryPath("rtk")}`,
      runner: "remove-binary",
      path: quickInstallBinaryPath("rtk")
    });
  }

  return steps;
}

function buildGlobalIcmModes(agents: Agent[]): Array<"mcp" | "skill" | "hook"> {
  const modes: Array<"mcp" | "skill" | "hook"> = ["mcp"];

  if (agents.includes("claude")) {
    modes.push("skill", "hook");
  } else if (agents.includes("codex")) {
    modes.push("hook");
  }

  return uniq(modes);
}

function buildIcmInstallSteps(agents: Agent[], scope: InstallScope): LibInstallStep[] {
  const selectedAgents = agents.join(" + ");
  const steps: LibInstallStep[] = [
    {
      id: "icm-install",
      library: "icm",
      phase: "install",
      title: "Install ICM binary",
      description: "Install the upstream ICM binary with the verified quick installer.",
      command: ICM_INSTALL_COMMAND,
      runner: "shell"
    }
  ];

  if (scope === "local") {
    steps.push({
      id: "icm-init-cli-local",
      library: "icm",
      phase: "configure",
      title: "Configure ICM project instructions",
      description: `Inject ICM instructions for the selected agent set (${selectedAgents}) using upstream per-project mode.`,
      command: "icm init --mode cli --per_project",
      runner: "shell"
    });

    return steps;
  }

  for (const mode of buildGlobalIcmModes(agents)) {
    steps.push({
      id: `icm-init-${mode}`,
      library: "icm",
      phase: "configure",
      title: `Configure ICM (${mode})`,
      description: `Run ICM ${mode} setup for the selected agent set (${selectedAgents}).`,
      command: `icm init --mode ${mode}`,
      runner: "shell"
    });
  }

  return steps;
}

function buildIcmUninstallSteps(scope: InstallScope): LibInstallStep[] {
  if (scope === "local") {
    return [{
      id: "icm-local-cleanup",
      library: "icm",
      phase: "cleanup",
      title: "Remove ICM project instructions",
      description: "Remove only ICM-managed instruction blocks from the current project's local files.",
      command: "clean ICM blocks from current project",
      runner: "cleanup-icm-local"
    }];
  }

  return [];
}

export function buildLibInstallPlan(input: {
  mode: LibraryMode;
  os: SupportedOs;
  scope: InstallScope;
  agents: Agent[];
  libraries: AiLibrary[];
  platform?: NodeJS.Platform;
}): LibInstallPlan {
  const agents = uniq(input.agents);
  const libraries = uniq(input.libraries);
  const hostOs = detectSupportedHostOs(input.platform);
  const steps: LibInstallStep[] = [];
  const notes: string[] = [];

  for (const library of libraries) {
    if (library === "rtk") {
      if (input.mode === "install") {
        steps.push(...buildRtkInstallSteps(agents, input.scope));
        notes.push("RTK rewrites Bash commands. Built-in non-shell tools are not auto-rewritten.");
        notes.push("RTK uninstall removes RTK-managed assistant artifacts only; it does not edit unrelated shell or editor settings.");
      } else {
        steps.push(...buildRtkUninstallSteps(agents, input.scope));
        if (input.scope === "global") {
          notes.push("RTK binary cleanup only removes the quick-install path ~/.local/bin/rtk. Homebrew or cargo installs still require manual removal.");
        } else {
          notes.push("RTK local uninstall leaves the global binary in place to avoid breaking other projects or global hooks.");
        }
      }
      continue;
    }

    if (library === "icm") {
      if (input.mode === "install") {
        steps.push(...buildIcmInstallSteps(agents, input.scope));
        if (input.scope === "global") {
          notes.push("ICM init auto-detects supported tools on this machine and may update more global configs than the selected agent labels alone imply.");
        } else {
          notes.push("ICM local mode uses upstream --per_project CLI injection. Depending on upstream behavior, some global instruction files may still be touched.");
        }
      } else {
        steps.push(...buildIcmUninstallSteps(input.scope));
        if (input.scope === "global") {
          notes.push("Automatic global ICM uninstall is intentionally disabled in this CLI because upstream uninstall removes all detected ICM integrations, not only the selected agents.");
          notes.push("For safest cleanup, run `icm uninstall --audit` manually, review the plan, then use upstream uninstall yourself if the detected scope is acceptable.");
        } else {
          notes.push("ICM local uninstall only strips ICM-managed blocks from project files in the current directory and leaves global ICM config untouched.");
        }
      }
    }
  }

  if (input.mode === "install") {
    notes.unshift("Binary install still uses the upstream installer and writes to the user's bin directory even when scope is local.");
  }

  if (hostOs && hostOs !== input.os) {
    notes.unshift(`Selected OS is ${input.os}, but the current host is ${hostOs}. The installer always runs against the current machine.`);
  }

  if (!hostOs) {
    notes.unshift("This host OS is not one of the supported Mac/Linux targets. The upstream installers may fail.");
  }

  return {
    mode: input.mode,
    os: input.os,
    hostOs,
    scope: input.scope,
    agents,
    libraries,
    steps,
    notes
  };
}

export async function executeLibInstallPlan(input: {
  cwd: string;
  plan: LibInstallPlan;
  onProgress?: (step: LibInstallStep) => void;
}): Promise<void> {
  for (const step of input.plan.steps) {
    input.onProgress?.(step);

    if (step.runner === "remove-binary") {
      if (!step.path) {
        throw new Error(`Missing path for step "${step.id}".`);
      }
      await removeBinaryAtPath(step.path);
      continue;
    }

    if (step.runner === "cleanup-icm-local") {
      await cleanupIcmLocalBlocks(input.cwd);
      continue;
    }

    await runShellCommand(step.command, input.cwd);
  }
}

async function removeBinaryAtPath(targetPath: string): Promise<void> {
  try {
    const info = await stat(targetPath);
    if (!info.isFile()) {
      return;
    }
  } catch {
    return;
  }

  await rm(targetPath, { force: true });
}

async function cleanupIcmLocalBlocks(cwd: string): Promise<void> {
  const candidateFiles = [
    "CLAUDE.md",
    "AGENTS.md",
    ".github/copilot-instructions.md",
    ".windsurfrules",
    ".aider.conventions.md"
  ];

  for (const relativeFile of candidateFiles) {
    const absoluteFile = path.join(cwd, relativeFile);
    let content: string;
    try {
      content = await readFile(absoluteFile, "utf8");
    } catch {
      continue;
    }

    const cleaned = stripIcmBlocks(content);
    if (cleaned === content) {
      continue;
    }

    if (cleaned.trim().length === 0) {
      await rm(absoluteFile, { force: true });
      continue;
    }

    await writeFile(absoluteFile, cleaned, "utf8");
  }
}

function stripIcmBlocks(content: string): string {
  const blockPattern = new RegExp(
    `\\n?${escapeRegExp(ICM_MARKER_START)}[\\s\\S]*?${escapeRegExp(ICM_MARKER_END)}\\n?`,
    "g"
  );
  const stripped = content.replace(blockPattern, "\n");
  return stripped.replace(/\n{3,}/g, "\n\n").trimEnd() + (stripped.endsWith("\n") ? "\n" : "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
