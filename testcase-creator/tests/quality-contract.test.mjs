import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

test("existing suites preserve stable IDs", () => {
  assert.match(read("SKILL.md"), /updating an existing suite, preserve IDs/);
  assert.match(read("references/change-impact.md"), /Retire obsolete IDs/);
  assert.match(read("templates/testcase.md"), /## Change impact/);
});

test("quality gate requires observable oracles and conflict routing", () => {
  assert.match(read("SKILL.md"), /specific and observable/);
  assert.match(read("SKILL.md"), /negative cases, verify unchanged state\/no unintended side effects/);
  assert.match(read("SKILL.md"), /conflicting sources through a pending decision/);
  assert.match(read("references/source-map.md"), /approved sources conflict/);
});

test("reference guidance only authors deterministic testcases", () => {
  assert.match(read("references/source-map.md"), /Do not create exploratory charters/);
  assert.match(read("references/test-design-techniques.md"), /Do not author exploratory charters/);
  assert.match(read("SKILL.md"), /Do not create, modify, or run automated tests/);
  assert.match(read("references/change-impact.md"), /Do not author automation code/);
});
