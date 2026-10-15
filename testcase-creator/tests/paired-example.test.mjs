import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { basename, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { createTaskServer } from "../examples/default-output/fixtures/task-server.mjs";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sampleRoot = resolve(skillRoot, "examples/default-output");
const testcasePath = resolve(sampleRoot, "docs/testcases/task-create.md");
const specPath = resolve(sampleRoot, "docs/autotests/task-create.spec.ts");

const localMarkdownFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = resolve(directory, entry.name);
  return entry.isDirectory() ? localMarkdownFiles(path) : path.endsWith(".md") ? [path] : [];
});

test("paired example uses the default paths, same stem, reciprocal links, and matching case steps", () => {
  const testcase = readFileSync(testcasePath, "utf8");
  const spec = readFileSync(specPath, "utf8");
  const sourceBasis = readFileSync(resolve(sampleRoot, "specs/task-create.md"), "utf8");

  assert.equal(relative(sampleRoot, testcasePath), "docs/testcases/task-create.md");
  assert.equal(relative(sampleRoot, specPath), "docs/autotests/task-create.spec.ts");
  assert.equal(basename(testcasePath, ".md"), basename(specPath, ".spec.ts"));
  assert.match(testcase, /\[task-create\.spec\.ts\]\(\.\.\/autotests\/task-create\.spec\.ts\)/);
  assert.match(spec, /\/\/ Test case: \.\.\/testcases\/task-create\.md/);

  const caseIds = [...testcase.matchAll(/^### (TC-\d+)/gm)].map((match) => match[1]);
  const testIds = [...spec.matchAll(/test\("\[(TC-\d+)\]/g)].map((match) => match[1]);
  const actionNumbers = [...testcase.matchAll(/^  (\d+)\. /gm)].map((match) => match[1]);
  const stepNumbers = [...spec.matchAll(/test\.step\("(\d+)\./g)].map((match) => match[1]);
  assert.deepEqual(testIds, caseIds);
  assert.deepEqual(stepNumbers, actionNumbers);
  assert.match(testcase, /\[EX-01\]/);
  assert.match(testcase, /\[EX-02\]/);
  assert.match(testcase, /No user-approved product requirements were supplied/);
  assert.match(sourceBasis, /Not Approved Product Requirements/);
  assert.match(sourceBasis, /not approved acceptance criteria/i);
  assert.doesNotMatch(testcase, /\[AC-\d+\]/);
});

test("all actual local Markdown links in testcase-creator resolve", () => {
  for (const markdownPath of localMarkdownFiles(skillRoot)) {
    const markdown = readFileSync(markdownPath, "utf8");
    for (const [, target] of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const localPath = target.split("#", 1)[0];
      if (!localPath || /^[a-z][a-z\d+.-]*:/i.test(localPath) || /[<>]/.test(localPath)) continue;
      assert.ok(existsSync(resolve(dirname(markdownPath), localPath)), `${markdownPath}: missing ${localPath}`);
    }
  }
});

test("Node parses the JavaScript-compatible TypeScript spec", () => {
  execFileSync(process.execPath, ["--check", specPath], { stdio: "pipe" });
});

test("Playwright example parses and transpiles as TypeScript (syntax-only, not typecheck)", () => {
  const source = readFileSync(specPath, "utf8");
  const result = ts.transpileModule(source, {
    fileName: specPath,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
  assert.ok(result.outputText.length > 0, "TypeScript transpile should produce JavaScript output");
});

test("sample app serves the documented form, creates a task, redirects, and retains it after reload", async () => {
  const server = createTaskServer();
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });

  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseURL = `http://127.0.0.1:${address.port}`;
    const formResponse = await fetch(`${baseURL}/tasks/new`);
    const form = await formResponse.text();
    assert.equal(formResponse.status, 200);
    assert.match(form, /<h1>New task<\/h1>/);
    assert.match(form, /<label for="title">Task title<\/label>/);
    assert.match(form, /<button type="submit">Create task<\/button>/);

    const title = `E2E task ${Date.now()}`;
    const createResponse = await fetch(`${baseURL}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ title }),
      redirect: "manual",
    });
    assert.equal(createResponse.status, 303);
    assert.equal(createResponse.headers.get("location"), "/tasks");

    for (let visit = 0; visit < 2; visit += 1) {
      const listResponse = await fetch(`${baseURL}/tasks`);
      const list = await listResponse.text();
      assert.equal(listResponse.status, 200);
      assert.ok(list.includes(title));
      assert.ok(list.includes("Open"));
    }
  } finally {
    await new Promise((resolveClose, rejectClose) => {
      server.close((error) => (error ? rejectClose(error) : resolveClose()));
    });
  }
});
