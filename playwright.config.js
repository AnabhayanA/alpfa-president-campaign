import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  testMatch: "campaign.spec.js",
  use: {
    baseURL: "http://127.0.0.1:5173",
    channel: process.env.CI ? undefined : "msedge",
    headless: true,
  },
  webServer: {
    command: `${process.platform === "win32" ? "npm.cmd" : "npm"} run dev -- --host 127.0.0.1`,
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
