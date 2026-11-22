import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sampleRoot = resolve(skillRoot, "examples/default-output");
const testcasePath = resolve(sampleRoot, "docs/testcases/task-create.md");

const localMarkdownFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(directory, entry.name);
  return entry.isDirectory() ? localMarkdownFiles(path) : path.endsWith(".md") ? [path] : [];
});

test("sample testcase uses the default document path and example requirement trace", () => {
  const testcase = readFileSync(testcasePath, "utf8");
  const source = readFileSync(resolve(sampleRoot, "specs/task-create.md"), "utf8");
  assert.equal(relative(sampleRoot, testcasePath), "docs/testcases/task-create.md");
  assert.match(testcase, /^### TC-001/m);
  assert.match(testcase, /\[EX-01\]/);
  assert.match(testcase, /\[EX-02\]/);
  assert.match(testcase, /No user-approved product requirements were supplied/);
  assert.match(source, /Not Approved Product Requirements/);
  assert.doesNotMatch(testcase, /playwright_automation|\.spec\.ts|docs\/autotests/i);
});

test("all actual local Markdown links resolve", () => {
  for (const markdownPath of localMarkdownFiles(skillRoot)) {
    const markdown = readFileSync(markdownPath, "utf8");
    for (const [, target] of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const localPath = target.split("#", 1)[0];
      if (!localPath || /^[a-z][a-z\d+.-]*:/i.test(localPath) || /[<>]/.test(localPath)) continue;
      assert.ok(existsSync(resolve(dirname(markdownPath), localPath)), `${markdownPath}: missing ${localPath}`);
    }
  }
});
