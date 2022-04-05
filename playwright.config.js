/** @type { import("@playwright/test").PlaywrightTestConfig} */
module.exports = {
  globalSetup: "tests/setup/e2e.ts",
  reporter: process.env.CI ? "dot" : "list",
  testDir: "tests/e2e/",
};
