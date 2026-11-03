import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(resolve(skillRoot, "SKILL.md"), "utf8");
const template = readFileSync(resolve(skillRoot, "templates/testcase.md"), "utf8");
const playwrightGuide = readFileSync(resolve(skillRoot, "references/playwright-automation.md"), "utf8");

test("documentation-only requests do not require a Playwright file", () => {
  assert.match(skill, /cases-only.*test case documents/);
  assert.match(skill, /Do not generate Playwright files in cases-only mode/);
  assert.match(skill, /no Playwright file or reciprocal link/);
  assert.doesNotMatch(template, /^playwright_automation:/m);
  assert.match(template, /omit.*cases-only mode/);
});

test("explicit automation requests still require a traceable Playwright pair", () => {
  assert.match(skill, /cases-and-automation.*Playwright/);
  assert.match(skill, /matching test for each deterministic ID/);
  assert.match(playwrightGuide, /Generate one paired Playwright file|generate both files/i);
});
