// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  globals: {
    FORCE_TRACKING: false,
    MODE: "development",
    SENTRY_DSN: "https://sentry-mock-url.io",
    STATIC_ASSETS_PATH: ".",
  },
  moduleDirectories: ["src", "node_modules"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  preset: "ts-jest/presets/js-with-ts",
  setupFiles: ["jest-date-mock"],
};
