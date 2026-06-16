import { test, expect, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const doc = document.documentElement;
        return Math.max(0, doc.scrollWidth - doc.clientWidth);
      });
    })
    .toBeLessThanOrEqual(1);
}

async function expectHeaderLayout(page: Page) {
  const viewportWidth = page.viewportSize()?.width ?? 0;

  if (viewportWidth < 760) {
    const menuToggle = page.locator("summary").filter({ hasText: "Menu" });
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await expect(page.getByRole("link", { name: "All Recipes" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Italian" }).first()).toBeVisible();
    return;
  }

  await expect(page.getByRole("link", { name: "All Recipes" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Italian" }).first()).toBeVisible();
}

async function openFirstRecipe(page: Page) {
  const openRecipeLink = page.getByRole("link", { name: "Open Recipe" }).first();
  await expect(openRecipeLink).toBeVisible();
  await openRecipeLink.click();
  await expect(page).toHaveURL(/\/recipes\/\d+$/);
}

async function expectPrimaryRecipeDetailControls(page: Page) {
  const ingredientsTab = page.getByRole("button", { name: /Ingredients \(\d+\)/ });
  const stepsTab = page.getByRole("button", { name: /Steps \(\d+\)/ });
  const notesTab = page.getByRole("button", { name: /Family Notes \(\d+\)/ });

  await ingredientsTab.scrollIntoViewIfNeeded();
  await expect(ingredientsTab).toBeVisible();
  await expect(stepsTab).toBeVisible();
  await expect(notesTab).toBeVisible();
}

test.describe("responsive public layout", () => {
  test("home page layout stays usable across viewport sizes", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Recipes organized like a cooking site, grounded in family tradition\./i,
      })
    ).toBeVisible();

    await expectHeaderLayout(page);
    await expectNoHorizontalOverflow(page);
  });

  test("recipes index layout stays usable across viewport sizes", async ({ page }) => {
    await page.goto("/recipes");

    await expect(page.getByRole("heading", { name: "All Recipes" })).toBeVisible();
    await expect(page.getByText(/recipe/i).first()).toBeVisible();
    await expectHeaderLayout(page);
    await expectNoHorizontalOverflow(page);
  });

  test("recipe detail layout stays usable across viewport sizes", async ({ page }) => {
    await page.goto("/recipes");
    await openFirstRecipe(page);

    await expect(page.getByText("Recipe Details")).toBeVisible();
    await expectPrimaryRecipeDetailControls(page);
    await expectNoHorizontalOverflow(page);
  });

  test("recipe detail tabs and content blocks fit cleanly without overlap", async ({ page }) => {
    await page.goto("/recipes");
    await openFirstRecipe(page);

    await expectPrimaryRecipeDetailControls(page);
    await expect(page.getByText(/Recipe and Instructions/i)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("contributor page layout stays usable across viewport sizes", async ({ page }) => {
    await page.goto("/contributor");

    await expect(page.getByRole("heading", { name: "Sign in to add family recipes." })).toBeVisible();
    await expect(page.getByText("Invite Code", { exact: true })).toBeVisible();
    await expect(page.locator("form input[required]")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
