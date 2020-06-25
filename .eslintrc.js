module.exports = {
  extends: ["@socialgouv/eslint-config-react"],
  settings: {
    "import/resolver": "webpack",
  },
  globals: {
    MODE: "readonly",
    STATIC_ASSETS_PATH: "readonly",
    AUTOLOAD: "readonly",
    FORCE_TRACKING: "readonly",
    ARCHIFILTRE_SITE_URL: "readonly",
    SENTRY_DSN: "readonly",
    SENTRY_MINIDUMP_URL: "readonly",
    REACT_DEV_TOOLS_PATH: "readonly",
    WRITE_DEBUG: "readonly",
  },
  plugins: ["lodash-fp"],
  overrides: [
    {
      files: ["src/**/*.test.js", "src/**/*.test.ts", "src/test/**/*.js"],
      env: {
        jest: true,
      },
    },
  ],
};
