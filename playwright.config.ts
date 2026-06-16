import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3002";
const shouldUseLocalWebServer = !process.env.PLAYWRIGHT_BASE_URL && !process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Mini"], browserName: "chromium" },
    },
    {
      name: "mobile-ios",
      use: { ...devices["iPhone 12"], browserName: "chromium" },
    },
    {
      name: "mobile-android",
      use: { ...devices["Pixel 7"], browserName: "chromium" },
    },
  ],
  webServer: shouldUseLocalWebServer
    ? {
        command: "npm run dev",
        url: "http://127.0.0.1:3002",
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});
