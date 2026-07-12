import { test } from "node:test";
import * as assert from "node:assert/strict";

test("EntryMenuAction includes manage-skills", async () => {
  const { MENU_ITEMS_FOR_TEST } = await import("../src/lib/tui-entry-menu.js");
  const ids = MENU_ITEMS_FOR_TEST.map((item: { id: string }) => item.id);
  assert.ok(ids.includes("manage-skills"), `manage-skills not found in menu items: ${ids.join(", ")}`);
});
