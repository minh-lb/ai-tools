import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

test("EntryMenuAction includes manage-skills", async () => {
  const { MENU_ITEMS_FOR_TEST } = await import("../src/lib/tui-entry-menu.js");
  const ids = MENU_ITEMS_FOR_TEST.map((item: { id: string }) => item.id);
  assert.ok(ids.includes("manage-skills"), `manage-skills not found in menu items: ${ids.join(", ")}`);
});

test("resolveSkillsDir returns correct path for claude", async () => {
  const { resolveSkillsDir } = await import("../src/lib/tui-skills.js");
  const dir = resolveSkillsDir("claude");
  const expected = path.join(os.homedir(), ".claude", "skills");
  assert.equal(dir, expected);
});

test("resolveSkillsDir returns correct path for codex", async () => {
  const { resolveSkillsDir } = await import("../src/lib/tui-skills.js");
  const dir = resolveSkillsDir("codex");
  const expected = path.join(os.homedir(), ".codex", "skills");
  assert.equal(dir, expected);
});

test("readInstalledSkills returns empty array when dir missing", async () => {
  const { readInstalledSkills } = await import("../src/lib/tui-skills.js");
  const skills = await readInstalledSkills("/tmp/__nonexistent_ai_tools_test__");
  assert.deepEqual(skills, []);
});

test("readInstalledSkills returns subdirectory names only", async () => {
  const { readInstalledSkills } = await import("../src/lib/tui-skills.js");
  const tmpDir = path.join(os.tmpdir(), `ai-tools-test-skills-${process.pid}`);
  await mkdir(path.join(tmpDir, "my-skill"), { recursive: true });
  await mkdir(path.join(tmpDir, "other-skill"), { recursive: true });
  await writeFile(path.join(tmpDir, "not-a-skill.md"), "content");

  const skills = await readInstalledSkills(tmpDir);
  skills.sort();
  assert.deepEqual(skills, ["my-skill", "other-skill"]);

  await rm(tmpDir, { recursive: true, force: true });
});
