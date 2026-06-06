import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseArgs } from "../src/lib/args.js";

test("parseArgs parses install flags", () => {
  const result = parseArgs([
    "install",
    "--skills",
    "skill-1,skill-2",
    "--groups",
    "laravel-ddd",
    "--location",
    "local,global",
    "--agent",
    "codex,claude",
    "--yes"
  ]);

  assert.equal(result.command, "install");
  assert.deepEqual(result.options.skills, ["skill-1", "skill-2"]);
  assert.deepEqual(result.options.groups, ["laravel-ddd"]);
  assert.deepEqual(result.options.locations, ["local", "global"]);
  assert.deepEqual(result.options.agents, ["codex", "claude"]);
  assert.equal(result.options.yes, true);
});
