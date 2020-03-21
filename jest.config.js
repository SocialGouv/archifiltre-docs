// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["src", "node_modules"],
  setupFiles: ["jest-date-mock"],
  globals: {
    STATIC_ASSETS_PATH: ".",
    MODE: "development",
    SENTRY_DSN: "https://sentry-mock-url.io",
    FORCE_TRACKING: false,
  },
  preset: "ts-jest/presets/js-with-ts",
};
