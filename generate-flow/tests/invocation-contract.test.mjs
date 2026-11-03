import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(resolve(skillRoot, "SKILL.md"), "utf8");
const metadata = readFileSync(resolve(skillRoot, "agents/openai.yaml"), "utf8");

test("natural-language feature requests work without command arguments", () => {
  assert.match(skill, /otherwise from the user's current natural-language request/);
  assert.match(skill, /Do not stop solely because .*ARGUMENTS.* is unset/);
  assert.doesNotMatch(skill, /If .*ARGUMENTS.* is empty, show the usage below and stop/);
  assert.match(metadata, /Resolve the target from the request if command arguments are absent/);
});

test("explicit output language overrides the default", () => {
  assert.match(skill, /user's explicitly requested language/);
  assert.match(skill, /default descriptive prose to Vietnamese/);
});
