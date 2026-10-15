// Test case: ../testcases/task-create.md
// Run in this sample project with @playwright/test and its browser already installed.
import { expect, test } from "@playwright/test";
import { createTaskServer } from "../../fixtures/task-server.mjs";

/** @type {ReturnType<typeof createTaskServer> | undefined} */
let server;
let baseURL = "";

test.beforeAll(async () => {
  const taskServer = createTaskServer();
  server = taskServer;
  await new Promise((resolve, reject) => {
    taskServer.once("error", reject);
    taskServer.listen(0, "127.0.0.1", resolve);
  });

  const address = taskServer.address();
  if (!address || typeof address === "string") throw new Error("Task sample server did not bind to a TCP port.");
  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  if (!server?.listening) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("[TC-001] Create a task and verify it persists", async ({ page }) => {
  const title = `E2E task ${new Date().toISOString()}`;

  await test.step("1. Open the new-task page and verify its form", async () => {
    await page.goto(`${baseURL}/tasks/new`);
    await expect(page.getByRole("heading", { name: "New task" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Task title" })).toBeVisible();
  });

  await test.step("2. Submit the unique task title", async () => {
    await page.getByRole("textbox", { name: "Task title" }).fill(title);
    await page.getByRole("button", { name: "Create task" }).click();
    await expect(page).toHaveURL(`${baseURL}/tasks`);
  });

  await test.step("3. Open /tasks and verify the saved task after reload", async () => {
    await page.goto(`${baseURL}/tasks`);
    await expect(page).toHaveURL(`${baseURL}/tasks`);

    const taskRow = page.getByRole("row").filter({ hasText: title });
    await expect(taskRow).toContainText(title);
    await expect(taskRow).toContainText("Open");

    await page.reload();
    await expect(page).toHaveURL(`${baseURL}/tasks`);
    await expect(taskRow).toContainText(title);
    await expect(taskRow).toContainText("Open");
  });
});
