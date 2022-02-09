const path = require("path");
const fs = require("fs");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

const testsTsConfigPath = path.resolve(__dirname, "tests", "tsconfig.json");
const tsconfig = JSON.parse(
  fs.readFileSync(testsTsConfigPath, {
    encoding: "utf-8",
  })
);

const moduleNameMapper = {
  ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
  "\\.(css|less|sass|scss)$": "identity-obj-proxy",
};

const collectCoverageFrom = ["<rootDir>/src/**/!(*.d).ts*"];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverageFrom,
  coverageDirectory: "coverage",
  globals: {
    ARCHIFILTRE_VERSION: JSON.stringify(require("./package.json").version),
    FORCE_TRACKING: false,
    MODE: "test",
    SENTRY_DSN: "https://sentry-mock-url.io",
    STATIC_ASSETS_PATH: ".",
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: testsTsConfigPath,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper,
  preset: "ts-jest/presets/js-with-ts",
  setupFiles: [
    "jest-date-mock",
    "<rootDir>/tests/test-util/mock-electron.js",
    "<rootDir>/tests/test-util/mock-i18next.js",
  ],
  testMatch: ["<rootDir>/tests/**/?(*.)(spec|test).(ts|tsx)"],
};
