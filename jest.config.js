// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleDirectories: ["src", "node_modules"],
  setupFiles: ["jest-date-mock"],
  globals: {
    STATIC_ASSETS_PATH: "."
  },
  preset: "ts-jest/presets/js-with-ts"
};
