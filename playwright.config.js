/** @type { import("@playwright/test").PlaywrightTestConfig} */
module.exports = {
  reporter: process.env.CI ? "dot" : "list",
  testDir: "tests/e2e/",
};
