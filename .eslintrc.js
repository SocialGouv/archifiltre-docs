module.exports = {
  extends: ["@socialgouv/eslint-config-react"],
  globals: {
    ARCHIFILTRE_SITE_URL: "readonly",
    AUTOLOAD: "readonly",
    FORCE_TRACKING: "readonly",
    MODE: "readonly",
    REACT_DEV_TOOLS_PATH: "readonly",
    SENTRY_DSN: "readonly",
    SENTRY_MINIDUMP_URL: "readonly",
    STATIC_ASSETS_PATH: "readonly",
    WRITE_DEBUG: "readonly",
  },
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ["src/**/*.test.js", "src/**/*.test.ts", "src/test/**/*.js"],
    },
  ],
  plugins: ["lodash-fp"],
  settings: {
    "import/resolver": "webpack",
  },
};
