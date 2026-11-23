import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./apps/mobile/tests/ui",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["json", { outputFile: ".local/ui-results.json" }]],
  use: {
    channel: "chromium",
    baseURL: "http://127.0.0.1:8081",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm --filter @snowmate/mobile exec expo start --web --port 8081",
    url: "http://127.0.0.1:8081",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
