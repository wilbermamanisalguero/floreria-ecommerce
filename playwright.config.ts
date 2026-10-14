import { defineConfig, devices } from "@playwright/test";
import { APP_PORT, DB_DOWN_PORT, UNREACHABLE_DATABASE_URL } from "./tests/fixtures/health-contract";
import { loadTestEnv } from "./tests/fixtures/load-env";

loadTestEnv();

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://localhost:${APP_PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node tests/fixtures/start-servers.mjs",
    url: `http://localhost:${APP_PORT}/`,
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "pipe",
    env: {
      E2E_APP_PORT: String(APP_PORT),
      E2E_DB_DOWN_PORT: String(DB_DOWN_PORT),
      E2E_UNREACHABLE_DATABASE_URL: UNREACHABLE_DATABASE_URL,
    },
  },
});
