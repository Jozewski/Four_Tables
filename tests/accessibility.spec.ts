import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const contributorInviteCode = process.env.CONTRIBUTOR_INVITE_CODE ?? "";

async function expectNoSeriousA11yIssues(page: Parameters<typeof AxeBuilder>[0]["page"], options?: {
  include?: string[];
  exclude?: string[];
}) {
  let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]);

  for (const selector of options?.include ?? []) {
    builder = builder.include(selector);
  }

  for (const selector of options?.exclude ?? []) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();
  expect(results.violations).toEqual([]);
}

test.describe("WCAG AA accessibility", () => {
  test("home page has no detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "All Recipes" }).first()).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });

  test("recipes index has no detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/recipes");
    await expect(page.getByRole("heading", { name: "All Recipes" })).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });

  test("contributor page has no detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/contributor");
    await expect(page.getByRole("heading", { name: "Sign in to add family recipes." })).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });

  test("signed-in contributor recipes page has no detectable WCAG A/AA violations", async ({ page }) => {
    test.skip(!contributorInviteCode, "CONTRIBUTOR_INVITE_CODE is required for contributor accessibility flow.");

    await page.goto("/contributor");
    await page.evaluate(async (inviteCode) => {
      await fetch("/api/contributor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
    }, contributorInviteCode);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Contributor access is active." })).toBeVisible();

    await page.goto("/recipes");
    await expect(page.getByRole("button", { name: "Add Recipe" })).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });
});
