import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(resolve(skillRoot, "SKILL.md"), "utf8");
const template = readFileSync(resolve(skillRoot, "templates/testcase.md"), "utf8");
const index = readFileSync(resolve(skillRoot, "references/index.md"), "utf8");

test("testcase-creator always outputs documentation only", () => {
  assert.match(skill, /testcase documentation only/i);
  assert.match(skill, /docs\/testcases\//);
  assert.match(skill, /do not create, modify, or run automated tests/i);
  assert.doesNotMatch(skill, /cases-and-automation|docs\/autotests|generate a matching Playwright/i);
  assert.doesNotMatch(template, /playwright_automation|autotests|test\.skip|\.spec\.ts/);
});

test("no bundled test automation code or automation guide remains", () => {
  const files = readdirSync(resolve(skillRoot, "templates"));
  const references = readdirSync(resolve(skillRoot, "references"));
  assert.ok(!files.some((name) => /playwright|automation/i.test(name)));
  assert.ok(!references.some((name) => /playwright-automation/i.test(name)));
  assert.doesNotMatch(index, /playwright|autotests|cases-and-automation/i);
});

test("a combined testcase and automation request stays within document scope", () => {
  assert.match(skill, /automation request is combined with case design/);
  assert.match(skill, /separate automation task/);
  assert.match(template, /## E2E scenarios/);
  assert.match(template, /\*\*User actions:\*\*/);
  assert.match(template, /\*\*Expected outcome \/ postcondition:\*\*/);
});
