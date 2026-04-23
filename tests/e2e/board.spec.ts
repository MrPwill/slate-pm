import { expect, test } from "@playwright/test";

async function addTestCard(page: { getByRole: Function, getByLabel: Function, locator: Function }, columnId: string, title: string, details: string) {
  const column = page.locator(`[data-column-id="${columnId}"]`);
  await column.getByRole("button", { name: "Add card" }).click();
  await page.getByLabel("Card title").fill(title);
  await page.getByLabel("Card details").fill(details);
  await page.getByRole("button", { name: "Save" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.route("**/api/generate-tasks", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        summary: "The board is progressing, but review and final polish still need attention.",
        tasks: [
          { title: "Define drag QA", details: "- Test drag overlay\n- Verify cross-column drops\n- Check reorder" },
          { title: "Mock AI response", details: "- Create mock handler\n- Return sample tasks\n- Validate format" },
          { title: "Ship MVP review pass", details: "- Final code review\n- Check accessibility\n- Deploy to prod" },
        ],
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Name").fill("Prince");
  await page.getByLabel("Email").fill("prince@example.com");
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Create Account" }).nth(1).click();
});

test("user adds a card to a column", async ({ page }) => {
  await addTestCard(page, "todo", "Write launch checklist", "Keep it short.");
  await expect(page.getByText("Write launch checklist")).toBeVisible();
});

test("user deletes a card", async ({ page }) => {
  await addTestCard(page, "backlog", "Test task to delete", "This will be deleted");
  await page.getByRole("button", { name: "Delete Test task to delete" }).click();
  await expect(page.getByText("Test task to delete")).toHaveCount(0);
});

test("user edits a card", async ({ page }) => {
  await addTestCard(page, "backlog", "Original title", "Original details");
  await page.getByRole("button", { name: "Edit Original title" }).click();
  await page.getByLabel("Edit title for Original title").fill("Updated title");
  await page.getByLabel("Edit details for Original title").fill("Updated details");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(page.getByText("Updated title")).toBeVisible();
  await expect(page.getByText("Updated details")).toBeVisible();
});

test("user moves a card within a column", async ({ page }) => {
  await addTestCard(page, "backlog", "Card A", "Details A");
  await addTestCard(page, "backlog", "Card B", "Details B");

  await page.getByRole("button", { name: "Move down Card A" }).click();

  const backlogSection = page.locator('[data-column-id="backlog"]');
  const titles = backlogSection.locator("h3");
  await expect(titles.nth(0)).toHaveText("Card B");
  await expect(titles.nth(1)).toHaveText("Card A");
});

test("user moves a card across columns", async ({ page }) => {
  const inProgressColumn = page.locator('[data-column-id="in-progress"]');
  await addTestCard(page, "todo", "Move me to in-progress", "Testing cross-column move");

  await page.getByRole("button", { name: "Move right Move me to in-progress" }).click();

  await expect(inProgressColumn.getByText("Move me to in-progress")).toBeVisible();
});

test("user renames a column", async ({ page }) => {
  const input = page.locator('[data-column-id="review"] input');
  await input.fill("QA");
  await input.blur();
  await expect(input).toHaveValue("QA");
});

test("user generates tasks via AI", async ({ page }) => {
  await page.getByRole("textbox", { name: "Prompt" }).fill("Break the board polish into final actions.");
  await page.getByRole("combobox", { name: "Insert Into" }).selectOption("done");
  await page.getByRole("button", { name: "Generate" }).click();

  const doneColumn = page.locator('[data-column-id="done"]');
  await expect(page.getByText(/review and final polish still need attention/i)).toBeVisible();
  await expect(doneColumn.locator("h3", { hasText: "Define drag QA" })).toBeVisible();
  await expect(doneColumn.getByText("1.")).toBeVisible();
});

test("user deletes a completed history record", async ({ page }) => {
  await addTestCard(page, "todo", "Task for history", "Will be completed");
  await page.getByRole("button", { name: "Move right Task for history" }).click();
  await page.getByRole("button", { name: "Move right Task for history" }).click();
  await page.getByRole("button", { name: "Move right Task for history" }).click();
  await page.getByRole("button", { name: "Move right Task for history" }).click();

  await page.getByRole("button", { name: "Delete history for Task for history" }).click();
  await expect(page.getByRole("button", { name: "Delete history for Task for history" })).toHaveCount(0);
});
