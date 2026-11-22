import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(resolve(skillRoot, "SKILL.md"), "utf8");
const caseDesign = readFileSync(resolve(skillRoot, "references/case-design.md"), "utf8");
const template = readFileSync(resolve(skillRoot, "templates/testcase.md"), "utf8");
const index = readFileSync(resolve(skillRoot, "references/index.md"), "utf8");

test("case design outputs documentation only", () => {
  assert.match(caseDesign, /testcase documentation only/i);
  assert.match(caseDesign, /docs\/testcases\//);
  assert.match(caseDesign, /do not create, modify, or run automated tests/i);
  assert.doesNotMatch(caseDesign, /cases-and-automation|docs\/autotests|generate a matching Playwright/i);
  assert.doesNotMatch(template, /playwright_automation|autotests|test\.skip|\.spec\.ts/);
});

test("case-design resources exclude automation scaffolding", () => {
  const files = readdirSync(resolve(skillRoot, "templates"));
  const references = readdirSync(resolve(skillRoot, "references"));
  assert.ok(!files.some((name) => /playwright|automation/i.test(name)));
  assert.ok(!references.some((name) => /playwright-automation/i.test(name)));
  assert.doesNotMatch(index, /playwright|autotests|cases-and-automation/i);
});

test("combined requests keep test documentation and automation distinct", () => {
  assert.match(caseDesign, /automation request is combined with case design/);
  assert.match(skill, /keep the test case document, code, and observed results distinct/);
  assert.match(skill, /references\/execution\/guide\.md/);
  assert.match(template, /## E2E scenarios/);
  assert.match(template, /\*\*User actions:\*\*/);
  assert.match(template, /\*\*Expected outcome \/ postcondition:\*\*/);
});
