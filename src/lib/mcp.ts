import { spawn } from "node:child_process";
import { copyFile, readFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import type {
  Agent,
  McpInstallPlan,
  McpInstallSource,
  McpInstallStep,
  McpMode,
  McpServer,
  McpUninstallSafetyReport,
  SupportedOs
} from "./types.js";

const GITLAB_REMOTE_URL = "https://gitlab.com/api/v4/mcp";
const GITHUB_REMOTE_URL = "https://api.githubcopilot.com/mcp/";
const FIGMA_REMOTE_URL = "https://mcp.figma.com/mcp";

const MCP_SOURCES: Record<McpServer, McpInstallSource> = {
  antd: {
    server: "antd",
    label: "Ant Design MCP Server",
    url: "https://ant.design/docs/react/mcp/"
  },
  gitlab: {
    server: "gitlab",
    label: "GitLab MCP server",
    url: "https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/"
  },
  github: {
    server: "github",
    label: "GitHub MCP server",
    url: "https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md"
  },
  figma: {
    server: "figma",
    label: "Figma MCP server",
    url: "https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/"
  },
  shadcn: {
    server: "shadcn",
    label: "Shadcn MCP Server",
    url: "https://ui.shadcn.com/docs/mcp"
  }
};

function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}


function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAntdSteps(agent: Agent, mode: McpMode): McpInstallStep[] {
  if (mode === "uninstall") {
    return [{
      id: `antd-${agent}-remove`,
      server: "antd",
      agent,
      phase: "uninstall",
      title: "Remove Ant Design MCP config",
      description: `Remove the Ant Design MCP entry from ${agent}.`,
      command: agent === "codex" ? "codex mcp remove antd" : "claude mcp remove --scope local antd"
    }];
  }

  return [
    {
      id: "antd-cli-install",
      server: "antd",
      agent,
      phase: "install",
      title: "Install @ant-design/cli",
      description: "Install the official Ant Design CLI that exposes the `antd mcp` server.",
      command: "npm install -g @ant-design/cli"
    },
    {
      id: `antd-${agent}-add`,
      server: "antd",
      agent,
      phase: "configure",
      title: `Register Ant Design MCP in ${agent}`,
      description: "Configure the MCP client to launch `antd mcp` over stdio.",
      command: agent === "codex"
        ? "codex mcp add antd -- antd mcp"
        : "claude mcp add antd -- antd mcp"
    }
  ];
}

function buildGitLabSteps(agent: Agent, mode: McpMode): McpInstallStep[] {
  if (mode === "uninstall") {
    return agent === "codex"
      ? [{
        id: "gitlab-codex-remove",
        server: "gitlab",
        agent,
        phase: "uninstall",
        title: "Remove GitLab MCP config",
        description: "Delete the GitLab MCP entry from Codex.",
        command: "codex mcp remove gitlab"
      }]
      : [{
        id: "gitlab-claude-remove",
        server: "gitlab",
        agent,
        phase: "uninstall",
        title: "Remove GitLab MCP config",
        description: "Delete the GitLab MCP entry from Claude Code.",
        command: "claude mcp remove --scope local gitlab"
      }];
  }

  return agent === "codex"
    ? [
      {
        id: "gitlab-codex-add",
        server: "gitlab",
        agent,
        phase: "configure",
        title: "Register GitLab MCP in Codex",
        description: "Add the GitLab.com MCP endpoint to Codex using streamable HTTP.",
        command: `codex mcp add gitlab --url ${GITLAB_REMOTE_URL}`
      },
      {
        id: "gitlab-codex-login",
        server: "gitlab",
        agent,
        phase: "authenticate",
        title: "Authenticate GitLab MCP in Codex",
        description: "Start the GitLab OAuth flow after the server entry is added.",
        command: "codex mcp login gitlab"
      }
    ]
    : [{
      id: "gitlab-claude-add",
      server: "gitlab",
      agent,
      phase: "configure",
      title: "Register GitLab MCP in Claude Code",
      description: "Add the GitLab.com MCP endpoint to Claude Code over HTTP transport.",
      command: `claude mcp add --transport http gitlab ${GITLAB_REMOTE_URL}`
    }];
}

function buildGitHubSteps(agent: Agent, mode: McpMode): McpInstallStep[] {
  if (mode === "uninstall") {
    return [{
      id: `github-${agent}-remove`,
      server: "github",
      agent,
      phase: "uninstall",
      title: "Remove GitHub MCP config",
      description: `Delete the GitHub MCP entry from ${agent}.`,
      command: agent === "codex" ? "codex mcp remove github" : "claude mcp remove --scope local github"
    }];
  }

  return agent === "codex"
    ? [{
      id: "github-codex-add",
      server: "github",
      agent,
      phase: "configure",
      title: "Register GitHub MCP in Codex",
      description: "Add the hosted GitHub MCP server and reference `GITHUB_PAT_TOKEN` for PAT auth.",
      command: `codex mcp add github --url ${GITHUB_REMOTE_URL} --bearer-token-env-var GITHUB_PAT_TOKEN`
    }]
    : [{
      id: "github-claude-add",
      server: "github",
      agent,
      phase: "configure",
      title: "Register GitHub MCP in Claude Code",
      description: "Add the hosted GitHub MCP server and inject the PAT from `GITHUB_PAT_TOKEN`.",
      command: `claude mcp add --transport http github ${GITHUB_REMOTE_URL} --header "Authorization: Bearer \${GITHUB_PAT_TOKEN:?Set GITHUB_PAT_TOKEN first}"`
    }];
}

function buildFigmaSteps(agent: Agent, mode: McpMode): McpInstallStep[] {
  if (mode === "uninstall") {
    return agent === "codex"
      ? [{
        id: "figma-codex-remove",
        server: "figma",
        agent,
        phase: "uninstall",
        title: "Remove Figma MCP config",
        description: "Delete the Figma MCP entry from Codex.",
        command: "codex mcp remove figma"
      }]
      : [{
        id: "figma-claude-remove",
        server: "figma",
        agent,
        phase: "uninstall",
        title: "Remove Figma MCP config",
        description: "Delete the Figma MCP entry from Claude Code.",
        command: "claude mcp remove --scope local figma"
      }];
  }

  return agent === "codex"
    ? [{
      id: "figma-codex-add",
      server: "figma",
      agent,
      phase: "configure",
      title: "Register Figma MCP in Codex",
      description: "Add the remote Figma MCP endpoint. Codex will prompt for authentication.",
      command: `codex mcp add figma --url ${FIGMA_REMOTE_URL}`
    }]
    : [{
      id: "figma-claude-add",
      server: "figma",
      agent,
      phase: "configure",
      title: "Register Figma MCP in Claude Code",
      description: "Add the remote Figma MCP endpoint over HTTP transport.",
      command: `claude mcp add --transport http figma ${FIGMA_REMOTE_URL}`
    }];
}

function buildShadcnSteps(agent: Agent, mode: McpMode): McpInstallStep[] {
  if (mode === "uninstall") {
    return [{
      id: `shadcn-${agent}-remove`,
      server: "shadcn",
      agent,
      phase: "uninstall",
      title: "Remove Shadcn MCP config",
      description: `Delete the Shadcn MCP entry from ${agent}.`,
      command: agent === "codex" ? "codex mcp remove shadcn" : "claude mcp remove --scope local shadcn"
    }];
  }

  return [{
    id: `shadcn-${agent}-add`,
    server: "shadcn",
    agent,
    phase: "configure",
    title: `Register Shadcn MCP in ${agent}`,
    description: "Configure the MCP client to launch `shadcn@latest mcp` over stdio.",
    command: agent === "codex"
      ? "codex mcp add shadcn -- npx shadcn@latest mcp"
      : "claude mcp add shadcn -- npx shadcn@latest mcp"
  }];
}

function buildStepsForServer(server: McpServer, agent: Agent, mode: McpMode): McpInstallStep[] {
  if (server === "antd") {
    return buildAntdSteps(agent, mode);
  }

  if (server === "gitlab") {
    return buildGitLabSteps(agent, mode);
  }

  if (server === "github") {
    return buildGitHubSteps(agent, mode);
  }

  if (server === "figma") {
    return buildFigmaSteps(agent, mode);
  }

  return buildShadcnSteps(agent, mode);
}

function buildNotes(input: {
  agents: Agent[];
  mode: McpMode;
  servers: McpServer[];
}): string[] {
  const notes: string[] = [];

  if (input.servers.includes("antd")) {
    notes.push("Ant Design uses the official `antd mcp` stdio server from `@ant-design/cli` v6.3.5+.");
    if (input.mode === "uninstall") {
      notes.push("Removing Ant Design from the MCP client does not uninstall the global `@ant-design/cli` package.");
    }
  }

  if (input.servers.includes("gitlab")) {
    notes.push("GitLab defaults to the GitLab.com MCP endpoint. Self-managed GitLab instances still require a manual URL change.");
    if (input.agents.includes("claude") && input.mode === "install") {
      notes.push("After adding GitLab to Claude Code, open Claude and use `/mcp` to complete OAuth authorization.");
    }
    if (input.mode === "uninstall" && input.agents.includes("codex")) {
      notes.push("GitLab + Codex uninstall removes the MCP config only. It intentionally does not run `codex mcp logout gitlab`, so shared OAuth credentials are left untouched.");
    }
  }

  if (input.servers.includes("github")) {
    notes.push("GitHub remote MCP access requires a GitHub PAT. Use least-privilege scopes and keep the token out of source control.");
    if (input.agents.includes("codex")) {
      notes.push("Codex stores only the bearer-token environment variable name. Add `export GITHUB_PAT_TOKEN=<your-token>` to `~/.zshrc` or `~/.bashrc` and restart your terminal before launching Codex.");
    }
    if (input.agents.includes("claude")) {
      notes.push("Claude Code will store the expanded GitHub PAT in its MCP config when this install command runs. Remove the server or rotate the PAT if needed.");
    }
  }

  if (input.servers.includes("figma")) {
    notes.push("Figma recommends the remote MCP server and completes authentication with OAuth.");
    if (input.agents.includes("claude") && input.mode === "install") {
      notes.push("After adding Figma to Claude Code, open Claude and use `/mcp` to connect the server.");
    }
    if (input.mode === "uninstall" && input.agents.includes("codex")) {
      notes.push("Figma + Codex uninstall removes the MCP config only. It intentionally does not run `codex mcp logout figma`, so shared OAuth credentials are left untouched.");
    }
  }

  if (input.servers.includes("shadcn")) {
    notes.push("Shadcn runs as a stdio MCP server via `npx shadcn@latest mcp`.");
    notes.push("Shadcn expects a project-level `components.json`. The standard shadcn registry works without extra registry configuration.");
    if (input.agents.includes("codex")) {
      notes.push("Shadcn's official docs say the shadcn CLI cannot automatically update `~/.codex/config.toml`; this workflow uses Codex's own `codex mcp add` command to register the same stdio server.");
    }
  }

  return uniq(notes);
}

function buildPostInstallConfig(input: {
  agents: Agent[];
  mode: McpMode;
  servers: McpServer[];
}): string[] {
  if (input.mode === "uninstall") {
    return [];
  }

  const items: string[] = [];

  if (input.servers.includes("antd")) {
    items.push("Ant Design: no extra required configuration after registration. Optional: pin a specific docs version by changing the server args to `antd mcp --version <antd-version>`.");
  }

  if (input.servers.includes("gitlab")) {
    if (input.agents.includes("codex")) {
      items.push("GitLab + Codex: if the OAuth session is not already active, run `codex mcp login gitlab`. For self-managed GitLab, replace the default GitLab.com URL with your own instance URL.");
    }
    if (input.agents.includes("claude")) {
      items.push("GitLab + Claude: open Claude Code, run `/mcp`, select `gitlab`, then approve the OAuth request in your browser. Run `/mcp` again to verify the server shows as connected.");
    }
  }

  if (input.servers.includes("github")) {
    if (input.agents.includes("codex")) {
      items.push("GitHub + Codex: add `export GITHUB_PAT_TOKEN=<your-token>` to your shell profile (`~/.zshrc` or `~/.bashrc`), then restart your terminal before launching Codex. Ensure the PAT has the scopes you actually need (e.g. `repo`, `read:org`).");
    }
    if (input.agents.includes("claude")) {
      items.push("GitHub + Claude: no extra runtime configuration is needed if install succeeded, but the PAT used during install must have the required scopes. Rotate the PAT and reinstall the MCP entry if that token changes.");
    }
  }

  if (input.servers.includes("figma")) {
    if (input.agents.includes("codex")) {
      items.push("Figma + Codex: complete Figma OAuth when Codex prompts for it. If needed, run `codex mcp login figma` to re-trigger authentication.");
    }
    if (input.agents.includes("claude")) {
      items.push("Figma + Claude: open Claude Code, run `/mcp`, select `figma`, choose `Authenticate`, and approve `Allow Access` in the browser.");
    }
    items.push("Figma: for better output, keep working files open in Figma and consider adding Figma-specific rules/instructions for your agent.");
  }

  if (input.servers.includes("shadcn")) {
    items.push("Shadcn: ensure the project has a valid `components.json`. The default shadcn/ui registry works without extra registry configuration.");
    items.push("Shadcn: if you use private or third-party registries, add them under `registries` in `components.json` and provide any required secrets such as `REGISTRY_TOKEN` in `.env.local`.");
  }

  return uniq(items);
}

function hasCodexServerEntry(content: string, server: string): boolean {
  const escaped = escapeRegExp(server);
  return new RegExp(`^\\s*\\[mcp_servers\\.${escaped}\\]\\s*$`, "m").test(content);
}

function getCodexServerSection(content: string | null, server: string): string | null {
  if (!content) {
    return null;
  }

  const lines = content.split("\n");
  const escaped = escapeRegExp(server);
  const headerPattern = new RegExp(`^\\s*\\[mcp_servers\\.${escaped}\\]\\s*$`);
  const nextSectionPattern = /^\s*\[\[?.+\]?\]\s*$/;
  const startIndex = lines.findIndex((line) => headerPattern.test(line));

  if (startIndex === -1) {
    return null;
  }

  const sectionLines = [lines[startIndex]];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (nextSectionPattern.test(line)) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join("\n");
}

async function readFileIfExists(targetPath: string): Promise<string | null> {
  try {
    return await readFile(targetPath, "utf8");
  } catch {
    return null;
  }
}

function getClaudeProjectLocalServer(content: string | null, cwd: string, server: string): boolean {
  if (!content) {
    return false;
  }

  try {
    const parsed = JSON.parse(content) as {
      projects?: Record<string, { mcpServers?: Record<string, unknown> }>;
    };
    return Boolean(parsed.projects?.[cwd]?.mcpServers?.[server]);
  } catch {
    return false;
  }
}

function getClaudeUserServer(content: string | null, server: string): boolean {
  if (!content) {
    return false;
  }

  try {
    const parsed = JSON.parse(content) as {
      mcpServers?: Record<string, unknown>;
    };
    return Boolean(parsed.mcpServers?.[server]);
  } catch {
    return false;
  }
}

function getClaudeProjectScopeServer(content: string | null, server: string): boolean {
  if (!content) {
    return false;
  }

  try {
    const parsed = JSON.parse(content) as {
      mcpServers?: Record<string, unknown>;
    };
    return Boolean(parsed.mcpServers?.[server]);
  } catch {
    return false;
  }
}

function describeAgent(agent: Agent): string {
  return agent === "codex" ? "Codex" : "Claude";
}

function getStepAgent(step: McpInstallStep): Agent {
  return step.agent;
}

function codexIdentityMatches(server: McpServer, section: string | null): boolean {
  if (!section) {
    return false;
  }

  if (server === "antd") {
    return /command\s*=\s*"antd"/.test(section) && /args\s*=\s*\[[^\]]*"mcp"[^\]]*\]/.test(section);
  }

  if (server === "shadcn") {
    return /command\s*=\s*"npx"/.test(section)
      && /args\s*=\s*\[[^\]]*"shadcn@latest"[^\]]*"mcp"[^\]]*\]/.test(section);
  }

  if (server === "gitlab") {
    return new RegExp(`url\\s*=\\s*"${escapeRegExp(GITLAB_REMOTE_URL)}"`).test(section);
  }

  if (server === "github") {
    return new RegExp(`url\\s*=\\s*"${escapeRegExp(GITHUB_REMOTE_URL)}"`).test(section)
      && /bearer_token_env_var\s*=\s*"GITHUB_PAT_TOKEN"/.test(section);
  }

  return new RegExp(`url\\s*=\\s*"${escapeRegExp(FIGMA_REMOTE_URL)}"`).test(section);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function arrayIncludesStrings(value: unknown, expected: string[]): boolean {
  if (!Array.isArray(value) || value.length !== expected.length) {
    return false;
  }

  return expected.every((item, index) => value[index] === item);
}

function claudeIdentityMatches(server: McpServer, entry: unknown): boolean {
  if (!isRecord(entry)) {
    return false;
  }

  if (server === "antd") {
    return entry.command === "antd" && arrayIncludesStrings(entry.args, ["mcp"]);
  }

  if (server === "shadcn") {
    return entry.command === "npx" && arrayIncludesStrings(entry.args, ["shadcn@latest", "mcp"]);
  }

  if (server === "gitlab") {
    return entry.type === "http" && entry.url === GITLAB_REMOTE_URL;
  }

  if (server === "github") {
    return entry.type === "http" && entry.url === GITHUB_REMOTE_URL;
  }

  return entry.type === "http" && entry.url === FIGMA_REMOTE_URL;
}

async function createBackupIfExists(targetPath: string): Promise<string | null> {
  const content = await readFileIfExists(targetPath);
  if (content === null) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${targetPath}.ai-tools-backup-${timestamp}`;
  await copyFile(targetPath, backupPath);
  return backupPath;
}

export async function createMcpUninstallBackups(input: {
  cwd: string;
  steps: McpInstallStep[];
}): Promise<string[]> {
  const targets = new Set<string>();
  const homeDir = os.homedir();

  for (const step of input.steps) {
    const agent = getStepAgent(step);
    if (agent === "codex") {
      targets.add(path.join(homeDir, ".codex", "config.toml"));
    } else {
      targets.add(path.join(homeDir, ".claude.json"));
    }
  }

  const backups = await Promise.all([...targets].map((target) => createBackupIfExists(target)));
  return backups.filter((item): item is string => Boolean(item));
}

export async function inspectMcpUninstallSafety(input: {
  cwd: string;
  plan: McpInstallPlan;
}): Promise<McpUninstallSafetyReport> {
  if (input.plan.mode !== "uninstall") {
    return {
      effectiveSteps: input.plan.steps,
      safeNotes: [],
      skippedSteps: [],
      backupTargets: []
    };
  }

  const homeDir = os.homedir();
  const codexUserConfigPath = path.join(homeDir, ".codex", "config.toml");
  const codexProjectConfigPath = path.join(input.cwd, ".codex", "config.toml");
  const claudeHomeConfigPath = path.join(homeDir, ".claude.json");
  const claudeProjectConfigPath = path.join(input.cwd, ".mcp.json");

  const [codexUserConfig, codexProjectConfig, claudeHomeConfig, claudeProjectConfig] = await Promise.all([
    readFileIfExists(codexUserConfigPath),
    readFileIfExists(codexProjectConfigPath),
    readFileIfExists(claudeHomeConfigPath),
    readFileIfExists(claudeProjectConfigPath)
  ]);

  const effectiveSteps: McpInstallStep[] = [];
  const safeNotes: string[] = [];
  const skippedSteps: Array<{ step: McpInstallStep; reason: string }> = [];

  for (const step of input.plan.steps) {
    const agent = getStepAgent(step);
    const label = `${describeAgent(agent)} ${step.server}`;

    if (agent === "codex") {
      const existsInUser = codexUserConfig ? hasCodexServerEntry(codexUserConfig, step.server) : false;
      const existsInProject = codexProjectConfig ? hasCodexServerEntry(codexProjectConfig, step.server) : false;
      const userSection = getCodexServerSection(codexUserConfig, step.server);
      const userIdentityMatches = codexIdentityMatches(step.server, userSection);

      if (!existsInUser) {
        skippedSteps.push({
          step,
          reason: `${label}: no matching user-scoped entry was found in ${codexUserConfigPath}, so this remove step will be skipped.`
        });
      } else if (!userIdentityMatches) {
        skippedSteps.push({
          step,
          reason: `${label}: a user-scoped entry named "${step.server}" exists in ${codexUserConfigPath}, but it does not match the MCP identity this installer manages, so uninstall will skip it for safety.`
        });
      } else {
        effectiveSteps.push(step);
        safeNotes.push(`${label}: uninstall will remove only the entry in ${codexUserConfigPath}.`);
      }

      if (existsInProject) {
        safeNotes.push(`${label}: a project-scoped entry also exists in ${codexProjectConfigPath}; Codex will still see that entry after uninstall because ` + "`codex mcp remove`" + ` does not edit project config files.`);
      }

      continue;
    }

    const existsInLocal = getClaudeProjectLocalServer(claudeHomeConfig, input.cwd, step.server);
    const existsInUser = getClaudeUserServer(claudeHomeConfig, step.server);
    const existsInProject = getClaudeProjectScopeServer(claudeProjectConfig, step.server);
    let localEntry: unknown = null;

    if (claudeHomeConfig) {
      try {
        const parsed = JSON.parse(claudeHomeConfig) as {
          projects?: Record<string, { mcpServers?: Record<string, unknown> }>;
        };
        localEntry = parsed.projects?.[input.cwd]?.mcpServers?.[step.server] ?? null;
      } catch {
        localEntry = null;
      }
    }

    if (!existsInLocal) {
      skippedSteps.push({
        step,
        reason: `${label}: no matching local-scope entry was found for this project in ${claudeHomeConfigPath}, so this remove step will be skipped.`
      });
    } else if (!claudeIdentityMatches(step.server, localEntry)) {
      skippedSteps.push({
        step,
        reason: `${label}: a local-scope entry named "${step.server}" exists for this project in ${claudeHomeConfigPath}, but it does not match the MCP identity this installer manages, so uninstall will skip it for safety.`
      });
    } else {
      effectiveSteps.push(step);
      safeNotes.push(`${label}: uninstall targets only the local-scope entry for ${input.cwd} stored in ${claudeHomeConfigPath}.`);
    }

    if (existsInProject) {
      safeNotes.push(`${label}: a project-scoped entry also exists in ${claudeProjectConfigPath}; it will not be removed because this workflow uses ` + "`claude mcp remove --scope local`" + ` for safety.`);
    }

    if (existsInUser) {
      safeNotes.push(`${label}: a user-scoped entry also exists in ${claudeHomeConfigPath}; it will not be removed because this workflow uses ` + "`claude mcp remove --scope local`" + ` for safety.`);
    }
  }

  return {
    effectiveSteps,
    safeNotes: uniq(safeNotes),
    skippedSteps,
    backupTargets: uniq([
      ...effectiveSteps.filter((step) => getStepAgent(step) === "codex").map(() => codexUserConfigPath),
      ...effectiveSteps.filter((step) => getStepAgent(step) === "claude").map(() => claudeHomeConfigPath)
    ])
  };
}

function formatMcpSteps(steps: McpInstallStep[]): string {
  if (steps.length === 0) {
    return "(none)";
  }

  return steps.map((step) => `${step.id} -> ${step.command}`).join("; ");
}

function isSameMcpStep(left: McpInstallStep, right: McpInstallStep): boolean {
  return left.id === right.id
    && left.server === right.server
    && left.phase === right.phase
    && left.command === right.command;
}

export async function verifyMcpUninstallExecutionSafety(input: {
  cwd: string;
  originalPlan: McpInstallPlan;
  expectedSteps: McpInstallStep[];
}): Promise<McpUninstallSafetyReport> {
  if (input.originalPlan.mode !== "uninstall") {
    return {
      effectiveSteps: input.expectedSteps,
      safeNotes: [],
      skippedSteps: [],
      backupTargets: []
    };
  }

  const refreshedReport = await inspectMcpUninstallSafety({
    cwd: input.cwd,
    plan: input.originalPlan
  });
  const originalStepsById = new Map(input.originalPlan.steps.map((step) => [step.id, step]));
  const everyExpectedStepIsCanonical = input.expectedSteps.every((step) => {
    const canonicalStep = originalStepsById.get(step.id);
    return canonicalStep ? isSameMcpStep(step, canonicalStep) : false;
  });

  if (!everyExpectedStepIsCanonical) {
    throw new Error(
      "MCP uninstall safety verification failed because one or more removal commands no longer match the canonical uninstall plan."
    );
  }

  const stepsStillMatch = refreshedReport.effectiveSteps.length === input.expectedSteps.length
    && refreshedReport.effectiveSteps.every((step, index) => isSameMcpStep(step, input.expectedSteps[index]));

  if (!stepsStillMatch) {
    throw new Error(
      `MCP uninstall safety verification failed because the allowed uninstall steps changed after preflight. `
      + `Expected ${formatMcpSteps(input.expectedSteps)}. `
      + `Current ${formatMcpSteps(refreshedReport.effectiveSteps)}. `
      + "Re-run the uninstall flow and review the current MCP config before removing anything."
    );
  }

  return refreshedReport;
}

export function buildMcpInstallPlan(input: {
  mode: McpMode;
  agents: Agent[];
  servers: McpServer[];
  os: SupportedOs;
}): McpInstallPlan {
  const agents = uniq(input.agents);
  const servers = uniq(input.servers);
  const allSteps = agents.flatMap((agent) => servers.flatMap((server) => buildStepsForServer(server, agent, input.mode)));
  const seen = new Set<string>();
  const steps = allSteps.filter((step) => {
    if (seen.has(step.id)) return false;
    seen.add(step.id);
    return true;
  });

  return {
    mode: input.mode,
    agents,
    servers,
    os: input.os,
    steps,
    notes: buildNotes({
      agents,
      mode: input.mode,
      servers
    }),
    postInstallConfig: buildPostInstallConfig({
      agents,
      mode: input.mode,
      servers
    }),
    sources: servers.map((server) => MCP_SOURCES[server])
  };
}

export async function executeMcpInstallPlan(input: {
  cwd: string;
  plan: McpInstallPlan;
  onProgress?: (step: McpInstallStep) => void;
}): Promise<void> {
  for (const step of input.plan.steps) {
    input.onProgress?.(step);
    await runShellCommand(step.command, input.cwd);
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
