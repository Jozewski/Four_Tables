import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:3002";
const outDir = path.join(process.cwd(), "screenshots", "ui-audit");

async function capture(page, name, url, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(outDir, `${name}-viewport.png`),
    fullPage: false,
  });
}

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await capture(page, "home-desktop", `${baseUrl}/`, { width: 1440, height: 1000 });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await page.getByText("By tradition").scrollIntoViewIfNeeded();
await page.screenshot({
  path: path.join(outDir, "home-by-tradition-desktop.png"),
  fullPage: false,
});
await capture(page, "home-mobile", `${baseUrl}/`, { width: 390, height: 844 });
await capture(page, "recipes-desktop", `${baseUrl}/recipes`, { width: 1440, height: 1000 });
await capture(page, "recipes-mobile", `${baseUrl}/recipes`, { width: 390, height: 844 });

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${baseUrl}/recipes`, { waitUntil: "networkidle" });
const firstRecipeLink = page.locator('a[href^="/recipes/"]').first();
const firstRecipeHref = await firstRecipeLink.getAttribute("href");
if (firstRecipeHref) {
  await capture(page, "recipe-detail-desktop", `${baseUrl}${firstRecipeHref}`, {
    width: 1440,
    height: 1000,
  });
  await capture(page, "recipe-detail-mobile", `${baseUrl}${firstRecipeHref}`, {
    width: 390,
    height: 844,
  });
}

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${baseUrl}/recipes`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Add Recipe" }).click();
await page.screenshot({
  path: path.join(outDir, "add-recipe-modal-desktop.png"),
  fullPage: false,
});

await browser.close();

console.log(`Saved UI screenshots to ${outDir}`);
