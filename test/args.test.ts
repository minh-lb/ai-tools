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
    "local",
    "--agent",
    "codex",
    "--yes"
  ]);

  assert.equal(result.command, "install");
  assert.deepEqual(result.options.skills, ["skill-1", "skill-2"]);
  assert.deepEqual(result.options.groups, ["laravel-ddd"]);
  assert.equal(result.options.location, "local");
  assert.equal(result.options.agent, "codex");
  assert.equal(result.options.yes, true);
});
