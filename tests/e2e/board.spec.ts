import { expect, test } from "@playwright/test";

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
        tasks: ["Define drag QA", "Mock AI response", "Ship MVP review pass"],
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
  const todoColumn = page.locator('[data-column-id="todo"]');

  await todoColumn.getByRole("button", { name: "Add card" }).click();
  await page.getByLabel("Card title").fill("Write launch checklist");
  await page.getByLabel("Card details").fill("Keep it short.");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Write launch checklist")).toBeVisible();
});

test("user deletes a card", async ({ page }) => {
  await page.getByRole("button", { name: "Delete Audit empty states" }).click();
  await expect(page.getByText("Audit empty states")).toHaveCount(0);
});

test("user edits a card", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Audit empty states" }).click();
  await page.getByLabel("Edit title for Audit empty states").fill("Audit hydration issues");
  await page.getByLabel("Edit details for Audit empty states").fill("Check client-only rendering.");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(page.getByText("Audit hydration issues")).toBeVisible();
  await expect(page.getByText("Check client-only rendering.")).toBeVisible();
});

test("user moves a card within a column", async ({ page }) => {
  await page.getByRole("button", { name: "Move down Audit empty states" }).click();
  await page.getByRole("button", { name: "Move down Audit empty states" }).click();

  const backlogSection = page.locator('[data-column-id="backlog"]');
  const titles = backlogSection.locator("h3");
  await expect(titles.nth(0)).toHaveText("Map drag edge cases");
  await expect(titles.nth(1)).toHaveText("Draft sprint focus");
  await expect(titles.nth(2)).toHaveText("Audit empty states");
});

test("user moves a card across columns", async ({ page }) => {
  const inProgressColumn = page.locator('[data-column-id="in-progress"]');
  await page.getByRole("button", { name: "Move right Refine card typography" }).click();

  await expect(inProgressColumn.getByText("Refine card typography")).toBeVisible();
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
  await page.getByRole("button", { name: "Ask AI" }).click();

  const doneColumn = page.locator('[data-column-id="done"]');
  await expect(page.getByText(/review and final polish still need attention/i)).toBeVisible();
  await expect(doneColumn.getByText("Define drag QA")).toBeVisible();
  await expect(doneColumn.getByText("Mock AI response")).toBeVisible();
  await expect(doneColumn.getByText("Ship MVP review pass")).toBeVisible();
});

test("user deletes a completed history record", async ({ page }) => {
  await page.getByRole("button", { name: "Delete history for Choose color system" }).click();
  await expect(page.getByRole("button", { name: "Delete history for Choose color system" })).toHaveCount(0);
});
