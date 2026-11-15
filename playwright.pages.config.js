import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "pages.spec.js",
  use: {
    channel: "msedge",
    baseURL: "http://127.0.0.1:4173/alpfa-president-campaign/",
  },
  webServer: {
    env: { PAGES_BASE_PATH: "/alpfa-president-campaign/" },
    command: "npm.cmd run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/alpfa-president-campaign/",
    reuseExistingServer: false,
  },
});
