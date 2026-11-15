import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "mobile.spec.js",
  use: {
    ...devices["iPhone 13"],
    browserName: "webkit",
    baseURL: "http://127.0.0.1:5173",
  },
  webServer: {
    command: `${process.platform === "win32" ? "npm.cmd" : "npm"} run dev -- --host 127.0.0.1`,
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
