import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
  buildMcpInstallPlan,
  createMcpUninstallBackups,
  inspectMcpUninstallSafety,
  verifyMcpUninstallExecutionSafety
} from "../src/lib/mcp.js";

test("buildMcpInstallPlan creates Codex install steps for Ant Design and Figma", () => {
  const plan = buildMcpInstallPlan({
    mode: "install",
    agents: ["codex"],
    servers: ["antd", "figma"],
    os: "mac"
  });

  assert.equal(plan.mode, "install");
  assert.deepEqual(plan.agents, ["codex"]);
  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "npm install -g @ant-design/cli",
      "codex mcp add antd -- antd mcp",
      "codex mcp add figma --url https://mcp.figma.com/mcp"
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("remote MCP server")));
  assert.ok(plan.postInstallConfig.some((item) => item.includes("Figma + Codex")));
});

test("buildMcpInstallPlan creates GitLab OAuth steps for Codex", () => {
  const plan = buildMcpInstallPlan({
    mode: "install",
    agents: ["codex"],
    servers: ["gitlab"],
    os: "mac"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "codex mcp add gitlab --url https://gitlab.com/api/v4/mcp",
      "codex mcp login gitlab"
    ]
  );
  assert.ok(plan.postInstallConfig.some((item) => item.includes("GitLab + Codex")));
});

test("buildMcpInstallPlan uses PAT-based setup for GitHub on Claude", () => {
  const plan = buildMcpInstallPlan({
    mode: "install",
    agents: ["claude"],
    servers: ["github"],
    os: "mac"
  });

  assert.equal(plan.steps.length, 1);
  assert.match(plan.steps[0].command, /claude mcp add --transport http github/);
  assert.match(plan.steps[0].command, /GITHUB_PAT_TOKEN/);
  assert.ok(plan.notes.some((note) => note.includes("store the expanded GitHub PAT")));
  assert.ok(plan.postInstallConfig.some((item) => item.includes("GitHub + Claude")));
});

test("buildMcpInstallPlan creates uninstall steps for Claude", () => {
  const plan = buildMcpInstallPlan({
    mode: "uninstall",
    agents: ["claude"],
    servers: ["antd", "figma", "gitlab"],
    os: "mac"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "claude mcp remove --scope local antd",
      "claude mcp remove --scope local figma",
      "claude mcp remove --scope local gitlab"
    ]
  );
  assert.deepEqual(plan.postInstallConfig, []);
});

test("buildMcpInstallPlan supports installing the same MCPs for both agents", () => {
  const plan = buildMcpInstallPlan({
    mode: "install",
    agents: ["codex", "claude"],
    servers: ["figma"],
    os: "mac"
  });

  assert.deepEqual(plan.agents, ["codex", "claude"]);
  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "codex mcp add figma --url https://mcp.figma.com/mcp",
      "claude mcp add --transport http figma https://mcp.figma.com/mcp"
    ]
  );
});

test("buildMcpInstallPlan adds shadcn stdio configuration for both agents", () => {
  const plan = buildMcpInstallPlan({
    mode: "install",
    agents: ["codex", "claude"],
    servers: ["shadcn"],
    os: "mac"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "codex mcp add shadcn -- npx shadcn@latest mcp",
      "claude mcp add shadcn -- npx shadcn@latest mcp"
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("components.json")));
  assert.ok(plan.notes.some((note) => note.includes("cannot automatically update `~/.codex/config.toml`")));
  assert.ok(plan.postInstallConfig.some((item) => item.includes("components.json")));
});

test("buildMcpInstallPlan removes shadcn from Claude", () => {
  const plan = buildMcpInstallPlan({
    mode: "uninstall",
    agents: ["claude"],
    servers: ["shadcn"],
    os: "mac"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    ["claude mcp remove --scope local shadcn"]
  );
});

test("inspectMcpUninstallSafety keeps only codex user-config removals and warns about project config", async () => {
  const tempHome = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-home-"));
  const tempProject = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-project-"));
  const originalHome = process.env.HOME;

  process.env.HOME = tempHome;
  await mkdir(path.join(tempHome, ".codex"), { recursive: true });
  await mkdir(path.join(tempProject, ".codex"), { recursive: true });
  await writeFile(
    path.join(tempHome, ".codex", "config.toml"),
    [
      "[mcp_servers.github]",
      'url = "https://api.githubcopilot.com/mcp/"',
      'bearer_token_env_var = "GITHUB_PAT_TOKEN"',
      ""
    ].join("\n"),
    "utf8"
  );
  await writeFile(
    path.join(tempProject, ".codex", "config.toml"),
    [
      "[mcp_servers.github]",
      'command = "npx"',
      ""
    ].join("\n"),
    "utf8"
  );

  try {
    const plan = buildMcpInstallPlan({
      mode: "uninstall",
      agents: ["codex"],
      servers: ["github"],
      os: "mac"
    });
    const report = await inspectMcpUninstallSafety({
      cwd: tempProject,
      plan
    });

    assert.equal(report.effectiveSteps.length, 1);
    assert.equal(report.skippedSteps.length, 0);
    assert.ok(report.safeNotes.some((note) => note.includes(".codex/config.toml")));
    assert.ok(report.safeNotes.some((note) => note.includes("does not edit project config files")));
    assert.equal(report.backupTargets.length, 1);
  } finally {
    process.env.HOME = originalHome;
  }
});

test("inspectMcpUninstallSafety skips claude local removal when only user scope exists", async () => {
  const tempHome = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-home-"));
  const tempProject = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-project-"));
  const originalHome = process.env.HOME;

  process.env.HOME = tempHome;
  await writeFile(
    path.join(tempHome, ".claude.json"),
    JSON.stringify({
      mcpServers: {
        github: {
          type: "http",
          url: "https://api.githubcopilot.com/mcp/"
        }
      }
    }, null, 2),
    "utf8"
  );

  try {
    const plan = buildMcpInstallPlan({
      mode: "uninstall",
      agents: ["claude"],
      servers: ["github"],
      os: "mac"
    });
    const report = await inspectMcpUninstallSafety({
      cwd: tempProject,
      plan
    });

    assert.equal(report.effectiveSteps.length, 0);
    assert.equal(report.skippedSteps.length, 1);
    assert.match(report.skippedSteps[0].reason, /no matching local-scope entry/i);
    assert.ok(report.safeNotes.some((note) => note.includes("user-scoped entry also exists")));
    assert.deepEqual(report.backupTargets, []);
  } finally {
    process.env.HOME = originalHome;
  }
});

test("inspectMcpUninstallSafety skips codex removal when same server name has different identity", async () => {
  const tempHome = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-home-"));
  const tempProject = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-project-"));
  const originalHome = process.env.HOME;

  process.env.HOME = tempHome;
  await mkdir(path.join(tempHome, ".codex"), { recursive: true });
  await writeFile(
    path.join(tempHome, ".codex", "config.toml"),
    [
      "[mcp_servers.github]",
      'command = "npx"',
      'args = ["not-github", "mcp"]',
      ""
    ].join("\n"),
    "utf8"
  );

  try {
    const plan = buildMcpInstallPlan({
      mode: "uninstall",
      agents: ["codex"],
      servers: ["github"],
      os: "mac"
    });
    const report = await inspectMcpUninstallSafety({
      cwd: tempProject,
      plan
    });

    assert.equal(report.effectiveSteps.length, 0);
    assert.equal(report.skippedSteps.length, 1);
    assert.match(report.skippedSteps[0].reason, /does not match the MCP identity/i);
  } finally {
    process.env.HOME = originalHome;
  }
});

test("createMcpUninstallBackups writes backup copies for touched config files", async () => {
  const tempHome = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-home-"));
  const originalHome = process.env.HOME;

  process.env.HOME = tempHome;
  await mkdir(path.join(tempHome, ".codex"), { recursive: true });
  await writeFile(path.join(tempHome, ".codex", "config.toml"), "[mcp_servers.github]\n", "utf8");

  try {
    const backups = await createMcpUninstallBackups({
      cwd: tempHome,
      steps: [{
        id: "github-codex-remove",
        server: "github",
        agent: "codex",
        phase: "uninstall",
        title: "Remove GitHub MCP config",
        description: "",
        command: "codex mcp remove github"
      }]
    });

    assert.equal(backups.length, 1);
    const codexDirEntries = await readdir(path.join(tempHome, ".codex"));
    assert.ok(codexDirEntries.some((entry) => entry.startsWith("config.toml.ai-tools-backup-")));
  } finally {
    process.env.HOME = originalHome;
  }
});

test("verifyMcpUninstallExecutionSafety fails when config changes after preflight", async () => {
  const tempHome = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-home-"));
  const tempProject = await mkdtemp(path.join(os.tmpdir(), "mcp-safety-project-"));
  const originalHome = process.env.HOME;

  process.env.HOME = tempHome;
  await mkdir(path.join(tempHome, ".codex"), { recursive: true });
  await writeFile(
    path.join(tempHome, ".codex", "config.toml"),
    [
      "[mcp_servers.github]",
      'url = "https://api.githubcopilot.com/mcp/"',
      'bearer_token_env_var = "GITHUB_PAT_TOKEN"',
      ""
    ].join("\n"),
    "utf8"
  );

  try {
    const plan = buildMcpInstallPlan({
      mode: "uninstall",
      agents: ["codex"],
      servers: ["github"],
      os: "mac"
    });
    const initialReport = await inspectMcpUninstallSafety({
      cwd: tempProject,
      plan
    });

    assert.equal(initialReport.effectiveSteps.length, 1);

    await writeFile(
      path.join(tempHome, ".codex", "config.toml"),
      [
        "[mcp_servers.github]",
        'command = "npx"',
        'args = ["not-github", "mcp"]',
        ""
      ].join("\n"),
      "utf8"
    );

    await assert.rejects(
      verifyMcpUninstallExecutionSafety({
        cwd: tempProject,
        originalPlan: plan,
        expectedSteps: initialReport.effectiveSteps
      }),
      /allowed uninstall steps changed after preflight/i
    );
  } finally {
    process.env.HOME = originalHome;
  }
});
