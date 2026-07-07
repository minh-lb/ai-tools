import { test } from "node:test";
import * as assert from "node:assert/strict";
import { buildPluginInstallPlan } from "../src/lib/plugins.js";

test("buildPluginInstallPlan creates global Lumin install steps for both agents", () => {
  const plan = buildPluginInstallPlan({
    mode: "install",
    agents: ["claude", "codex"],
    plugins: ["lumin"],
    sourceBranch: "plugins"
  });

  assert.deepEqual(
    plan.steps.map((step) => ({ id: step.id, runner: step.runner })),
    [
      { id: "lumin-install-claude", runner: "setup-lumin-claude" },
      { id: "lumin-install-codex", runner: "setup-lumin-codex" }
    ]
  );
  assert.ok(plan.notes.some((note) => note.includes("dedicated plugins branch")));
  assert.ok(plan.notes.some((note) => note.includes("global mode only")));
  assert.equal(plan.steps[0]?.command, "sh plugins/lumin/scripts/install-claude.sh --global");
  assert.equal(plan.steps[1]?.command, "sh plugins/lumin/scripts/install-codex.sh");
});

test("buildPluginInstallPlan creates global Lumin uninstall steps", () => {
  const plan = buildPluginInstallPlan({
    mode: "uninstall",
    agents: ["codex", "claude"],
    plugins: ["lumin"],
    sourceBranch: "plugins"
  });

  assert.deepEqual(
    plan.steps.map((step) => step.id),
    ["lumin-uninstall-codex", "lumin-uninstall-claude"]
  );
});
