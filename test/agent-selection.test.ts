import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  AGENT_SELECTION_CHOICES,
  isAgentOptionSelected,
  toggleAgentOption,
  toggleAllAgents
} from "../src/lib/agent-selection.js";
import { selectionArray } from "../src/lib/tui-utils.js";
import type { Agent } from "../src/lib/types.js";

test("the Both choice selects Codex and Claude, and toggling it off clears both", () => {
  const selected = new Set<Agent>();
  const bothOption = AGENT_SELECTION_CHOICES.find((option) => option.id === "both");
  assert.ok(bothOption, "Both choice should appear in the Agents tab");

  toggleAgentOption(selected, bothOption.id);
  assert.deepEqual([...selected], ["codex", "claude"]);
  assert.deepEqual(selectionArray(selected), ["codex", "claude"]);
  assert.equal(isAgentOptionSelected("both", selected), true);

  toggleAgentOption(selected, "both");
  assert.deepEqual([...selected], []);
  assert.equal(isAgentOptionSelected("both", selected), false);
});

test("Pi is an individual install target", () => {
  const selected = new Set<Agent>();
  const piOption = AGENT_SELECTION_CHOICES.find((option) => option.id === "pi");
  assert.ok(piOption, "Pi choice should appear in the Agents tab");

  toggleAgentOption(selected, piOption.id);
  assert.deepEqual([...selected], ["pi"]);
  assert.equal(isAgentOptionSelected("pi", selected), true);
});

test("Both reflects individual agent selections", () => {
  const selected = new Set<Agent>(["codex"]);

  assert.equal(isAgentOptionSelected("codex", selected), true);
  assert.equal(isAgentOptionSelected("both", selected), false);

  toggleAgentOption(selected, "both");
  assert.deepEqual([...selected], ["codex", "claude"]);
});

test("toggleAllAgents selects or clears all three agents", () => {
  const selected = new Set<Agent>();

  toggleAllAgents(selected);
  assert.deepEqual([...selected], ["codex", "claude", "pi"]);

  toggleAllAgents(selected);
  assert.deepEqual([...selected], []);
});
