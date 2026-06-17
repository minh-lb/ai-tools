import { test } from "node:test";
import * as assert from "node:assert/strict";
import { buildLibInstallPlan, detectSupportedHostOs } from "../src/lib/ai-libs.js";

test("detectSupportedHostOs maps darwin and linux", () => {
  assert.equal(detectSupportedHostOs("darwin"), "mac");
  assert.equal(detectSupportedHostOs("linux"), "linux");
  assert.equal(detectSupportedHostOs("win32"), null);
});

test("buildLibInstallPlan creates RTK install steps for both agents", () => {
  const plan = buildLibInstallPlan({
    mode: "install",
    os: "mac",
    scope: "global",
    agents: ["claude", "codex"],
    libraries: ["rtk"],
    platform: "darwin"
  });

  assert.equal(plan.mode, "install");
  assert.deepEqual(
    plan.steps.map((step) => step.id),
    ["rtk-install", "rtk-configure-claude", "rtk-configure-codex"]
  );
  assert.match(plan.steps[0].command, /rtk\/refs\/heads\/master\/install\.sh/);
});

test("buildLibInstallPlan builds global ICM install modes for codex only", () => {
  const plan = buildLibInstallPlan({
    mode: "install",
    os: "linux",
    scope: "global",
    agents: ["codex"],
    libraries: ["icm"],
    platform: "linux"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "curl -fsSL https://raw.githubusercontent.com/rtk-ai/icm/main/install.sh | sh",
      "icm init --mode mcp",
      "icm init --mode hook"
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("global configs")));
});

test("buildLibInstallPlan maps local install scope to per-project ICM init", () => {
  const plan = buildLibInstallPlan({
    mode: "install",
    os: "linux",
    scope: "local",
    agents: ["claude", "codex"],
    libraries: ["rtk", "icm"],
    platform: "linux"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.command),
    [
      "curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh",
      "rtk init",
      "rtk init --codex",
      "curl -fsSL https://raw.githubusercontent.com/rtk-ai/icm/main/install.sh | sh",
      "icm init --mode cli --per_project"
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("user's bin directory")));
});

test("buildLibInstallPlan adds ECC install step with upstream safety notes", () => {
  const plan = buildLibInstallPlan({
    mode: "install",
    os: "mac",
    scope: "local",
    agents: ["claude", "codex"],
    libraries: ["ecc"],
    platform: "darwin"
  });

  assert.deepEqual(
    plan.steps.map((step) => ({ id: step.id, runner: step.runner, command: step.command })),
    [
      {
        id: "ecc-install-claude",
        runner: "setup-ecc-claude",
        command: "temporary clone of affaan-m/ECC -> npm install -> bash ./install.sh --profile full"
      },
      {
        id: "ecc-install-codex",
        runner: "setup-ecc-codex",
        command: "temporary clone of affaan-m/ECC -> npm install -> bash ./scripts/sync-ecc-to-codex.sh"
      }
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("clones the upstream repo into a temporary directory")));
  assert.ok(plan.notes.some((note) => note.includes("duplicate skills, commands, and hooks")));
  assert.ok(plan.notes.some((note) => note.includes("ecc-universal")));
  assert.equal(plan.notes.some((note) => note.includes("user's bin directory")), false);
});

test("buildLibInstallPlan maps local uninstall to scoped cleanup", () => {
  const plan = buildLibInstallPlan({
    mode: "uninstall",
    os: "linux",
    scope: "local",
    agents: ["claude", "codex"],
    libraries: ["rtk", "icm"],
    platform: "linux"
  });

  assert.deepEqual(
    plan.steps.map((step) => ({ id: step.id, runner: step.runner, command: step.command })),
    [
      { id: "rtk-uninstall-claude", runner: "shell", command: "rtk init --uninstall" },
      { id: "rtk-uninstall-codex", runner: "shell", command: "rtk init --codex --uninstall" },
      { id: "icm-local-cleanup", runner: "cleanup-icm-local", command: "clean ICM blocks from current project" }
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("leaves the global binary in place")));
  assert.ok(plan.notes.some((note) => note.includes("leaves global ICM config untouched")));
});

test("buildLibInstallPlan disables automatic ECC uninstall", () => {
  const plan = buildLibInstallPlan({
    mode: "uninstall",
    os: "linux",
    scope: "global",
    agents: ["claude"],
    libraries: ["ecc"],
    platform: "linux"
  });

  assert.deepEqual(plan.steps, []);
  assert.ok(plan.notes.some((note) => note.includes("Automatic ECC uninstall is not supported")));
  assert.ok(plan.notes.some((note) => note.includes("node scripts/uninstall.js --dry-run")));
});

test("buildLibInstallPlan disables automatic global ICM uninstall", () => {
  const plan = buildLibInstallPlan({
    mode: "uninstall",
    os: "linux",
    scope: "global",
    agents: ["claude", "codex"],
    libraries: ["icm"],
    platform: "linux"
  });

  assert.deepEqual(plan.steps, []);
  assert.ok(plan.notes.some((note) => note.includes("intentionally disabled")));
  assert.ok(plan.notes.some((note) => note.includes("icm uninstall --audit")));
});

test("buildLibInstallPlan reports host OS mismatch", () => {
  const plan = buildLibInstallPlan({
    mode: "install",
    os: "linux",
    scope: "global",
    agents: ["claude"],
    libraries: ["rtk", "icm"],
    platform: "darwin"
  });

  assert.match(plan.notes[0], /Selected OS is linux, but the current host is mac/);
});
